import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

export const ProtectedRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main>
      <Outlet />;
    </main>
  );
};
