import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { useAuth } from './store/auth';

import HomePage from './pages/HomePage';
import ContestsPage from './pages/ContestsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContestEntryPage from './pages/ContestEntryPage';
import ContestWorkspacePage from './pages/ContestWorkspacePage';
import ContestResultPage from './pages/ContestResultPage';
import ProfilePage from './pages/ProfilePage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProblems from './pages/admin/AdminProblems';
import AdminContests from './pages/admin/AdminContests';
import AdminContestDetail from './pages/admin/AdminContestDetail';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminParticipants from './pages/admin/AdminParticipants';
import AdminSubmissions from './pages/admin/AdminSubmissions';
import AdminLogs from './pages/admin/AdminLogs';
import AdminUsers from './pages/admin/AdminUsers';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <HashRouter>
      <Toaster position="top-right" closeButton duration={4000} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/contests" element={<ContestsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/contest/:slug" element={<ContestEntryPage />} />

        {/* Authenticated user */}
        <Route path="/profile" element={
          <RequireAuth><ProfilePage /></RequireAuth>
        } />
        <Route path="/contest/:contestId/workspace" element={
          <RequireAuth><ContestWorkspacePage /></RequireAuth>
        } />
        <Route path="/contest/:contestId/result" element={
          <RequireAuth><ContestResultPage /></RequireAuth>
        } />

        {/* Admin */}
        <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/admin/problems" element={<RequireAdmin><AdminProblems /></RequireAdmin>} />
        <Route path="/admin/contests" element={<RequireAdmin><AdminContests /></RequireAdmin>} />
        <Route path="/admin/contests/:id" element={<RequireAdmin><AdminContestDetail /></RequireAdmin>} />
        <Route path="/admin/participants" element={<RequireAdmin><AdminParticipants /></RequireAdmin>} />
        <Route path="/admin/submissions" element={<RequireAdmin><AdminSubmissions /></RequireAdmin>} />
        <Route path="/admin/logs" element={<RequireAdmin><AdminLogs /></RequireAdmin>} />
        <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
        <Route path="/admin/analytics" element={<RequireAdmin><AdminAnalytics /></RequireAdmin>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
