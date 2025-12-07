import { useState } from "react";
import axios from "axios";

const UploadProfilePicture = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return setError("Please select a file first.");

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Replace with real JWT token
      const token = localStorage.getItem("token") || "";

      const res = await axios.post("/api/profile/upload-pfp", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setUploadedUrl(res.data.url!);
      } else {
        setError(res.data.message || "Upload failed.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Upload Profile Picture</h1>

      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {uploadedUrl && (
        <div className="mt-4">
          <p>Upload successful! Preview:</p>
          <img src={uploadedUrl} alt="Profile" className="mt-2 w-32 h-32 object-cover rounded-full" />
        </div>
      )}
    </div>
  );
};

export default UploadProfilePicture;
