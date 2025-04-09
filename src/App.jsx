"use client";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RedirectPage from "./pages/RedirectPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const { isAuthenticated, loading } = useAuth();

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading)
      return (
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      );

    if (!isAuthenticated) return <Navigate to="/" replace />;

    return children;
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/:shortCode" element={<RedirectPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
