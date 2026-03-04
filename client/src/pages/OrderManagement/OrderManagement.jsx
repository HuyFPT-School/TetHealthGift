import { useState, useEffect, useCallback } from "react";
import api from "../../api";
import { Spinner, Toast, Modal, StatusBadge, ORDER_STATUS, vnd, fmtDate } from "../../components/CM/Components";
import "./OrderManagement.css";

const LIMIT = 10;

const OrderManagement = () => {
  const [orders,  setOrders]  = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [filter,  setFilter]  = useState("");
  const [search,  setSearch]  = useState("");
  const [page,    setPage]    = useState(1);
  const [detail,  setDetail]  = useState(null);
  const [toast,   setToast]   = useState(null);

  const showT = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (filter) params.set("orderStatus", filter);
      const res = await api.get(`/api/orders?${params}`);
      let list = res.orders || res.data || res || [];
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(o =>
          o._id?.toLowerCase().includes(q) ||
          (o.customer?.fullname || o.customerId?.fullname || "").toLowerCase().includes(q)
        );
      }
      setOrders(list);
      setTotal(res.total || res.totalOrders || list.length);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, filter, search]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, orderStatus) => {
    setSaving(true);
    try {
      await api.patch(`/api/orders/${id}/status`, { orderStatus });
      showT(`Da chuyen: ${ORDER_STATUS[orderStatus]?.label || orderStatus}`);
      load();
      if (detail?._id === id) setDetail(o => ({ ...o, orderStatus }));
    } catch (e) {
      showT(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const cancelOrder = async (id) => {
    if (!confirm("Xac nhan huy don hang nay?")) return;
    setSaving(true);
    try {
      await api.patch(`/api/orders/${id}/cancel`);
      showT("Da huy don hang");
      load();
      if (detail?._id === id) setDetail(o => ({ ...o, orderStatus: "cancelled" }));
    } catch (e) {
      showT(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const exportCSV = () => {
    const rows = [
      ["ID","Khach hang","SDT","Dia chi","Tong tien","Trang thai","Thanh toan","Ngay tao"],
      ...orders.map(o => [
        o._id,
        o.customer?.fullname || o.customerId?.fullname || "",
        o.phone || o.customer?.phone || "",
        o.shippingAddress || "",
        o.totalPrice || 0,
        ORDER_STATUS[o.orderStatus]?.label || o.orderStatus,
        o.paymentMethod || "",
        fmtDate(o.createdAt),
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv" }));
    a.download = "don-hang.csv";
    a.click();
    showT("Da xuat file Excel");
  };

  const pageCount    = Math.max(1, Math.ceil(total / LIMIT));
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="orders-page fade-in">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div className="orders-header">
        <h2 className="orders-title">Danh sach don hang</h2>
        <button onClick={exportCSV} className="btn-outline">Xuat Excel</button>
      </div>

      {/* Status Pills */}
      <div className="status-pills">
        <button
          className="pill"
          style={filter === "" ? { background: "#9B1C1C", color: "#fff", borderColor: "#9B1C1C" } : {}}
          onClick={() => { setFilter(""); setPage(1); }}
        >
          Tat ca ({total})
        </button>
        {Object.entries(ORDER_STATUS).map(([k, v]) => (
          <button key={k} className="pill"
            style={filter === k ? { background: v.bg, color: v.color, borderColor: v.color } : {}}
            onClick={() => { setFilter(k); setPage(1); }}
          >
            {v.label} ({statusCounts[k] || 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="search-wrap" style={{ maxWidth: 380, marginBottom: 16 }}>
        <span className="search-icon">🔍</span>
        <input className="inp" style={{ paddingLeft: 34 }} value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Tim ma don, ten khach hang..." />
      </div>

      {/* Table */}
      <div className="card table-card">
        {loading ? (
          <div className="table-loading"><Spinner size={32} /></div>
        ) : error ? (
          <div className="table-error">{error}</div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="tbl" style={{ minWidth: 750 }}>
                <thead>
                  <tr>
                    {["MA DON","KHACH HANG","SO SP","TONG TIEN","TRANG THAI","THOI GIAN","THAO TAC"].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => {
                    const st    = ORDER_STATUS[o.orderStatus];
                    const items = o.cartItems || o.items || [];
                    return (
                      <tr key={o._id} className="row-hover"
                        style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                        <td>
                          <button className="order-id-btn" onClick={() => setDetail(o)}>
                            #{o._id?.slice(-6).toUpperCase()}
                          </button>
                        </td>
                        <td>
                          <div className="customer-name">
                            {o.customer?.fullname || o.customerId?.fullname || "—"}
                          </div>
                          <div className="customer-phone">
                            {o.phone || o.customer?.phone || ""}
                          </div>
                        </td>
                        <td className="items-count">{items.length} SP</td>
                        <td className="order-total">{vnd(o.totalPrice)}</td>
                        <td><StatusBadge status={o.orderStatus} /></td>
                        <td className="order-date">{fmtDate(o.createdAt)}</td>
                        <td>
                          <div className="action-btns">
                            <button className="link-btn" onClick={() => setDetail(o)}>Chi tiet</button>
                            {st?.next && (
                              <button className="btn-next" disabled={saving}
                                onClick={() => updateStatus(o._id, st.next)}>
                                {ORDER_STATUS[st.next]?.label}
                              </button>
                            )}
                            {!["delivered","cancelled"].includes(o.orderStatus) && (
                              <button className="btn-cancel" disabled={saving}
                                onClick={() => cancelOrder(o._id)}>Huy</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {orders.length === 0 && (
                    <tr><td colSpan={7} className="empty-row">
                      <div className="empty-icon">📭</div>
                      Khong co don hang nao
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>Trang {page}/{pageCount} - {total} don hang</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn-outline" style={{ padding: "6px 14px" }}
                  onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}>Truoc</button>
                <button className="btn-outline" style={{ padding: "6px 14px" }}
                  onClick={() => setPage(p => Math.min(pageCount,p+1))} disabled={page===pageCount}>Sau</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {detail && (
        <Modal title={`Don hang #${detail._id?.slice(-6).toUpperCase()}`}
          onClose={() => setDetail(null)} wide>
          <div className="detail-grid">
            {[
              ["Khach hang",   detail.customer?.fullname || detail.customerId?.fullname || "—"],
              ["SDT",          detail.phone || detail.customer?.phone || "—"],
              ["Dia chi",      detail.shippingAddress || "—"],
              ["Thanh toan",   detail.paymentMethod || "—"],
              ["TT thanh toan",detail.paymentStatus || "—"],
              ["Ngay dat",     fmtDate(detail.createdAt)],
            ].map(([k,v]) => (
              <div key={k} className="detail-item">
                <div className="detail-key">{k}</div>
                <div className="detail-val">{v}</div>
              </div>
            ))}
          </div>

          {(detail.cartItems || detail.items || []).length > 0 && (
            <div className="items-section">
              <div className="items-title">San pham trong don</div>
              {(detail.cartItems || detail.items).map((item, i) => (
                <div key={i} className={`item-row${i%2===0?" alt":""}`}>
                  <span className="item-name">
                    {item.name || item.product?.name || `SP ${i+1}`}
                    {item.quantity && <span className="item-qty"> x {item.quantity}</span>}
                  </span>
                  <span className="item-price">{vnd((item.price||0)*(item.quantity||1))}</span>
                </div>
              ))}
            </div>
          )}

          <div className="order-total-box">
            <div className="total-label">Tong gia tri</div>
            <div className="total-value">{vnd(detail.totalPrice || detail.totalAmount)}</div>
          </div>

          {/* Timeline */}
          <div className="timeline">
            {["processing","shipped","delivered"].map((s, i, arr) => {
              const steps  = ["processing","shipped","delivered"];
              const curIdx = steps.indexOf(detail.orderStatus);
              const done   = detail.orderStatus !== "cancelled" && i <= curIdx;
              const c      = ORDER_STATUS[s];
              return (
                <div key={s} className="timeline-step">
                  <div className="timeline-dot-wrap">
                    <div className={`timeline-dot${done?" done":""}`}>{done?"✓":i+1}</div>
                    <div className={`timeline-label${done?" done":""}`}>{c.label}</div>
                  </div>
                  {i < arr.length-1 && <div className={`timeline-line${done&&i<curIdx?" done":""}`}/>}
                </div>
              );
            })}
          </div>

          <div className="modal-footer">
            {ORDER_STATUS[detail.orderStatus]?.next && (
              <button className="btn-primary" disabled={saving}
                onClick={() => updateStatus(detail._id, ORDER_STATUS[detail.orderStatus].next)}>
                {saving ? <Spinner size={14}/> : `-> ${ORDER_STATUS[ORDER_STATUS[detail.orderStatus].next]?.label}`}
              </button>
            )}
            {!["delivered","cancelled"].includes(detail.orderStatus) && (
              <button className="btn-icon-red" style={{ padding:"9px 18px" }}
                onClick={() => cancelOrder(detail._id)} disabled={saving}>Huy don</button>
            )}
            <button className="btn-outline" onClick={() => setDetail(null)}>Dong</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrderManagement;
