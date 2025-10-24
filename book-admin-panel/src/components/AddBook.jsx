import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/useAdminContext";

export default function AddBook() {
    const [formData, setFormData] = useState({
        title: "",
        publishedDate: "",
        publisher: "",
        author: "",
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [images, setImages] = useState([]);

    const { admin } = useContext(AdminContext);
    const [isLoader, setLoader] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_KEY;

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) setThumbnail(file);
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const uploadExtraImages = async (bookId) => {
        if (!images.length) return;

        const imgForm = new FormData();
        images.forEach((img) => imgForm.append("images", img));

        try {
            setIsImageUploading(true);
            const res = await axios.put(`${baseUrl}/books/${bookId}/images`, imgForm, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${admin.accessToken}`,
                },
            });

            if (res.data.statusCode === 200) {
                toast.success("Additional images uploaded successfully!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload images");
        } finally {
            setIsImageUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoader(true);
            const bookForm = new FormData();
            bookForm.append("title", formData.title);
            bookForm.append("publishedDate", formData.publishedDate);
            bookForm.append("publisher", formData.publisher);
            bookForm.append("author", formData.author);
            if (thumbnail) {
                bookForm.append("thumbnail", thumbnail);
            }
            const response = await axios.post(`${baseUrl}/books`, bookForm, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${admin.accessToken}`,
                },
            });

            if (response.data.statusCode === 201) {
                const bookId = response.data.data._id;
                toast.success(response.data.message);
                await uploadExtraImages(bookId);
                setTimeout(() => {
                    navigate("/admin/inventory");
                }, 1000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="w-full rounded p-6 grid place-content-center">
            <div className="max-w-3xl bg-white shadow-lg p-6 rounded">
                <h2 className="text-xl font-semibold mb-4 text-center">Add Book</h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            id="title"
                            placeholder="Title"
                            value={formData.title}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        />

                        <input
                            type="date"
                            id="publishedDate"
                            value={formData.publishedDate}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        />

                        <input
                            type="text"
                            id="publisher"
                            placeholder="Publisher"
                            value={formData.publisher}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        />

                        <input
                            type="text"
                            id="author"
                            placeholder="Author"
                            value={formData.author}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        />

                        {/* Thumbnail input */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="border p-2 rounded col-span-2"
                        />

                        {/* Extra images input */}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImagesChange}
                            className="border p-2 rounded col-span-2"
                        />
                    </div>

                    <div className="p-4 w-full text-center">
                        <button
                            type="submit"
                            disabled={isLoader || isImageUploading}
                            className="bg-purple-700 cursor-pointer text-white rounded-full px-6 py-2.5 hover:bg-purple-800 disabled:opacity-70"
                        >
                            {isLoader
                                ? "Adding..."
                                : isImageUploading
                                    ? "Uploading Images..."
                                    : "Add Book"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
