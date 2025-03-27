import UploadForm from './components/UploadForm';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">People Detection</h1>
        <p className="text-gray-600">Upload an image to detect and count people</p>
      </div>

      <UploadForm />
    </div>
  );
}
