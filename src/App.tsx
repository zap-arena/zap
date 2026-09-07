import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import ContestEntryPage from "./pages/ContestEntryPage";
import ContestsPage from "./pages/ContestsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useAuth } from "./store/auth";

// Admin screens and the Monaco-based workspace are large and rarely the entry point, so they
// load on demand instead of inflating the initial download.
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminContestDetail = lazy(
  () => import("./pages/admin/AdminContestDetail"),
);
const AdminContests = lazy(() => import("./pages/admin/AdminContests"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLogs = lazy(() => import("./pages/admin/AdminLogs"));
const AdminParticipants = lazy(() => import("./pages/admin/AdminParticipants"));
const AdminProblems = lazy(() => import("./pages/admin/AdminProblems"));
const AdminSubmissions = lazy(() => import("./pages/admin/AdminSubmissions"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminCodeWar = lazy(() => import("./pages/admin/AdminCodeWar"));
const ProgressiveAnalyticsPage = lazy(
  () => import("./pages/admin/ProgressiveAnalyticsPage"),
);
const ContestWorkspacePage = lazy(() => import("./pages/ContestWorkspacePage"));
const ContestResultPage = lazy(() => import("./pages/ContestResultPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuth();
  if (!isInitialized)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuth();
  if (!isInitialized)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" closeButton duration={4000} />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/contests" element={<ContestsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/contest/:slug" element={<ContestEntryPage />} />

          {/* Authenticated user */}
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/contest/:contestId/workspace"
            element={
              <RequireAuth>
                <ContestWorkspacePage />
              </RequireAuth>
            }
          />
          <Route
            path="/contest/:contestId/result"
            element={
              <RequireAuth>
                <ContestResultPage />
              </RequireAuth>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/problems"
            element={
              <RequireAdmin>
                <AdminProblems />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/contests"
            element={
              <RequireAdmin>
                <AdminContests />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/contests/:id"
            element={
              <RequireAdmin>
                <AdminContestDetail />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/contests/:id/progressive-analytics"
            element={
              <RequireAdmin>
                <ProgressiveAnalyticsPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/code-war"
            element={
              <RequireAdmin>
                <AdminCodeWar />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/participants"
            element={
              <RequireAdmin>
                <AdminParticipants />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/submissions"
            element={
              <RequireAdmin>
                <AdminSubmissions />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <RequireAdmin>
                <AdminLogs />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RequireAdmin>
                <AdminUsers />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <RequireAdmin>
                <AdminAnalytics />
              </RequireAdmin>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
