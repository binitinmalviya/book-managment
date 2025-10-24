import axios from 'axios';
import React, { useContext, useState } from 'react';
import { AdminContext } from '../context/useAdminContext';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isLoader, setLoader] = useState(false);
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_KEY;
    const { setAdmin } = useContext(AdminContext);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoader(true);
            const response = await axios.post(`${baseUrl}/auth/login`, { ...formData, role: "admin" });
            if (response.data.statusCode == 200) {
                const user = response.data.user;
                const accessToken = response.data.access_token;
                const message = response.data.message;
                setAdmin({ ...user, accessToken })
                toast(`${message}`);
                setTimeout(() => {
                    navigate('/admin')
                }, 900)
            }
        } catch (error) {
            toast.error(`${error.response?.data?.message}`)
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 px-2">
            <Toaster />
            <div className="relative flex w-96 flex-col space-y-5 rounded-lg border bg-white px-5 py-10 shadow-xl">
                <div className="-z-10 absolute top-4 left-1/2 h-full w-5/6 -translate-x-1/2 rounded-lg bg-blue-600"></div>

                <div className="mx-auto mb-2 space-y-3">
                    <h1 className="text-center text-3xl font-bold text-gray-700">Admin Sign In</h1>
                    <p className="text-gray-500 text-center">Sign in to access your account</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative mt-2 w-full">
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="email"
                            className="absolute left-1 top-2 z-10 -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 
                            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 
                            peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
                        >
                            Enter Your Email
                        </label>
                    </div>

                    <div className="relative mt-2 w-full">
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="password"
                            className="absolute left-1 top-2 z-10 -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 
                            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 
                            peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
                        >
                            Enter Your Password
                        </label>
                    </div>

                    <div className="flex w-full items-center justify-center">
                        <button
                            type="submit"
                            disabled={isLoader}
                            className={`inline-block cursor-pointer w-36 rounded-lg py-3 font-bold text-white transition 
                            ${isLoader ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                        >
                            {isLoader ? "Loading..." : "Login"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
