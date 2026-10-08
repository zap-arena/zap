import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RouteTransitionLoader from "./components/RouteTransitionLoader";
import { Toaster } from "./components/ui/sonner";
import CodeWarPage from "./pages/CodeWarPage";
import ContestEntryPage from "./pages/ContestEntryPage";
import ContestLandingPage from "./pages/ContestLandingPage";
import ContestsPage from "./pages/ContestsPage";
import CurriculumDSAPage from "./pages/CurriculumDSAPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AIBasicsGuidePage from "./pages/guide/AIBasicsGuidePage";
import ApiBasicsGuidePage from "./pages/guide/ApiBasicsGuidePage";
import DP1DGuidePage from "./pages/guide/DP1DGuidePage";
import DP2DGuidePage from "./pages/guide/DP2DGuidePage";
import HashingDsaGuidePage from "./pages/guide/HashingDsaGuidePage";
import LinkedListDsaGuidePage from "./pages/guide/LinkedListDsaGuidePage";
import OopsGuidePage from "./pages/guide/OopsGuidePage";
import OopsVisualGuidePage from "./pages/guide/OopsVisualGuidePage";
import QueueDsaGuidePage from "./pages/guide/QueueDsaGuidePage";
import RecursionDsaGuidePage from "./pages/guide/RecursionDsaGuidePage";
import SdlcGuidePage from "./pages/guide/SdlcGuidePage";
import SlidingWindowDsaGuidePage from "./pages/guide/SlidingWindowDsaGuidePage";
import SqlGuidePage from "./pages/guide/SqlGuidePage";
import StackDsaGuidePage from "./pages/guide/StackDsaGuidePage";
import TwoPointerDsaGuidePage from "./pages/guide/TwoPointerDsaGuidePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import QuizListPage from "./pages/QuizListPage";
import QuizTakingPage from "./pages/QuizTakingPage";
import RegisterPage from "./pages/RegisterPage";
import { useAuth } from "./store/auth";

const AdminQuizzes = lazy(() => import("./pages/admin/AdminQuizzes"));

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
      <RouteTransitionLoader />
      <Toaster position="top-right" closeButton duration={4000} />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/contests" element={<ContestLandingPage />} />
          <Route path="/contests/list" element={<ContestsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/contest/:slug" element={<ContestEntryPage />} />

          {/* Authenticated user */}
          <Route
            path="/curriculum/dsa"
            element={
              <RequireAuth>
                <CurriculumDSAPage />
              </RequireAuth>
            }
          />
          <Route
            path="/curriculum/dsa/hashing"
            element={
              <RequireAuth>
                <HashingDsaGuidePage />
              </RequireAuth>
            }
          />
          <Route
            path="/curriculum/dsa/sliding-window"
            element={
              <RequireAuth>
                <SlidingWindowDsaGuidePage />
              </RequireAuth>
            }
          />
          <Route
            path="/curriculum/dsa/two-pointer"
            element={
              <RequireAuth>
                <TwoPointerDsaGuidePage />
              </RequireAuth>
            }
          />
          <Route
            path="/curriculum/dsa/recursion"
            element={
              <RequireAuth>
                <RecursionDsaGuidePage />
              </RequireAuth>
            }
          />
          <Route
            path="/curriculum/dsa/stack"
            element={
              <RequireAuth>
                <StackDsaGuidePage />
              </RequireAuth>
            }
          />
          <Route
            path="/curriculum/dsa/queue"
            element={
              <RequireAuth>
                <QueueDsaGuidePage />
              </RequireAuth>
            }
          />
          <Route
            path="/curriculum/dsa/linked-list"
            element={
              <RequireAuth>
                <LinkedListDsaGuidePage />
              </RequireAuth>
            }
          />
          <Route
            path="/curriculum/dsa/dp-1d"
            element={
              <RequireAuth>
                <DP1DGuidePage />
              </RequireAuth>
            }
          />
          <Route
            path="/curriculum/dsa/dp-2d"
            element={
              <RequireAuth>
                <DP2DGuidePage />
              </RequireAuth>
            }
          />
          <Route
            path="/curriculum/dsa/oops"
            element={
              <RequireAuth>
                <OopsGuidePage />
              </RequireAuth>
            }
          />
          <Route
            path="/curriculum/dsa/oops-visual"
            element={
              <RequireAuth>
                <OopsVisualGuidePage />
              </RequireAuth>
            }
          />
          <Route
            path="/curriculum/dsa/sdlc"
            element={
              <RequireAuth>
                <SdlcGuidePage />
              </RequireAuth>
            }
          />
          <Route
            path="/curriculum/dsa/ai-basics"
            element={
              <RequireAuth>
                <AIBasicsGuidePage />
              </RequireAuth>
            }
          />
          <Route
            path="/curriculum/dsa/api-basics"
            element={
              <RequireAuth>
                <ApiBasicsGuidePage />
              </RequireAuth>
            }
          />
          <Route
            path="/curriculum/dsa/sql"
            element={
              <RequireAuth>
                <SqlGuidePage />
              </RequireAuth>
            }
          />
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

          <Route
            path="/quizzes"
            element={
              <RequireAuth>
                <QuizListPage />
              </RequireAuth>
            }
          />
          <Route
            path="/quizzes/:id"
            element={
              <RequireAuth>
                <QuizTakingPage />
              </RequireAuth>
            }
          />
          <Route path="/codewar" element={<CodeWarPage />} />

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
            path="/admin/quizzes"
            element={
              <RequireAdmin>
                <AdminQuizzes />
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
