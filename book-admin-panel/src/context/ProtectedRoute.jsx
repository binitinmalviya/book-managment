import React, { useContext } from 'react';
import { AdminContext } from './useAdminContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const { admin } = useContext(AdminContext);

    if (!admin) {
        return <Navigate to="/" replace />;
    }

    return children;
}
