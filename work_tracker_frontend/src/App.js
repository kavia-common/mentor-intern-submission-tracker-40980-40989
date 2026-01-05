import React from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import RoleSelect from "./pages/RoleSelect";
import MentorDashboard from "./pages/MentorDashboard";
import MentorParticipantDetails from "./pages/MentorParticipantDetails";
import InternDashboard from "./pages/InternDashboard";

/**
 * Internal layout wrapper that decides whether to show the global header based on route.
 * We keep it simple: always show the header (header-only layout requirement).
 */
function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // UI-only logout: route back to role chooser.
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-teal-50">
      <Header
        onLogout={handleLogout}
        currentPath={location.pathname}
      />
      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<RoleSelect />} />
          <Route path="/mentor" element={<MentorDashboard />} />
          <Route path="/mentor/participant/:id" element={<MentorParticipantDetails />} />
          <Route path="/intern" element={<InternDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Main application entry component. Provides client-side routing for the UI-only app. */
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
