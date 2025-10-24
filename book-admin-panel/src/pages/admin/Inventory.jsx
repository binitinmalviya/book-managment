import { useContext, useEffect, useState } from "react";
import Table from "../../components/Table";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { AdminContext } from "../../context/useAdminContext";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

export default function Inventory() {
    const { admin } = useContext(AdminContext)
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const columns = [
        { header: "BookId", accessor: "_id" },
        { header: "Title", accessor: "title" },
        { header: "Publisher", accessor: "publisher" },
        { header: "PublishedDt", accessor: "publishedDate" },
        { header: "Author", accessor: "author" },
        { header: "Thumbnail", accessor: "thumbnail" },
        { header: "Images", accessor: "images" },
    ];

    const actions = [
        {
            label: "Edit",
            variant: "edit",
            icon: <Pencil className="cursor-pointer text-purple-500" />,
            onClick: (row) => {
                console.log("Edit", row)
                navigate(`/admin/update-book`, { state: { book: row } })
            },
        },
        {
            label: "Delete",
            variant: "delete",
            icon: <Trash2 className="cursor-pointer text-purple-500" />,
            onClick: (row) => {
                console.log("Delete", row)
                handleDeleteBook(row)
            },
        }
    ]


    const handleDeleteBook = async (row) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_KEY}/books/${row._id}`, {
                headers: {
                    'Authorization': `Bearer ${admin.accessToken}`
                }
            })
            if (response.data.statusCode == 200) {
                toast(response.data.message)
                await fetchBooks()
            }
        } catch (error) {
            toast(error.response.data.message)
        }
    }


    async function fetchBooks() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_KEY}/books`, {
                headers: {
                    'Authorization': `Bearer ${admin.accessToken}`
                }
            });
            if (response.data.statusCode == 200) {
                setData(response.data.data)
            }
        } catch (error) {
            toast(error.response.data.message)
        }
    }

    useEffect(() => {
        const fetchData = async () => { await fetchBooks() }
        fetchData()
    }, [])




    return (
        <div className="p-6 bg-white shadow rounded flex flex-col">
            <Toaster />
            <div className="w-full">
                <button type="button" onClick={() => { navigate("/admin/add-book") }} className="cursor-pointer float-end text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2">Add Book</button>
            </div>
            <Table columns={columns} data={data} actions={actions} />
        </div>
    );
}
