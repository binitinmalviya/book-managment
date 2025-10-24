import React, { createContext, useState } from 'react'

const AdminContext = createContext(null);

export default function AdminAuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    return (
        <AdminContext.Provider value={{ admin, setAdmin }}>
            {children}
        </AdminContext.Provider>
    )
}

export { AdminContext };