const Category = require("../models/CategoryModel");
const Product = require("../models/ProductModel");

/**
 * Category Service
 * Xử lý business logic liên quan đến danh mục
 */
class CategoryService {
  /**
   * Lấy tất cả categories
   */
  async getAllCategories() {
    try {
      const categories = await Category.find({}).sort({ name: 1 });
      return categories;
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách danh mục: ${error.message}`);
    }
  }

  /**
   * Lấy category theo ID
   */
  async getCategoryById(categoryId) {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error("Không tìm thấy danh mục");
      }
      return category;
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh mục: ${error.message}`);
    }
  }

  /**
   * Tạo category mới
   */
  async createCategory(categoryData) {
    try {
      const { name, description, image } = categoryData;

      // Validate
      if (!name) {
        throw new Error("Tên danh mục không được để trống");
      }

      // Check if name exists
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        throw new Error("Tên danh mục đã tồn tại");
      }

      const category = new Category({
        name,
        description,
        image,
      });

      await category.save();
      return category;
    } catch (error) {
      throw new Error(`Lỗi khi tạo danh mục: ${error.message}`);
    }
  }

  /**
   * Cập nhật category
   */
  async updateCategory(categoryId, updateData) {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error("Không tìm thấy danh mục");
      }

      // Check name uniqueness if updating
      if (updateData.name && updateData.name !== category.name) {
        const existingCategory = await Category.findOne({
          name: updateData.name,
        });
        if (existingCategory) {
          throw new Error("Tên danh mục đã tồn tại");
        }
      }

      Object.assign(category, updateData);
      await category.save();

      return category;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật danh mục: ${error.message}`);
    }
  }

  /**
   * Xóa category
   */
  async deleteCategory(categoryId) {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error("Không tìm thấy danh mục");
      }

      // Kiểm tra xem có sản phẩm nào thuộc danh mục này không
      const productsCount = await Product.countDocuments({
        category: categoryId,
      });
      if (productsCount > 0) {
        throw new Error(
          `Không thể xóa danh mục này vì còn ${productsCount} sản phẩm`,
        );
      }

      await Category.findByIdAndDelete(categoryId);
      return { message: "Xóa danh mục thành công" };
    } catch (error) {
      throw new Error(`Lỗi khi xóa danh mục: ${error.message}`);
    }
  }

  /**
   * Lấy categories với số lượng sản phẩm
   */
  async getCategoriesWithProductCount() {
    try {
      const categories = await Category.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "category",
            as: "products",
          },
        },
        {
          $project: {
            name: 1,
            description: 1,
            image: 1,
            productCount: { $size: "$products" },
            createdAt: 1,
            updatedAt: 1,
          },
        },
        { $sort: { name: 1 } },
      ]);

      return categories;
    } catch (error) {
      throw new Error(
        `Lỗi khi lấy danh mục với số lượng sản phẩm: ${error.message}`,
      );
    }
  }

  /**
   * Tìm kiếm categories
   */
  async searchCategories(keyword) {
    try {
      const categories = await Category.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      }).sort({ name: 1 });

      return categories;
    } catch (error) {
      throw new Error(`Lỗi khi tìm kiếm danh mục: ${error.message}`);
    }
  }
}

module.exports = new CategoryService();
