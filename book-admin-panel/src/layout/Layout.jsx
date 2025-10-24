import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AdminContext } from '../context/useAdminContext';
import { BookAIcon } from 'lucide-react';

export default function Layout() {
    const { admin, setAdmin } = useContext(AdminContext)
    let userName;
    if (admin) {
        console.log(`admin ............`, admin);
    }
    const handleLogout = () => {
        setAdmin(null)
    }
    return (
        <main className="min-h-screen flex flex-col bg-gray-100">
            <nav className="w-full bg-white shadow h-16 flex justify-between items-center px-6 ">
                <h3 className="text-xl font-bold text-purple-700 flex gap-2 items-center"><BookAIcon className='w-11 h-11' />Book Plaza</h3>

                <el-dropdown className="inline-block">
                    <button className="inline-flex w-full  justify-center gap-x-1.5 rounded-md bg-purple-700 px-3 py-2 text-sm font-semibold  inset-ring-1 inset-ring-white/5 text-white cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-user-icon lucide-circle-user"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" /><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" /></svg>
                        {userName}
                        <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" className="-mr-1 size-5 text-gray-400">
                            <path d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" fillRule="evenodd" />
                        </svg>
                    </button>

                    <el-menu anchor="bottom end" popover className="w-36 origin-top-right rounded-md bg-purple-800 outline-1 -outline-offset-1 outline-white/10 transition transition-discrete [--anchor-gap:--spacing(2)] data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                        <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-sm text-gray-300 focus:bg-white/5 focus:text-white focus:outline-hidden cursor-pointer">Log out</button>
                    </el-menu>
                </el-dropdown>
            </nav>

            <div className="flex flex-1">
                <aside className="w-64 bg-purple-700 text-white flex flex-col">
                    <nav className="flex-1 flex flex-col mt-4">
                        <NavLink
                            to="/admin"
                            end
                            className={({ isActive }) =>
                                `px-6 py-3 hover:bg-gray-700 ${isActive ? 'bg-purple-500' : ''}`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/admin/inventory"
                            className={({ isActive }) =>
                                `px-6 py-3 hover:bg-gray-700 ${isActive ? 'bg-purple-800' : ''}`
                            }
                        >
                            Inventory
                        </NavLink>
                    </nav>
                </aside>

                <div className="flex-1 p-6">
                    <Outlet />
                </div>
            </div>
        </main>
    );
}
