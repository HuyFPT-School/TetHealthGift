import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AdminNavbar from "./components/layout/AdminNavbar";
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
import AccountPage from "./pages/Account/index";
import CartPage from "./pages/WishlistManagement/CartPage";
import PayMoneyPage from "./pages/WishlistManagement/PayMoneyPage";

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
        Dang kiem tra quyen truy cap...
      </div>
    </div>
  );
}

//  Admin: /admin/products, /admin/analytics
function AdminOnlyRoute() {
  const { token, user, loading } = useAuth();
  if (loading) return <AuthLoading />;
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "Admin") return <Navigate to="/" replace />;
  return <Outlet />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/qua-tet" element={<ProductListingPage />} />
          <Route path="/qua-tet/:id" element={<ProductDetailPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<PayMoneyPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminOnlyRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
          </Route>
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmailOTP />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
