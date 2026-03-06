import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HeaderManagement from "./components/layout/HeaderManagement/Header";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./components/PLP/ProductListingPage";
import ProductDetailPage from "./components/PDP/ProductDetailPage";
import "./styles/global.css";
import ProductManagement from "./pages/ProductManagement/ProductManagement";
import OrderManagement from "./pages/OrderManagement/OrderManagement";
import AnalyticsDashboard from "./pages/AnalyticsDashboard/AnalyticsDashboard";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import VerifyEmailOTP from "./pages/Auth/VerifyEmailOTP";
import { useAuth } from "./context/AuthContext";
import BlogPage from "./pages/BlogPage/BlogPage";
import BlogDetail from "./components/BlogDetail/BlogDetail";
import BlogManagement from "./pages/BlogManagement/BlogManagement";

function AuthLoading() {
  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"60vh" }}>
      <div style={{ fontSize:14, color:"#888" }}>Đang kiểm tra quyền truy cập...</div>
    </div>
  );
}

// Layout Guest + Member — Admin/StaffManager bị đẩy ra
function PublicLayout() {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoading />;
  if (user?.role === "Admin")        return <Navigate to="/admin/analytics" replace />;
  if (user?.role === "StaffManager") return <Navigate to="/staff/orders"    replace />;
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <Header />
      <main style={{ flex:1 }}><Outlet /></main>
      <Footer />
    </div>
  );
}

// Layout Admin — có HeaderManagement, không có Header/Footer public
function AdminLayout() {
  const { token, user, loading } = useAuth();
  if (loading) return <AuthLoading />;
  if (!token)  return <Navigate to="/login"  replace />;
  if (user?.role !== "Admin") return <Navigate to="/" replace />;
  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <HeaderManagement />
      <main><Outlet /></main>
    </div>
  );
}

// Layout StaffManager
function StaffManagerLayout() {
  const { token, user, loading } = useAuth();
  if (loading) return <AuthLoading />;
  if (!token)  return <Navigate to="/login" replace />;
  if (user?.role !== "StaffManager") return <Navigate to="/" replace />;
  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      {/* Có thể thêm HeaderStaff ở đây sau */}
      <main><Outlet /></main>
    </div>
  );
}

// Login: redirect nếu đã đăng nhập
function LoginRoute() {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoading />;
  if (user?.role === "Admin")        return <Navigate to="/admin/analytics" replace />;
  if (user?.role === "StaffManager") return <Navigate to="/staff/orders"    replace />;
  if (user)                          return <Navigate to="/"                replace />;
  return <Login />;
}

function App() {
  return (
    <Router>
      <Routes>

        {/* ── Public: Guest + Member ── */}
        <Route element={<PublicLayout />}>
          <Route path="/"            element={<HomePage />} />
          <Route path="/qua-tet"     element={<ProductListingPage />} />
          <Route path="/qua-tet/:id" element={<ProductDetailPage />} />
          <Route path="/blog"        element={<BlogPage />} />
          <Route path="/blog/:id"    element={<BlogDetail />} />
        </Route>

        {/* ── Admin: có HeaderManagement ── */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
          <Route path="/admin/products"  element={<ProductManagement />} />
          <Route path="/admin/blogs"     element={<BlogManagement />} />
        </Route>

        {/* ── StaffManager ── */}
        <Route element={<StaffManagerLayout />}>
          <Route path="/staff/orders" element={<OrderManagement />} />
        </Route>

        {/* ── Auth ── */}
        <Route path="/login"           element={<LoginRoute />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email"    element={<VerifyEmailOTP />} />

        {/* ── 404 ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;