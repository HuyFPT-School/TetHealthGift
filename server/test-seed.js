const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const User = require("./models/UserModel");
const Category = require("./models/CategoryModel");
const Product = require("./models/ProductModel");
const Blog = require("./models/BlogModel");
const Order = require("./models/OrderModel");

// Kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Kết nối MongoDB thành công!\n");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error.message);
    process.exit(1);
  }
};

// Test cases
const runTests = async () => {
  console.log("🧪 BẮT ĐẦU KIỂM TRA DỮ LIỆU SEED\n");
  console.log("=".repeat(60));

  let passed = 0;
  let failed = 0;

  // Test 1: Kiểm tra số lượng Users
  try {
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: "Admin" });
    const staffCount = await User.countDocuments({ role: "StaffManager" });
    const regularUserCount = await User.countDocuments({ role: "User" });

    console.log("\n✅ TEST 1: Kiểm tra Users");
    console.log(`   - Tổng số users: ${userCount}`);
    console.log(`   - Admin: ${adminCount}`);
    console.log(`   - Staff: ${staffCount}`);
    console.log(`   - Regular Users: ${regularUserCount}`);

    if (userCount === 20 && adminCount === 1 && staffCount === 1) {
      console.log("   ✓ PASS: Số lượng users đúng như mong đợi");
      passed++;
    } else {
      console.log("   ✗ FAIL: Số lượng users không đúng");
      failed++;
    }
  } catch (error) {
    console.log("   ✗ FAIL:", error.message);
    failed++;
  }

  // Test 2: Kiểm tra Admin account
  try {
    const admin = await User.findOne({ email: "admin@tetgift.com" });
    console.log("\n✅ TEST 2: Kiểm tra Admin account");
    console.log(`   - Email: ${admin.email}`);
    console.log(`   - Fullname: ${admin.fullname}`);
    console.log(`   - Role: ${admin.role}`);
    console.log(`   - Verified: ${admin.isVerified}`);

    if (admin && admin.role === "Admin" && admin.isVerified) {
      console.log("   ✓ PASS: Admin account tồn tại và đúng cấu hình");
      passed++;
    } else {
      console.log("   ✗ FAIL: Admin account không đúng");
      failed++;
    }
  } catch (error) {
    console.log("   ✗ FAIL:", error.message);
    failed++;
  }

  // Test 3: Kiểm tra Categories
  try {
    const categoryCount = await Category.countDocuments();
    const categories = await Category.find().select("name");

    console.log("\n✅ TEST 3: Kiểm tra Categories");
    console.log(`   - Tổng số categories: ${categoryCount}`);
    console.log("   - Danh sách categories:");
    categories.forEach((cat) => console.log(`     • ${cat.name}`));

    if (categoryCount === 7) {
      console.log("   ✓ PASS: Số lượng categories đúng");
      passed++;
    } else {
      console.log("   ✗ FAIL: Số lượng categories không đúng");
      failed++;
    }
  } catch (error) {
    console.log("   ✗ FAIL:", error.message);
    failed++;
  }

  // Test 4: Kiểm tra Products
  try {
    const productCount = await Product.countDocuments();
    const productsWithImages = await Product.countDocuments({
      imageUrl: { $exists: true, $ne: null, $ne: "" },
    });
    const productsWithCategory = await Product.countDocuments({
      category: { $ne: null },
    });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    const discountedProducts = await Product.countDocuments({
      discountPrice: { $ne: null },
    });

    // Kiểm tra sample product để xác nhận imageUrl là String
    const sampleProduct = await Product.findOne();
    const imageUrlType = typeof sampleProduct.imageUrl;

    console.log("\n✅ TEST 4: Kiểm tra Products");
    console.log(`   - Tổng số products: ${productCount}`);
    console.log(`   - Products có hình ảnh: ${productsWithImages}`);
    console.log(`   - Products có category: ${productsWithCategory}`);
    console.log(`   - Products nổi bật: ${featuredProducts}`);
    console.log(`   - Products có giảm giá: ${discountedProducts}`);
    console.log(`   - ImageUrl type: ${imageUrlType}`);

    if (
      productCount === 56 &&
      productsWithImages === productCount &&
      productsWithCategory === productCount &&
      imageUrlType === "string"
    ) {
      console.log("   ✓ PASS: Dữ liệu products hợp lệ (imageUrl là String)");
      passed++;
    } else {
      console.log("   ✗ FAIL: Dữ liệu products không đầy đủ");
      failed++;
    }
  } catch (error) {
    console.log("   ✗ FAIL:", error.message);
    failed++;
  }

  // Test 5: Kiểm tra Products theo Category
  try {
    const categories = await Category.find();
    console.log("\n✅ TEST 5: Kiểm tra Products theo từng Category");

    let allCategoriesHaveProducts = true;
    for (const category of categories) {
      const productCount = await Product.countDocuments({
        category: category._id,
      });
      console.log(`   - ${category.name}: ${productCount} products`);
      if (productCount === 0) {
        allCategoriesHaveProducts = false;
      }
    }

    if (allCategoriesHaveProducts) {
      console.log("   ✓ PASS: Tất cả categories đều có products");
      passed++;
    } else {
      console.log("   ✗ FAIL: Có categories không có products");
      failed++;
    }
  } catch (error) {
    console.log("   ✗ FAIL:", error.message);
    failed++;
  }

  // Test 6: Kiểm tra Product Comments
  try {
    const productsWithComments = await Product.countDocuments({
      "comments.0": { $exists: true },
    });
    const sampleProduct = await Product.findOne({
      "comments.0": { $exists: true },
    }).populate("comments.author", "fullname email");

    console.log("\n✅ TEST 6: Kiểm tra Product Comments");
    console.log(`   - Products có comments: ${productsWithComments}`);
    if (sampleProduct) {
      console.log(`   - Ví dụ product: ${sampleProduct.name}`);
      console.log(`   - Số comments: ${sampleProduct.comments.length}`);
      if (sampleProduct.comments[0].author) {
        console.log(
          `   - Author của comment đầu: ${sampleProduct.comments[0].author.fullname}`,
        );
      }
    }

    if (productsWithComments > 0) {
      console.log("   ✓ PASS: Có products với comments");
      passed++;
    } else {
      console.log("   ✗ FAIL: Không có products nào có comments");
      failed++;
    }
  } catch (error) {
    console.log("   ✗ FAIL:", error.message);
    failed++;
  }

  // Test 7: Kiểm tra Blogs
  try {
    const blogCount = await Blog.countDocuments();
    const blogsWithTags = await Blog.countDocuments({
      "tags.0": { $exists: true },
    });
    const blogsWithImages = await Blog.countDocuments({ image: { $ne: null } });

    console.log("\n✅ TEST 7: Kiểm tra Blogs");
    console.log(`   - Tổng số blogs: ${blogCount}`);
    console.log(`   - Blogs có tags: ${blogsWithTags}`);
    console.log(`   - Blogs có hình ảnh: ${blogsWithImages}`);

    if (blogCount === 15 && blogsWithTags === blogCount) {
      console.log("   ✓ PASS: Dữ liệu blogs hợp lệ");
      passed++;
    } else {
      console.log("   ✗ FAIL: Dữ liệu blogs không đầy đủ");
      failed++;
    }
  } catch (error) {
    console.log("   ✗ FAIL:", error.message);
    failed++;
  }

  // Test 8: Kiểm tra Orders
  try {
    const orderCount = await Order.countDocuments();
    const ordersWithItems = await Order.countDocuments({
      "cartItems.0": { $exists: true },
    });
    const paidOrders = await Order.countDocuments({ paymentStatus: "paid" });
    const deliveredOrders = await Order.countDocuments({
      orderStatus: "delivered",
    });

    const sampleOrder = await Order.findOne()
      .populate("customer", "fullname email")
      .populate("cartItems.product", "name");

    console.log("\n✅ TEST 8: Kiểm tra Orders");
    console.log(`   - Tổng số orders: ${orderCount}`);
    console.log(`   - Orders có cart items: ${ordersWithItems}`);
    console.log(`   - Orders đã thanh toán: ${paidOrders}`);
    console.log(`   - Orders đã giao: ${deliveredOrders}`);

    if (sampleOrder) {
      console.log(`   - Ví dụ order:`);
      console.log(`     • Customer: ${sampleOrder.customer.fullname}`);
      console.log(`     • Số items: ${sampleOrder.cartItems.length}`);
      console.log(
        `     • Tổng tiền: ${sampleOrder.totalAmount.toLocaleString("vi-VN")} VNĐ`,
      );
      console.log(`     • Phương thức: ${sampleOrder.paymentMethod}`);
    }

    if (orderCount === 30 && ordersWithItems === orderCount) {
      console.log("   ✓ PASS: Dữ liệu orders hợp lệ");
      passed++;
    } else {
      console.log("   ✗ FAIL: Dữ liệu orders không đầy đủ");
      failed++;
    }
  } catch (error) {
    console.log("   ✗ FAIL:", error.message);
    failed++;
  }

  // Test 9: Kiểm tra Wishlist
  try {
    const usersWithWishlist = await User.countDocuments({
      "wishlist.0": { $exists: true },
    });
    const sampleUserWithWishlist = await User.findOne({
      "wishlist.0": { $exists: true },
    }).populate("wishlist", "name price");

    console.log("\n✅ TEST 9: Kiểm tra Wishlist");
    console.log(`   - Users có wishlist: ${usersWithWishlist}`);

    if (sampleUserWithWishlist) {
      console.log(`   - Ví dụ user: ${sampleUserWithWishlist.fullname}`);
      console.log(
        `   - Số items trong wishlist: ${sampleUserWithWishlist.wishlist.length}`,
      );
    }

    if (usersWithWishlist > 0) {
      console.log("   ✓ PASS: Có users với wishlist");
      passed++;
    } else {
      console.log("   ✗ FAIL: Không có users nào có wishlist");
      failed++;
    }
  } catch (error) {
    console.log("   ✗ FAIL:", error.message);
    failed++;
  }

  // Test 10: Kiểm tra tính toàn vẹn dữ liệu (Data Integrity)
  try {
    console.log("\n✅ TEST 10: Kiểm tra tính toàn vẹn dữ liệu");

    // Kiểm tra tất cả orders có customer tồn tại
    const ordersWithInvalidCustomer = await Order.countDocuments({
      customer: { $nin: await User.find().distinct("_id") },
    });

    // Kiểm tra tất cả products có category tồn tại
    const productsWithInvalidCategory = await Product.countDocuments({
      category: { $nin: await Category.find().distinct("_id") },
    });

    console.log(
      `   - Orders với customer không hợp lệ: ${ordersWithInvalidCustomer}`,
    );
    console.log(
      `   - Products với category không hợp lệ: ${productsWithInvalidCategory}`,
    );

    if (ordersWithInvalidCustomer === 0 && productsWithInvalidCategory === 0) {
      console.log(
        "   ✓ PASS: Dữ liệu toàn vẹn, không có references không hợp lệ",
      );
      passed++;
    } else {
      console.log("   ✗ FAIL: Có dữ liệu không toàn vẹn");
      failed++;
    }
  } catch (error) {
    console.log("   ✗ FAIL:", error.message);
    failed++;
  }

  // Kết quả tổng hợp
  console.log("\n" + "=".repeat(60));
  console.log("\n📊 KẾT QUẢ KIỂM TRA:\n");
  console.log(`   ✅ Passed: ${passed}/10 tests`);
  console.log(`   ❌ Failed: ${failed}/10 tests`);
  console.log(`   📈 Success Rate: ${((passed / 10) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log("\n🎉 TẤT CẢ TEST CASES ĐỀU PASS! DỮ LIỆU SEED HOÀN HẢO!\n");
  } else {
    console.log(
      "\n⚠️  Có một số test cases thất bại. Vui lòng kiểm tra lại.\n",
    );
  }
};

// Main function
const main = async () => {
  try {
    await connectDB();
    await runTests();
  } catch (error) {
    console.error("❌ Lỗi khi chạy tests:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Đã ngắt kết nối MongoDB");
    process.exit(0);
  }
};

// Chạy tests
main();
