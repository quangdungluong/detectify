'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import api, { PaginationResult } from '../services/api';

const DetectionHistory = () => {
    const [detections, setDetections] = useState<PaginationResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination and filter state
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState('');
    const [minPeople, setMinPeople] = useState<number | undefined>(undefined);
    const [maxPeople, setMaxPeople] = useState<number | undefined>(undefined);
    const [searchInput, setSearchInput] = useState('');
    const [minPeopleInput, setMinPeopleInput] = useState<string>('');
    const [maxPeopleInput, setMaxPeopleInput] = useState<string>('');

    const fetchDetections = async () => {
        try {
            setLoading(true);
            const result = await api.getDetections(page, limit, minPeople, maxPeople, search);
            setDetections(result);
            setError(null);
        } catch (err) {
            console.error('Error fetching detections:', err);
            setError('Failed to load detection history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetections();
    }, [page, limit, minPeople, maxPeople, search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1); // Reset to first page when searching
    };

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        setMinPeople(minPeopleInput ? parseInt(minPeopleInput) : undefined);
        setMaxPeople(maxPeopleInput ? parseInt(maxPeopleInput) : undefined);
        setPage(1); // Reset to first page when filtering
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || (detections && newPage > detections.pages)) return;
        setPage(newPage);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getImageUrl = (imagePath: string) => {
        if (imagePath.startsWith('/static')) {
            return `http://localhost:8000${imagePath}`;
        }
        return `http://localhost:8000/static${imagePath.substring(imagePath.indexOf('/images'))}`;
    };

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="md:flex-1">
                    <div className="flex">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search by filename..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                        >
                            Search
                        </button>
                    </div>
                </form>

                <form onSubmit={handleFilter} className="flex gap-2">
                    <div>
                        <input
                            type="number"
                            value={minPeopleInput}
                            onChange={(e) => setMinPeopleInput(e.target.value)}
                            placeholder="Min people"
                            className="w-28 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            value={maxPeopleInput}
                            onChange={(e) => setMaxPeopleInput(e.target.value)}
                            placeholder="Max people"
                            className="w-28 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                        Filter
                    </button>
                </form>
            </div>

            {error && (
                <div className="p-4 mb-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-2 text-gray-600">Loading...</p>
                </div>
            ) : (
                <>
                    {detections && detections.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                        <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</th>
                                        <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">People</th>
                                        <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                        <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {detections.data.map((detection) => (
                                        <tr key={detection.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <img
                                                    src={getImageUrl(detection.image_path)}
                                                    alt={`Detection ${detection.id}`}
                                                    className="h-16 w-auto object-cover rounded"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {detection.original_filename}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <span className="font-medium">{detection.num_people}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(detection.timestamp)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <Link
                                                    href={`/detection/${detection.id}`}
                                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <p className="text-gray-600">No detection records found</p>
                        </div>
                    )}

                    {detections && detections.pages > 1 && (
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-gray-600">
                                Showing {detections.data.length} of {detections.total} results
                            </div>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: Math.min(5, detections.pages) }, (_, i) => {
                                    let pageNumber;
                                    if (detections.pages <= 5) {
                                        pageNumber = i + 1;
                                    } else if (page <= 3) {
                                        pageNumber = i + 1;
                                    } else if (page >= detections.pages - 2) {
                                        pageNumber = detections.pages - 4 + i;
                                    } else {
                                        pageNumber = page - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={`px-3 py-1 border ${pageNumber === page
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'border-gray-300 hover:bg-gray-100'
                                                } rounded-md`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === detections.pages}
                                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DetectionHistory;
