import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/admin/Home";
import Layout from "./layout/layout";
import AdminAuthProvider from "./context/useAdminContext";
import ProtectedRoute from "./context/ProtectedRoute";
import Inventory from "./pages/admin/Inventory";
import AddBook from "./components/AddBook";
import UpdateBook from "./components/UpdateBook";

function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="add-book" element={<AddBook />} />
          <Route path="update-book" element={<UpdateBook />} />

        </Route>
      </Routes>

    </AdminAuthProvider>
  );
}

export default App;
