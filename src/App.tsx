import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./components/protectedRoutes";
import { Login } from "./components/auth/login";
import { Toaster } from "sonner";
import SearcherVehicles from "./components/dashboard/searcherVehicles";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster richColors position="bottom-center" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes (Condo Access Control) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<SearcherVehicles />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
