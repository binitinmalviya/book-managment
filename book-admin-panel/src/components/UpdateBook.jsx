import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminContext } from "../context/useAdminContext";

export default function UpdateBook() {
    const location = useLocation();
    const book = location.state?.book;

    const [formData, setFormData] = useState({
        title: "",
        publishedDate: "",
        publisher: "",
        author: "",
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const { admin } = useContext(AdminContext);
    const [isLoader, setLoader] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        if (book && Object.keys(book).length > 0) {
            setFormData({
                title: book.title || "",
                publishedDate: book.publishedDate || "",
                publisher: book.publisher || "",
                author: book.author || "",
            });
            if (book.thumbnail) {
                setThumbnailPreview(`${book.thumbnail}`);
            }
            if (book.images?.length) {
                setImagePreviews(book.images.map((img) => `${img}`));
            }
        }
    }, [book]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files || []);
        setImages(files);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews([...newPreviews]);
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
                    Authorization: `Bearer ${admin?.accessToken}`,
                },
            });

            if (res.data.statusCode === 200) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            setIsImageUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return toast.error("Title is required");

        try {
            setLoader(true);

            const bookForm = new FormData();
            bookForm.append("title", formData.title);
            bookForm.append("publishedDate", formData.publishedDate);
            bookForm.append("publisher", formData.publisher);
            bookForm.append("author", formData.author);
            if (thumbnail) bookForm.append("thumbnail", thumbnail);

            const response = await axios.put(`${baseUrl}/books/${book._id}`, bookForm, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${admin?.accessToken}`,
                },
            });

            if (response.data.statusCode === 200) {
                const bookId = response.data.data._id;
                toast.success(response.data.message || "Book updated successfully");
                await uploadExtraImages(bookId);
                setTimeout(() => navigate("/admin/inventory"), 1000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update book");
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="w-full rounded p-6 grid place-content-center">
            <Toaster />
            <div className="max-w-3xl bg-white shadow-lg p-6 rounded">
                <h2 className="text-xl font-semibold mb-4 text-center">Update Book</h2>

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

                        <div className="col-span-2">
                            <label className="block mb-2 font-medium">Thumbnail</label>
                            <div className="flex gap-2">
                                {thumbnailPreview && (
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail Preview"
                                        className="w-32 h-32 object-cover rounded mb-2 border"
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block mb-2 font-medium">Book Images</label>
                            {imagePreviews.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {imagePreviews.map((src, idx) => (
                                        <img
                                            key={idx}
                                            src={src}
                                            alt={`Preview ${idx + 1}`}
                                            className="w-24 h-24 object-cover rounded border"
                                        />
                                    ))}
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImagesChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                    </div>

                    <div className="p-4 w-full text-center">
                        <button
                            type="submit"
                            disabled={isLoader || isImageUploading}
                            className="bg-purple-700 cursor-pointer text-white rounded-full px-6 py-2.5 hover:bg-purple-800 disabled:opacity-70"
                        >
                            {isLoader
                                ? "Updating..."
                                : isImageUploading
                                    ? "Uploading Images..."
                                    : "Update Book"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
