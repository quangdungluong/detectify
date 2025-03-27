import DetectionHistory from '../components/DetectionHistory';

export default function HistoryPage() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Detection History</h1>
                <p className="text-gray-600">View and search your previous people detection results</p>
            </div>

            <DetectionHistory />
        </div>
    );
}
