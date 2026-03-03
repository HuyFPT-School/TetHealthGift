import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./components/PLP/ProductListingPage";
import ProductDetailPage from "./components/PDP/ProductDetailPage";
import "./styles/global.css";
import ProductManagement from "./pages/ProductManagement/ProductManagement";
import OrderManagement from "./pages/OrderManagement/OrderManagement";
import AnalyticsDashboard from "./pages/AnalyticsDashboard/AnalyticsDashboard";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/qua-tet" element={<ProductListingPage />} />
          <Route path="/qua-tet/:id" element={<ProductDetailPage />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
