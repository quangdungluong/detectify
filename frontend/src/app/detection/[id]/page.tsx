'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api, { DetectionResult } from '../../services/api';

export default function DetectionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [detection, setDetection] = useState<DetectionResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetection = async () => {
            if (!params.id) {
                setError('Detection ID is missing');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const id = Number(params.id);
                const result = await api.getDetectionById(id);
                setDetection(result);
                setError(null);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error('Error fetching detection details:', err);
                if (err.response && err.response.status === 404) {
                    setError('Detection not found');
                } else {
                    setError(`Failed to load detection details: ${err.message || 'Unknown error'}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDetection();
    }, [params.id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const handleBack = () => {
        router.push('/history');
    };

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('/static')) {
            return `http://localhost:8000${imagePath}`;
        }
        return `http://localhost:8000/static${imagePath.substring(imagePath.indexOf('/images'))}`;
    };

    return (
        <div className="max-w-7xl mx-auto">
            <button
                onClick={handleBack}
                className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                    />
                </svg>
                Back to History
            </button>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-2 text-gray-600">Loading...</p>
                </div>
            ) : error ? (
                <div className="p-4 mb-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
                    {error}
                </div>
            ) : detection ? (
                <div>
                    <h1 className="text-2xl font-bold mb-6">Detection Details</h1>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-4">
                                <img
                                    src={getImageUrl(detection.image_path)}
                                    alt={`Detection ${detection.id}`}
                                    className="w-full h-auto"
                                />
                            </div>
                            <p className="text-sm text-gray-500">{detection.original_filename}</p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2">Detection Result</h2>
                                <div className="flex items-baseline">
                                    <span className="text-2xl font-bold text-gray-600">{detection.num_people}</span>
                                    <span className="ml-2 text-gray-700">people detected</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="text-lg font-medium mb-4">Details</h3>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2">
                                        <span className="text-gray-600">Detection ID:</span>
                                        <span className="font-medium">{detection.id}</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <span className="text-gray-600">Timestamp:</span>
                                        <span className="font-medium">{formatDate(detection.timestamp)}</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <span className="text-gray-600">Filename:</span>
                                        <span className="font-medium">{detection.original_filename}</span>
                                    </div>
                                    {detection.processing_time && (
                                        <div className="grid grid-cols-2">
                                            <span className="text-gray-600">Processing Time:</span>
                                            <span className="font-medium">{detection.processing_time.toFixed(2)}s</span>
                                        </div>
                                    )}
                                    {detection.confidence && (
                                        <div className="grid grid-cols-2">
                                            <span className="text-gray-600">Confidence Threshold:</span>
                                            <span className="font-medium">{detection.confidence}</span>
                                        </div>
                                    )}
                                    {detection.image_width && detection.image_height && (
                                        <div className="grid grid-cols-2">
                                            <span className="text-gray-600">Dimensions:</span>
                                            <span className="font-medium">
                                                {detection.image_width} × {detection.image_height} px
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-600">Detection not found</p>
                </div>
            )}
        </div>
    );
}
