import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AdminNavbar from "./components/layout/AdminNavbar";
import StaffNavbar from "./components/layout/StaffNavbar";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./components/PLP/ProductListingPage";
import ProductDetailPage from "./components/PDP/ProductDetailPage";
import "./styles/global.css";
import ProductManagement from "./pages/ProductManagement/ProductManagement";
import OrderManagement from "./pages/OrderManagement/OrderManagement";
import AnalyticsDashboard from "./pages/AnalyticsDashboard/AnalyticsDashboard";
import UserManagement from "./pages/UserManagement/UserManagement";
import BlogManagement from "./pages/BlogManagement/BlogManagement";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import VerifyEmailOTP from "./pages/Auth/VerifyEmailOTP";
import AccountPage from "./pages/Account/index";
import CartPage from "./pages/CartManagement/CartPage";
import PayMoneyPage from "./pages/CartManagement/PayMoneyPage";
import PaymentResultPage from "./pages/CartManagement/PaymentResultPage";
import OrderTrackingPage from "./pages/CartManagement/OrderTrackingPage";
import BlogPage from "./pages/BlogPage/BlogPage";
import BlogDetail from "./components/BlogDetail/BlogDetail";
import PromotionManagement from "./pages/PromotionManagement/PromotionManagement";
import CustomBasketBuilder from "./pages/CustomBasketBuilder/CustomBasketBuilder";
import PackagingManagement from "./pages/PackagingManagement/PackagingManagement";
import PromotionsPage from "./pages/PromotionsPage/PromotionsPage";

/* ── Loading ── */
function AuthLoading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
      }}
    >
      <div style={{ fontSize: 14, color: "#888" }}>
        Đang kiểm tra quyền truy cập...
      </div>
    </div>
  );
}

/* ── Placeholder cho trang chưa có API ── */
function ComingSoon({ title }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        gap: 16,
      }}
    >
      <div style={{ fontSize: 48 }}>🚧</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#374151" }}>
        {title}
      </div>
      <div style={{ fontSize: 14, color: "#9CA3AF" }}>
        Tính năng đang được phát triển
      </div>
    </div>
  );
}

/* ── Layouts ── */
function PublicLayout() {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AdminLayout() {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <AdminNavbar />
      <main style={{ flex: 1, background: "#f5f5f5" }}>
        <Outlet />
      </main>
    </div>
  );
}

function StaffLayout() {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <StaffNavbar />
      <main style={{ flex: 1, background: "#f5f5f5" }}>
        <Outlet />
      </main>
    </div>
  );
}

/* ── Guards ── */
function AdminOnlyRoute() {
  const { token, user, loading } = useAuth();
  if (loading) return <AuthLoading />;
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "Admin") return <Navigate to="/" replace />;
  return <Outlet />;
}

function StaffManagerOnlyRoute() {
  const { token, user, loading } = useAuth();
  if (loading) return <AuthLoading />;
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "StaffManager") return <Navigate to="/" replace />;
  return <Outlet />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Public ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/qua-tet" element={<ProductListingPage />} />
          <Route path="/qua-tet/:id" element={<ProductDetailPage />} />
          <Route path="/uu-dai" element={<PromotionsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/custom-basket" element={<CustomBasketBuilder />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<PayMoneyPage />} />
          <Route path="/payment-result" element={<PaymentResultPage />} />
          <Route path="/my-orders" element={<OrderTrackingPage />} />
        </Route>

        {/* ── Admin only ── */}
        <Route element={<AdminOnlyRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/packaging" element={<PackagingManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/blogs" element={<BlogManagement />} />
          </Route>
        </Route>

        {/* ── StaffManager only ── */}
        <Route element={<StaffManagerOnlyRoute />}>
          <Route element={<StaffLayout />}>
            <Route path="/staff/orders" element={<OrderManagement />} />
            <Route path="/staff/promotions" element={<PromotionManagement />} />
          </Route>
        </Route>

        {/* ── Auth ── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmailOTP />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
