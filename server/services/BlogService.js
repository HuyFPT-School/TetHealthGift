const Blog = require("../models/BlogModel");

/**
 * Blog Service
 * Xử lý business logic liên quan đến blog
 */
class BlogService {
  /**
   * Lấy tất cả blogs
   */
  async getAllBlogs(filters = {}) {
    try {
      const blogs = await Blog.find(filters).sort({ createdAt: -1 });
      return blogs;
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách blog: ${error.message}`);
    }
  }

  /**
   * Lấy blog theo ID
   */
  async getBlogById(blogId) {
    try {
      const blog = await Blog.findById(blogId);
      if (!blog) {
        throw new Error("Không tìm thấy blog");
      }
      return blog;
    } catch (error) {
      throw new Error(`Lỗi khi lấy blog: ${error.message}`);
    }
  }

  /**
   * Tìm kiếm blogs
   */
  async searchBlogs(keyword) {
    try {
      const blogs = await Blog.find({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { content: { $regex: keyword, $options: "i" } },
          { author: { $regex: keyword, $options: "i" } },
          { tags: { $regex: keyword, $options: "i" } },
        ],
      }).sort({ createdAt: -1 });

      return blogs;
    } catch (error) {
      throw new Error(`Lỗi khi tìm kiếm blog: ${error.message}`);
    }
  }

  /**
   * Lấy blogs theo tag
   */
  async getBlogsByTag(tag) {
    try {
      const blogs = await Blog.find({ tags: tag }).sort({ createdAt: -1 });
      return blogs;
    } catch (error) {
      throw new Error(`Lỗi khi lấy blog theo tag: ${error.message}`);
    }
  }

  /**
   * Lấy blogs theo author
   */
  async getBlogsByAuthor(author) {
    try {
      const blogs = await Blog.find({ author }).sort({ createdAt: -1 });
      return blogs;
    } catch (error) {
      throw new Error(`Lỗi khi lấy blog theo tác giả: ${error.message}`);
    }
  }

  /**
   * Tạo blog mới
   */
  async createBlog(blogData) {
    try {
      const { title, content, author, tags, image } = blogData;

      // Validate
      if (!title || !content) {
        throw new Error("Tiêu đề và nội dung không được để trống");
      }

      const blog = new Blog({
        title,
        content,
        author,
        tags: tags || [],
        image,
      });

      await blog.save();
      return blog;
    } catch (error) {
      throw new Error(`Lỗi khi tạo blog: ${error.message}`);
    }
  }

  /**
   * Cập nhật blog
   */
  async updateBlog(blogId, updateData) {
    try {
      const blog = await Blog.findById(blogId);
      if (!blog) {
        throw new Error("Không tìm thấy blog");
      }

      // Validate nếu update title hoặc content
      if (updateData.title === "") {
        throw new Error("Tiêu đề không được để trống");
      }
      if (updateData.content === "") {
        throw new Error("Nội dung không được để trống");
      }

      Object.assign(blog, updateData);
      await blog.save();

      return blog;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật blog: ${error.message}`);
    }
  }

  /**
   * Xóa blog
   */
  async deleteBlog(blogId) {
    try {
      const blog = await Blog.findById(blogId);
      if (!blog) {
        throw new Error("Không tìm thấy blog");
      }

      await Blog.findByIdAndDelete(blogId);
      return { message: "Xóa blog thành công" };
    } catch (error) {
      throw new Error(`Lỗi khi xóa blog: ${error.message}`);
    }
  }

  /**
   * Lấy blogs mới nhất
   */
  async getLatestBlogs(limit = 5) {
    try {
      const blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(limit);
      return blogs;
    } catch (error) {
      throw new Error(`Lỗi khi lấy blog mới nhất: ${error.message}`);
    }
  }

  /**
   * Lấy tất cả tags
   */
  async getAllTags() {
    try {
      const blogs = await Blog.find({}, "tags");
      const tagsSet = new Set();

      blogs.forEach((blog) => {
        blog.tags.forEach((tag) => tagsSet.add(tag));
      });

      return Array.from(tagsSet);
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách tags: ${error.message}`);
    }
  }
}

module.exports = new BlogService();
