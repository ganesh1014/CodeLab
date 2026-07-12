import { Routes, Route, Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import ProblemPage from "./pages/ProblemPage";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";

// Components (Admin)
import AdminPanel from "./components/AdminPanel";
import AdminVideo from "./components/AdminVideo";
import AdminDelete from "./components/AdminDelete";
import AdminUpload from "./components/AdminUpload";
import AdminUpdateList from "./components/AdminUpdateList";
import AdminUpdateProblem from "./components/AdminUpdateProblem";

// Static pages
import About from "./sPages/About";
import Blog from "./sPages/Blog";
import Careers from "./sPages/Careers";
import Privacy from "./sPages/Privacy";
import Terms from "./sPages/Terms";
import NotFound from "./sPages/NotFound";

// Redux slice
import { checkAuth } from "./authSlice";

// Scroll restoration helper
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const didAuthCheck = useRef(false);

  // Check authentication only once
  useEffect(() => {
    if (!didAuthCheck.current) {
      didAuthCheck.current = true;
      dispatch(checkAuth());
    }
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* 404 – must be last in most setups, but keep as fallback */}
        <Route path="*" element={<NotFound />} />

        {/* Public & auth redirects */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" /> : <LandingPage />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/home" /> : <Signup />}
        />
        <Route
          path="/home"
          element={isAuthenticated ? <Homepage /> : <Navigate to="/" />}
        />

        {/* Static informational pages */}
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <Admin />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/admin/users"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminUsers />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/admin/create"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminPanel />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/admin/delete"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminDelete />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/admin/video"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminVideo />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/admin/upload/:problemId"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminUpload />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        {/* Problem route (protected) */}
        <Route
          path="/problem/:problemId"
          element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />}
        />

        {/* Update routes – fixed parameter naming */}
        <Route
          path="/admin/update"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminUpdateList />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/admin/update/:id"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminUpdateProblem />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        {/* Profile routes */}
        <Route path="/profile/:id" element={<Profile />} />
        <Route
          path="/me"
          element={
            isAuthenticated ? (
              <Navigate to={`/profile/${user?._id}`} replace />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Account & settings */}
        <Route
          path="/account"
          element={isAuthenticated ? <Account /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;