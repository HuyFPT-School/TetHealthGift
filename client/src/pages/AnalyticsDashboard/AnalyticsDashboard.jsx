import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import axiosInstance from "@/lib/axios";
import { Spinner, vnd, fmtDate, StatusBadge } from "../../components/CM/Components";
import "./AnalyticsDashboard.css";

const KpiCard = ({ icon, iconBg, label, value, borderColor }) => (
  <div className="kpi-card" style={{ borderTopColor: borderColor }}>
    <div className="kpi-icon" style={{ background: iconBg }}>{icon}</div>
    <div className="kpi-value">{value}</div>
    <div className="kpi-label">{label}</div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      <div className="chart-tooltip-value">{vnd(payload[0].value)}</div>
    </div>
  );
};

const PIE_COLORS = ["#9B1C1C","#D4920A","#1A1A2E","#F4A39A","#2E7D52","#6B21A8"];

const AnalyticsDashboard = () => {
  const [orders,   setOrders]   = useState([]);
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [oRes, pRes] = await Promise.all([
          axiosInstance.get("/api/orders?limit=200"),
          axiosInstance.get("/api/products?limit=200"),
        ]);

        // Backend trả { message, data: { orders: [] } } và { message, data: { products: [] } }
        const orderList   = oRes.data?.data?.orders   || oRes.data?.orders   || [];
        const productList = pRes.data?.data?.products || pRes.data?.products || [];

        setOrders(Array.isArray(orderList)   ? orderList   : []);
        setProducts(Array.isArray(productList) ? productList : []);
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="page-center"><Spinner size={36} /></div>;
  if (error)   return <div className="page-error">❌ Lỗi tải dữ liệu: {error}</div>;

  // ── Computed — dùng totalAmount (đúng với MongoDB) ──
  const today      = new Date().toDateString();
  const todayOrds  = orders.filter(o => new Date(o.createdAt).toDateString() === today);
  const todayRev   = todayOrds.reduce((s, o) => s + (o.totalAmount || o.totalPrice || 0), 0);
  const totalRev   = orders
    .filter(o => o.orderStatus !== "cancelled")
    .reduce((s, o) => s + (o.totalAmount || o.totalPrice || 0), 0);
  const lowStock   = products.filter(p => (p.quantity || 0) <= 10);
  const processing = orders.filter(o => o.orderStatus === "processing").length;

  // ── Revenue last 7 days ──
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = d.toDateString();
    const rev = orders
      .filter(o => new Date(o.createdAt).toDateString() === ds && o.orderStatus !== "cancelled")
      .reduce((s, o) => s + (o.totalAmount || o.totalPrice || 0), 0);
    return { day: d.toLocaleDateString("vi-VN", { weekday: "short" }), v: rev };
  });

  // ── Category pie ──
  const catMap = {};
  products.forEach(p => {
    const name = p.category?.name || p.category || "Khác";
    catMap[name] = (catMap[name] || 0) + 1;
  });
  const pieData = Object.entries(catMap).map(([name, value], i) => ({
    name, value, color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  return (
    <div className="dashboard-page fade-in">

      {/* KPI Grid */}
      <div className="kpi-grid">
        <KpiCard icon="🛒" iconBg="#DBEAFE" label="Đơn Hàng Hôm Nay"  value={todayOrds.length} borderColor="#1E40AF" />
        <KpiCard icon="💵" iconBg="#DCFCE7" label="Doanh Thu Hôm Nay" value={vnd(todayRev)}    borderColor="#166534" />
        <KpiCard icon="⚠️" iconBg="#FEE2E2" label="Sản Phẩm Sắp Hết"  value={lowStock.length}  borderColor="#991B1B" />
        <KpiCard icon="📦" iconBg="#F3E8FF" label="Tổng Sản Phẩm"     value={products.length}  borderColor="#6B21A8" />
        <KpiCard icon="💰" iconBg="#FEF9C3" label="Tổng Doanh Thu"     value={vnd(totalRev)}    borderColor="#92400E" />
        <KpiCard icon="📋" iconBg="#F0FDF4" label="Chờ Xác Nhận"       value={processing}       borderColor="#166534" />
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="card chart-card">
          <h3 className="card-title">Biểu đồ doanh thu 7 ngày</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={last7} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1e6 ? (v/1e6).toFixed(1)+"M" : v >= 1e3 ? (v/1e3).toFixed(0)+"K" : v} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="v" stroke="#9B1C1C" strokeWidth={2.5}
                dot={{ r: 4, fill: "#9B1C1C", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            <span className="legend-line" />
            <span className="legend-label">Doanh thu</span>
          </div>
        </div>

        <div className="card pie-card">
          <h3 className="card-title">Phân bổ danh mục</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                    dataKey="value" paddingAngle={3}>
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={v => `${v} SP`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {pieData.map((d, i) => (
                  <div key={i} className="pie-legend-item">
                    <div className="pie-dot" style={{ background: d.color }} />
                    <span className="pie-name">{d.name}</span>
                    <span className="pie-count" style={{ color: d.color }}>{d.value} SP</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">Không có dữ liệu</div>
          )}
        </div>
      </div>

      {/* Low Stock */}
      {lowStock.length > 0 && (
        <div className="card low-stock-card">
          <h3 className="card-title warn-title">
            <span>⚠️</span> Cảnh báo tồn kho thấp ({lowStock.length} sản phẩm)
          </h3>
          {lowStock.slice(0, 5).map((p, i) => (
            <div key={p._id} className={`low-stock-row${i % 2 === 0 ? " alt" : ""}`}>
              <div className="low-stock-info">
                {p.images?.[0]
                  ? <img src={p.images[0]} className="low-stock-img" alt={p.name} />
                  : <div className="low-stock-img placeholder">📦</div>
                }
                <div>
                  <div className="low-stock-name">{p.name}</div>
                  <div className="low-stock-cat">{p.category?.name || p.category || "—"}</div>
                </div>
              </div>
              <div className="low-stock-right">
                <div className="low-stock-qty">{p.quantity} sản phẩm còn lại</div>
                <div className="low-stock-price">{vnd(p.price)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      <div className="card recent-orders-card">
        <h3 className="card-title">🕐 Đơn hàng gần đây</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                {["Mã đơn","Khách hàng","Tổng tiền","Trạng thái","Thời gian"].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((o, i) => (
                <tr key={o._id} className="row-hover"
                  style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                  <td className="order-id">#{o._id?.slice(-6).toUpperCase()}</td>
                  <td>{o.customer?.fullname || o.customerId?.fullname || o.userId?.fullname || "—"}</td>
                  <td className="order-total">{vnd(o.totalAmount || o.totalPrice)}</td>
                  <td><StatusBadge status={o.orderStatus} /></td>
                  <td className="order-date">{fmtDate(o.createdAt)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={5} className="empty-row">Chưa có đơn hàng nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;