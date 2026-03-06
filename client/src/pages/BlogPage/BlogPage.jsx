import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import "./BlogPage.css";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" }) : "";

const BlogPage = () => {
  const [blogs,   setBlogs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/api/blogs")
      .then(r => setBlogs(r.data?.data || []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = blogs.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.toLowerCase().includes(search.toLowerCase()) ||
    (b.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const [featured, ...rest] = filtered;

  return (
    <div className="blog-page fade-in">
      {/* Hero */}
      <div className="blog-hero">
        <div className="blog-hero-eyebrow">Tạp chí sức khoẻ</div>
        <h1 className="blog-hero-title">Blog Sức Khoẻ</h1>
        <p className="blog-hero-sub">Kiến thức y tế, lối sống lành mạnh và quà tặng sức khoẻ</p>
        <div className="blog-search-wrap">
          <span className="blog-search-icon"></span>
          <input
            className="blog-search-inp"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm bài viết, tác giả, tag..."
          />
        </div>
      </div>

      <div className="blog-container">
        {loading ? (
          <div className="blog-empty">
            <div className="blog-empty-icon"></div>
            Đang tải bài viết...
          </div>
        ) : filtered.length === 0 ? (
          <div className="blog-empty">
            <div className="blog-empty-icon"></div>
            Không tìm thấy bài viết nào
          </div>
        ) : (
          <>
            {featured && (
              <div className="blog-featured" onClick={() => navigate(`/blog/${featured._id}`)}>
                <div
                  className="blog-featured-img"
                  style={{
                    background: featured.image
                      ? `url(${featured.image}) center/cover`
                      : "linear-gradient(135deg,var(--red),var(--gold))",
                  }}
                />
                <div className="blog-featured-body">
                  <span className="blog-badge-featured">Nổi bật</span>
                  <h2 className="blog-featured-title">{featured.title}</h2>
                  <p className="blog-featured-excerpt">
                    {featured.content?.replace(/<[^>]*>/g, "").slice(0, 180)}...
                  </p>
                  <div className="blog-meta">
                    {featured.author && <span>{featured.author}</span>}
                    <span> {fmtDate(featured.createdAt)}</span>
                  </div>
                  {(featured.tags || []).length > 0 && (
                    <div className="blog-tags">
                      {featured.tags.map(t => <span key={t} className="blog-tag">#{t}</span>)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {rest.length > 0 && (
              <>
                <div className="blog-divider"><span>Bài viết khác</span></div>
                <div className="blog-grid">
                  {rest.map(b => (
                    <div key={b._id} className="blog-card" onClick={() => navigate(`/blog/${b._id}`)}>
                      <div
                        className="blog-card-img"
                        style={{
                          background: b.image
                            ? `url(${b.image}) center/cover`
                            : "linear-gradient(135deg,#9B1C1C15,#D4920A15)",
                        }}
                      >
                        {!b.image && <span className="blog-card-placeholder"></span>}
                      </div>
                      <div className="blog-card-body">
                        <h3 className="blog-card-title">{b.title}</h3>
                        <p className="blog-card-excerpt">
                          {b.content?.replace(/<[^>]*>/g, "").slice(0, 100)}...
                        </p>
                        <div className="blog-card-footer">
                          <span>{b.author || "TetHealthGift"}</span>
                          <span>{fmtDate(b.createdAt)}</span>
                        </div>
                        {(b.tags || []).length > 0 && (
                          <div className="blog-tags" style={{ marginTop: 10 }}>
                            {b.tags.slice(0, 3).map(t => <span key={t} className="blog-tag">#{t}</span>)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
