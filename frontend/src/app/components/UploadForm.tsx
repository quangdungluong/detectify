'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import api, { DetectionResult } from '../services/api';

const UploadForm = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<DetectionResult | null>(null);
    const [confidence, setConfidence] = useState<number>(0.5);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);

        // Create preview
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        // Reset previous results
        setResult(null);
        setError(null);

        // Switch to file upload mode
        setUploadMethod('file');
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        },
        multiple: false
    });

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageUrl(e.target.value);
        setFile(null);
        setPreview(null);
        setResult(null);
        setError(null);
        setUploadMethod('url');
    };

    const handleConfidenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfidence(parseFloat(e.target.value));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            let detectionResult: DetectionResult;

            if (uploadMethod === 'file') {
                if (!file) {
                    setError('Please select an image first');
                    setLoading(false);
                    return;
                }
                detectionResult = await api.uploadImage(file, confidence);
            } else {
                if (!imageUrl.trim()) {
                    setError('Please enter an image URL');
                    setLoading(false);
                    return;
                }

                detectionResult = await api.uploadImageFromUrl(imageUrl, confidence);
            }

            setResult(detectionResult);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Error processing image:', err);
            setError(err.response?.data?.detail || 'Failed to process the image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="mb-6">
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setUploadMethod('file')}
                        className={`flex-1 py-2 px-4 ${uploadMethod === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        Upload File
                    </button>
                    <button
                        type="button"
                        onClick={() => setUploadMethod('url')}
                        className={`flex-1 py-2 px-4 ${uploadMethod === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        Image URL
                    </button>
                </div>
            </div>

            {uploadMethod === 'file' ? (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 hover:border-gray-400'
                        }`}
                >
                    <input {...getInputProps()} />

                    {preview ? (
                        <div className="relative">
                            <img
                                src={preview}
                                alt="Preview"
                                className="max-h-[400px] mx-auto rounded-lg"
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(null);
                                    setPreview(null);
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                aria-label="Remove image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="py-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600">Drag and drop an image, or click to select a file</p>
                            <p className="mt-1 text-xs text-gray-500">JPG, PNG, or JPEG</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="border-2 rounded-lg p-6">
                    <div className="flex flex-col">
                        <label htmlFor="image-url" className="block text-sm font-medium text-gray-700 mb-2">
                            Image URL
                        </label>
                        <input
                            type="url"
                            id="image-url"
                            value={imageUrl}
                            onChange={handleImageUrlChange}
                            placeholder="https://example.com/image.jpg"
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">Enter a direct URL to an image (must end with .jpg, .jpeg, .png, or .gif)</p>
                    </div>
                </div>
            )}

            <div className="mt-6 border-2 rounded-lg p-6">
                <div className="flex flex-col">
                    <label htmlFor="confidence" className="block text-sm font-medium text-gray-700 mb-2">
                        Confidence Threshold: {confidence.toFixed(2)}
                    </label>
                    <input
                        type="range"
                        id="confidence"
                        min="0.05"
                        max="0.95"
                        step="0.05"
                        value={confidence}
                        onChange={handleConfidenceChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Low (0.05)</span>
                        <span>Medium (0.5)</span>
                        <span>High (0.95)</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <div className="mt-4 flex justify-center">
                <button
                    onClick={handleSubmit}
                    disabled={loading || (uploadMethod === 'file' && !file) || (uploadMethod === 'url' && !imageUrl)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Processing...' : 'Detect People'}
                </button>
            </div>

            {result && (
                <div className="mt-8 p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Detection Results</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <img
                                src={`http://localhost:8000/static${result.image_path.substring(result.image_path.indexOf('/images'))}`}
                                alt="Detection result"
                                className="w-full rounded-lg border border-gray-300"
                            />
                        </div>

                        <div>
                            <div className="mb-4">
                                <span className="text-2xl font-bold text-gray-600">{result.num_people}</span>
                                <span className="ml-2 text-gray-700">people detected</span>
                            </div>

                            <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Original filename:</span> {result.original_filename}</p>
                                <p><span className="font-medium">Confidence threshold:</span> {result.confidence?.toFixed(2)}</p>
                                <p><span className="font-medium">Processing time:</span> {result.processing_time?.toFixed(2)}s</p>
                                <p><span className="font-medium">Image dimensions:</span> {result.image_width}×{result.image_height}px</p>
                                <p><span className="font-medium">Detection timestamp:</span> {new Date(result.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadForm;
