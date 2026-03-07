import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fetchDashboardStats } from "../../services/analyticsService";
import {
  Spinner,
  vnd,
  fmtDate,
  StatusBadge,
} from "../../components/CM/Components";
import "./AnalyticsDashboard.css";

const KpiCard = ({ icon, iconBg, label, value, borderColor }) => (
  <div className="kpi-card" style={{ borderTopColor: borderColor }}>
    <div className="kpi-icon" style={{ background: iconBg }}>
      {icon}
    </div>
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

const PIE_COLORS = [
  "#9B1C1C",
  "#D4920A",
  "#1A1A2E",
  "#F4A39A",
  "#2E7D52",
  "#6B21A8",
];

const AnalyticsDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDashboardStats();
        setDashboardData(data);
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading)
    return (
      <div className="page-center">
        <Spinner size={36} />
      </div>
    );
  if (error) return <div className="page-error">Lỗi tải dữ liệu: {error}</div>;
  if (!dashboardData) return <div className="page-error">Không có dữ liệu</div>;

  const { kpis, revenueChart, recentOrders, categoryDistribution } =
    dashboardData;

  // Format data cho PieChart
  const pieData = categoryDistribution.map((item, index) => ({
    name: item.name,
    value: item.value,
    color: PIE_COLORS[index % PIE_COLORS.length],
  }));

  return (
    <div className="dashboard-page fade-in">
      <div className="kpi-grid">
        <KpiCard
          label="Đơn Hàng Hôm Nay"
          value={kpis.todayOrders}
          borderColor="#1E40AF"
        />
        <KpiCard
          label="Doanh Thu Hôm Nay"
          value={vnd(kpis.todayRevenue)}
          borderColor="#166534"
        />
        <KpiCard
          label="Sản Phẩm Sắp Hết"
          value={kpis.lowStockProducts}
          borderColor="#991B1B"
        />
        <KpiCard
          label="Tổng Sản Phẩm"
          value={kpis.totalProducts}
          borderColor="#6B21A8"
        />
        <KpiCard
          label="Tổng Doanh Thu"
          value={vnd(kpis.totalRevenue)}
          borderColor="#92400E"
        />
        <KpiCard
          label="Chờ Xác Nhận"
          value={kpis.pendingOrders}
          borderColor="#166534"
        />
      </div>

      <div className="charts-row">
        <div className="card chart-card">
          <h3 className="card-title">Biểu đồ doanh thu 7 ngày</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart
              data={revenueChart}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F5F5F5"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#888" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#888" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  v >= 1e6
                    ? (v / 1e6).toFixed(1) + "M"
                    : v >= 1e3
                      ? (v / 1e3).toFixed(0) + "K"
                      : v
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#9B1C1C"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#9B1C1C", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
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
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {pieData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v} SP`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {pieData.map((d, i) => (
                  <div key={i} className="pie-legend-item">
                    <div className="pie-dot" style={{ background: d.color }} />
                    <span className="pie-name">{d.name}</span>
                    <span className="pie-count" style={{ color: d.color }}>
                      {d.value} SP
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">Không có dữ liệu</div>
          )}
        </div>
      </div>

      <div className="card recent-orders-card">
        <h3 className="card-title">Đơn hàng gần đây</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                {[
                  "Mã đơn",
                  "Khách hàng",
                  "Tổng tiền",
                  "Trạng thái",
                  "Thời gian",
                ].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((o, i) => (
                  <tr
                    key={o._id}
                    className="row-hover"
                    style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}
                  >
                    <td className="order-id">
                      #{o._id?.slice(-6).toUpperCase()}
                    </td>
                    <td>{o.customer?.fullname || "—"}</td>
                    <td className="order-total">{vnd(o.totalAmount)}</td>
                    <td>
                      <StatusBadge status={o.orderStatus} />
                    </td>
                    <td className="order-date">{fmtDate(o.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="empty-row">
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
