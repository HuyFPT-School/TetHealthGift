import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import "./BlogDetail.css";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" }) : "";

const BlogDetail = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [blog,    setBlog]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    axiosInstance.get(`/api/blogs/${id}`)
      .then(r => setBlog(r.data?.data))
      .catch(() => setError("Không tìm thấy bài viết"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="bd-state">
      <div className="bd-state-icon">⏳</div>
      Đang tải bài viết...
    </div>
  );

  if (error || !blog) return (
    <div className="bd-state">
      <div className="bd-state-icon">📭</div>
      <p>{error || "Không tìm thấy bài viết"}</p>
      <button className="btn-primary" onClick={() => navigate("/blog")}>← Về trang Blog</button>
    </div>
  );

  return (
    <div className="bd-page fade-in">
      {/* Hero */}
      <div
        className="bd-hero"
        style={{
          background: blog.image
            ? `linear-gradient(to bottom,rgba(0,0,0,.45),rgba(0,0,0,.72)), url(${blog.image}) center/cover`
            : "linear-gradient(135deg,var(--red),var(--red-dark))",
        }}
      >
        {(blog.tags || []).length > 0 && (
          <div className="bd-hero-tags">
            {blog.tags.map(t => <span key={t} className="bd-hero-tag">#{t}</span>)}
          </div>
        )}
        <h1 className="bd-hero-title">{blog.title}</h1>
        <div className="bd-hero-meta">
          {blog.author && <span>✍️ {blog.author}</span>}
          <span>📅 {fmtDate(blog.createdAt)}</span>
        </div>
      </div>

      {/* Body */}
      <div className="bd-body">
        <button className="bd-back-btn" onClick={() => navigate("/blog")}>
          ← Về trang Blog
        </button>

        <article className="bd-article">
          {blog.content?.includes("<") ? (
            <div
              className="bd-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          ) : (
            <div className="bd-content">
              {blog.content?.split("\n").map((para, i) =>
                para.trim()
                  ? <p key={i}>{para}</p>
                  : <br key={i} />
              )}
            </div>
          )}
        </article>

        {/* Tags footer */}
        {(blog.tags || []).length > 0 && (
          <div className="bd-tags-footer">
            <span className="bd-tags-label">Tags:</span>
            {blog.tags.map(t => (
              <span
                key={t}
                className="bd-tag"
                onClick={() => navigate(`/blog?tag=${t}`)}
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
