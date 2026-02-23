const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
require("dotenv").config();

// Import models
const User = require("./models/UserModel");
const Category = require("./models/CategoryModel");
const Product = require("./models/ProductModel");
const Blog = require("./models/BlogModel");
const Order = require("./models/OrderModel");

// Dữ liệu danh mục sản phẩm Tết
const tetCategories = [
  {
    name: "Bánh Kẹo Tết",
    description: "Các loại bánh kẹo truyền thống và hiện đại cho ngày Tết",
    image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800",
  },
  {
    name: "Mứt Tết Cao Cấp",
    description: "Mứt trái cây, mứt sấy khô đặc sản ngày Tết",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800",
  },
  {
    name: "Đồ Trang Trí Tết",
    description: "Hoa, cây cảnh, đồ trang trí tạo không khí xuân",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800",
  },
  {
    name: "Quà Tặng Sức Khỏe",
    description: "Quà tặng chăm sóc sức khỏe cho người thân dịp Tết",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800",
  },
  {
    name: "Trà & Thực Phẩm Chức Năng",
    description: "Trà cao cấp, thực phẩm chức năng nhập khẩu",
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800",
  },
  {
    name: "Hộp Quà Tết",
    description: "Hộp quà Tết sang trọng, đa dạng mức giá",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800",
  },
  {
    name: "Rượu & Nước Giải Khát",
    description: "Rượu truyền thống, nước ép trái cây cao cấp",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",
  },
];

// Tên sản phẩm theo danh mục với hình ảnh
const productNamesByCategory = {
  "Bánh Kẹo Tết": [
    {
      name: "Bánh Quy Bơ Danisa Cao Cấp",
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800",
    },
    {
      name: "Kẹo Dừa Bến Tre Truyền Thống",
      image:
        "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800",
    },
    {
      name: "Bánh Đậu Xanh Hải Châu",
      image:
        "https://images.unsplash.com/photo-1587241321921-91a834d82b01?w=800",
    },
    {
      name: "Kẹo Socola Ferrero Rocher",
      image:
        "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800",
    },
    {
      name: "Bánh Trung Thu Kinh Đô",
      image:
        "https://images.unsplash.com/photo-1601000938365-f182c6d5f30c?w=800",
    },
    {
      name: "Bánh In Yến Sào Khánh Hòa",
      image:
        "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800",
    },
    {
      name: "Kẹo Mè Xửng Huế",
      image:
        "https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=800",
    },
    {
      name: "Bánh Quy Hạnh Nhân Meiji",
      image:
        "https://images.unsplash.com/photo-1590080876343-c8d2a5f86a6c?w=800",
    },
  ],
  "Mứt Tết Cao Cấp": [
    {
      name: "Mứt Dừa Non Bến Tre",
      image:
        "https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=800",
    },
    {
      name: "Mứt Gừng Mật Ong Hữu Cơ",
      image:
        "https://images.unsplash.com/photo-1587049352846-4a222e784299?w=800",
    },
    {
      name: "Mứt Sen Hồ Tây Thượng Hạng",
      image:
        "https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=800",
    },
    {
      name: "Mứt Bí Đỏ Hảo Hạng",
      image:
        "https://images.unsplash.com/photo-1508747703725-719777637510?w=800",
    },
    {
      name: "Mứt Cà Rốt Sấy Giòn",
      image:
        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800",
    },
    {
      name: "Mứt Khoai Môn Tây Ninh",
      image: "https://images.unsplash.com/photo-1560180394-0ab90a8c9bb1?w=800",
    },
    {
      name: "Mứt Táo Đỏ Hàn Quốc",
      image:
        "https://images.unsplash.com/photo-1569870499705-504209102861?w=800",
    },
    {
      name: "Mứt Dừa Sáp Cao Cấp",
      image:
        "https://images.unsplash.com/photo-1589927986089-35812388d1f8?w=800",
    },
  ],
  "Đồ Trang Trí Tết": [
    {
      name: "Chậu Mai Vàng 5 Cành",
      image:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800",
    },
    {
      name: "Cây Đào Phai Rừng Cao Cấp",
      image:
        "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800",
    },
    {
      name: "Chậu Quất Cảnh Mini",
      image:
        "https://images.unsplash.com/photo-1609559852003-e496c0bc56fc?w=800",
    },
    {
      name: "Hoa Lan Hồ Điệp Cao Cấp",
      image: "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800",
    },
    {
      name: "Câu Đối Tết Thư Pháp",
      image:
        "https://images.unsplash.com/photo-1506755855567-92ff770e8d00?w=800",
    },
    {
      name: "Đèn Lồng Truyền Thống",
      image:
        "https://images.unsplash.com/photo-1534777410147-084a460870fc?w=800",
    },
    {
      name: "Bình Hoa Sen Sứ",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
    },
    {
      name: "Liễn Thư Pháp Xuân",
      image:
        "https://images.unsplash.com/photo-1473186505569-9c61870c11f9?w=800",
    },
  ],
  "Quà Tặng Sức Khỏe": [
    {
      name: "Yến Sào Khánh Hòa Cao Cấp",
      image:
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800",
    },
    {
      name: "Đông Trùng Hạ Thảo Tươi",
      image:
        "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800",
    },
    {
      name: "Hồng Sâm Hàn Quốc 6 Năm",
      image:
        "https://images.unsplash.com/photo-1582735689527-3101d1c6e5e7?w=800",
    },
    {
      name: "Nhân Sâm Tươi Ngọc Linh",
      image:
        "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800",
    },
    {
      name: "Mật Ong Rừng Organic",
      image:
        "https://images.unsplash.com/photo-1587049352846-4a222e784299?w=800",
    },
    {
      name: "Dầu Gấc Vitamin E",
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800",
    },
    {
      name: "Tinh Dầu Hoa Hồng Bulgaria",
      image:
        "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800",
    },
    {
      name: "Viên Uống Collagen Nhật",
      image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=800",
    },
  ],
  "Trà & Thực Phẩm Chức Năng": [
    {
      name: "Trà Shan Tuyết Cổ Thụ",
      image:
        "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800",
    },
    {
      name: "Trà Ô Long Đài Loan Cao Cấp",
      image:
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800",
    },
    {
      name: "Trà Hoa Cúc Vàng Hữu Cơ",
      image:
        "https://images.unsplash.com/photo-1563822249548-9a72b6d9c9b5?w=800",
    },
    {
      name: "Omega-3 Fish Oil Kirkland",
      image:
        "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800",
    },
    {
      name: "Vitamin C 1000mg Nature Made",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800",
    },
    {
      name: "Trà Atiso Đà Lạt Thượng Hạng",
      image:
        "https://images.unsplash.com/photo-1597318130878-451a1eff7a3d?w=800",
    },
    {
      name: "Nghệ Nano Curcumin Hữu Cơ",
      image:
        "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800",
    },
    {
      name: "Probiotic 30 Tỷ CFU",
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800",
    },
  ],
  "Hộp Quà Tết": [
    {
      name: "Hộp Quà Tết Phúc Lộc Thọ",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800",
    },
    {
      name: "Hộp Quà Tết An Khang",
      image:
        "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800",
    },
    {
      name: "Hộp Quà Tết Vạn Sự Như Ý",
      image:
        "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800",
    },
    {
      name: "Hộp Quà Tết Sức Khỏe Vàng",
      image:
        "https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?w=800",
    },
    {
      name: "Hộp Quà Tết Đại Cát Đại Lợi",
      image:
        "https://images.unsplash.com/photo-1608528583705-2a1ca042f0db?w=800",
    },
    {
      name: "Hộp Quà Tết Tài Lộc",
      image:
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800",
    },
    {
      name: "Hộp Quà Tết Cao Cấp Premium",
      image: "https://images.unsplash.com/photo-1545828675-4c0e5b33267b?w=800",
    },
    {
      name: "Hộp Quà Tết Truyền Thống",
      image: "https://images.unsplash.com/photo-1545828675-4c0a9d45e938?w=800",
    },
  ],
  "Rượu & Nước Giải Khát": [
    {
      name: "Rượu Vang Chile Concha",
      image:
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",
    },
    {
      name: "Rượu Chivas 12 Năm",
      image:
        "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800",
    },
    {
      name: "Nước Ép Lựu Iran 100%",
      image:
        "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800",
    },
    {
      name: "Rượu Sake Nhật Bản",
      image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800",
    },
    {
      name: "Rượu Nếp Cẩm Hữu Cơ",
      image:
        "https://images.unsplash.com/photo-1531747056595-07f6cbbe10ad?w=800",
    },
    {
      name: "Nước Ép Nho Đỏ Welch's",
      image:
        "https://images.unsplash.com/photo-1596658932587-3168c681b0f6?w=800",
    },
    {
      name: "Nước Ép Táo Martinelli",
      image:
        "https://images.unsplash.com/photo-1600271772470-bd22a42787b3?w=800",
    },
    {
      name: "Rượu Mơ Yên Tử Truyền Thống",
      image:
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800",
    },
  ],
};

// Kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Kết nối MongoDB thành công!");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error.message);
    process.exit(1);
  }
};

// Xóa dữ liệu cũ
const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Blog.deleteMany({});
    await Order.deleteMany({});

    // Xóa các indexes cũ không còn sử dụng
    try {
      await Order.collection.dropIndex("orderNumber_1");
      console.log("🗑️  Đã xóa index orderNumber_1 cũ");
    } catch (err) {
      // Index không tồn tại, bỏ qua
    }

    console.log("🗑️  Đã xóa toàn bộ dữ liệu cũ");
  } catch (error) {
    console.error("❌ Lỗi khi xóa dữ liệu:", error.message);
    throw error;
  }
};

// Tạo Users
const createUsers = async (count = 20) => {
  const users = [];
  const bcrypt = require("bcryptjs");

  // Tạo Admin
  users.push({
    email: "admin@tetgift.com",
    phone: 84901234567,
    fullname: "Nguyễn Văn Admin",
    gender: "male",
    address: "123 Nguyễn Huệ, Q1, TP.HCM",
    dateOfBirth: new Date("1990-01-01"),
    password: await bcrypt.hash("admin123", 10),
    role: "Admin",
    isVerified: true,
    avatar: faker.image.avatar(),
  });

  // Tạo Staff Manager
  users.push({
    email: "staff@tetgift.com",
    phone: 84901234568,
    fullname: "Trần Thị Nhân Viên",
    gender: "female",
    address: "456 Lê Lợi, Q1, TP.HCM",
    dateOfBirth: new Date("1995-05-15"),
    password: await bcrypt.hash("staff123", 10),
    role: "StaffManager",
    isVerified: true,
    avatar: faker.image.avatar(),
  });

  // Tạo Users thông thường
  for (let i = 0; i < count - 2; i++) {
    const gender = faker.helpers.arrayElement(["male", "female", "other"]);
    users.push({
      email: faker.internet.email().toLowerCase(),
      phone: 84900000000 + Math.floor(Math.random() * 100000000),
      fullname: faker.person.fullName(),
      gender: gender,
      address: `${faker.location.streetAddress()}, ${faker.location.city()}, Việt Nam`,
      dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: "age" }),
      password: await bcrypt.hash("user123", 10),
      role: "User",
      isVerified: faker.datatype.boolean(),
      avatar: faker.image.avatar(),
    });
  }

  const createdUsers = await User.insertMany(users);
  console.log(`👥 Đã tạo ${createdUsers.length} users`);
  return createdUsers;
};

// Tạo Categories
const createCategories = async () => {
  const categories = await Category.insertMany(tetCategories);
  console.log(`📁 Đã tạo ${categories.length} categories`);
  return categories;
};

// Tạo Products
const createProducts = async (categories, users) => {
  const products = [];

  for (const category of categories) {
    const productItems = productNamesByCategory[category.name] || [];

    for (const productItem of productItems) {
      const basePrice = faker.number.int({ min: 100000, max: 5000000 });
      const hasDiscount = faker.datatype.boolean(0.3); // 30% sản phẩm có giảm giá

      const product = {
        name: productItem.name,
        price: basePrice,
        description: `${productItem.name} - Sản phẩm chất lượng cao, phù hợp làm quà Tết ý nghĩa cho người thân và đối tác.`,
        category: category._id,
        content: `<h2>Giới thiệu ${productItem.name}</h2>
          <p>Sản phẩm ${productItem.name} là lựa chọn hoàn hảo cho dịp Tết Nguyên Đán. Được chế biến từ nguyên liệu tự nhiên, đảm bảo an toàn cho sức khỏe.</p>
          <h3>Đặc điểm nổi bật:</h3>
          <ul>
            <li>Nguồn gốc xuất xứ rõ ràng</li>
            <li>Chất lượng cao cấp</li>
            <li>Bảo quản theo tiêu chuẩn</li>
            <li>Phù hợp làm quà biếu</li>
          </ul>`,
        isFeatured: faker.datatype.boolean(0.2), // 20% sản phẩm nổi bật
        tags: [
          category.name,
          "Tết 2026",
          "Quà Tết",
          faker.helpers.arrayElement([
            "Cao cấp",
            "Truyền thống",
            "Hiện đại",
            "Hữu cơ",
          ]),
        ],
        discountPrice: hasDiscount ? Math.floor(basePrice * 0.85) : null,
        quantity: faker.number.int({ min: 10, max: 500 }),
        imageUrl: productItem.image,
        comments: [],
      };

      // Thêm comments ngẫu nhiên
      const commentCount = faker.number.int({ min: 0, max: 5 });
      for (let i = 0; i < commentCount; i++) {
        const randomUser = faker.helpers.arrayElement(
          users.filter((u) => u.role === "User"),
        );
        product.comments.push({
          rating: faker.number.int({ min: 3, max: 5 }),
          content: faker.helpers.arrayElement([
            "Sản phẩm rất tốt, chất lượng như mô tả!",
            "Đóng gói cẩn thận, giao hàng nhanh.",
            "Mình rất hài lòng với sản phẩm này.",
            "Chất lượng tốt, giá cả hợp lý.",
            "Sẽ ủng hộ shop lần sau!",
            "Sản phẩm đẹp, phù hợp làm quà Tết.",
          ]),
          author: randomUser._id,
        });
      }

      products.push(product);
    }
  }

  const createdProducts = await Product.insertMany(products);
  console.log(`📦 Đã tạo ${createdProducts.length} products`);
  return createdProducts;
};

// Tạo Blogs
const createBlogs = async (count = 15) => {
  const blogTitles = [
    "Top 10 Món Quà Tết Ý Nghĩa Cho Người Thân",
    "Cách Chọn Mứt Tết Ngon Và An Toàn Cho Sức Khỏe",
    "Xu Hướng Trang Trí Nhà Cửa Đón Tết 2026",
    "5 Loại Trà Cao Cấp Nên Biếu Tết Năm Nay",
    "Bí Quyết Chọn Hộp Quà Tết Sang Trọng",
    "Yến Sào - Món Quà Quý Cho Sức Khỏe Dịp Tết",
    "Cách Bảo Quản Bánh Kẹo Tết Tươi Lâu",
    "Gợi Ý Quà Tết Cho Sếp Và Đối Tác",
    "Những Loại Hoa Đẹp Nhất Trang Trí Tết",
    "Chăm Sóc Sức Khỏe Mùa Tết Như Thế Nào?",
    "Hồng Sâm Hàn Quốc - Quà Tết Cao Cấp",
    "Ý Nghĩa Các Loại Hoa Tết Truyền Thống",
    "Mẹo Chọn Rượu Tết An Toàn Và Chất Lượng",
    "Phong Tục Tết Việt Nam Qua Các Miền",
    "Thực Phẩm Chức Năng - Xu Hướng Quà Tết Mới",
  ];

  const blogs = [];
  for (let i = 0; i < Math.min(count, blogTitles.length); i++) {
    blogs.push({
      title: blogTitles[i],
      content: `<h2>${blogTitles[i]}</h2>
        ${faker.lorem.paragraphs(5, "<p></p>\n")}
        <h3>Kết luận</h3>
        <p>${faker.lorem.paragraph()}</p>`,
      author: faker.person.fullName(),
      tags: [
        "Tết 2026",
        faker.helpers.arrayElement([
          "Quà Tết",
          "Sức Khỏe",
          "Trang Trí",
          "Mẹo Hay",
        ]),
        faker.helpers.arrayElement(["Cao Cấp", "Truyền Thống", "Hiện Đại"]),
      ],
      image: `https://images.unsplash.com/photo-${faker.helpers.arrayElement([
        "1516321318423-f06f85e504b3",
        "1606787620819-8bdf0c44c293",
        "1609559852003-e496c0bc56fc",
        "1543362906-acfc16c67564",
        "1545569341-9eb8b30979d9",
        "1606783486653-b0441a27bc51",
      ])}?w=1200`,
    });
  }

  const createdBlogs = await Blog.insertMany(blogs);
  console.log(`📝 Đã tạo ${createdBlogs.length} blogs`);
  return createdBlogs;
};

// Tạo Orders
const createOrders = async (users, products, count = 30) => {
  const regularUsers = users.filter((u) => u.role === "User");
  const orders = [];

  for (let i = 0; i < count; i++) {
    const customer = faker.helpers.arrayElement(regularUsers);
    const itemCount = faker.number.int({ min: 1, max: 5 });
    const orderProducts = faker.helpers.arrayElements(products, itemCount);

    const cartItems = orderProducts.map((product) => {
      const quantity = faker.number.int({ min: 1, max: 3 });
      const price = product.discountPrice || product.price;

      return {
        product: product._id,
        name: product.name,
        price: price,
        quantity: quantity,
      };
    });

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    orders.push({
      customer: customer._id,
      cartItems: cartItems,
      shippingAddress: customer.address,
      phone: customer.phone.toString(),
      note:
        faker.helpers.maybe(() => faker.lorem.sentence(), {
          probability: 0.3,
        }) || "",
      totalAmount: totalAmount,
      paymentMethod: faker.helpers.arrayElement(["momo", "vnpay", "cod"]),
      paymentStatus: faker.helpers.arrayElement(["pending", "paid", "failed"]),
      orderStatus: faker.helpers.arrayElement([
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ]),
    });
  }

  const createdOrders = await Order.insertMany(orders);
  console.log(`🛒 Đã tạo ${createdOrders.length} orders`);
  return createdOrders;
};

// Hàm main để seed dữ liệu
const seedDatabase = async () => {
  try {
    console.log("🚀 Bắt đầu seed dữ liệu...\n");

    // Kết nối database
    await connectDB();

    // Xóa dữ liệu cũ
    await clearDatabase();

    console.log("\n📊 Đang tạo dữ liệu mới...\n");

    // Tạo dữ liệu theo thứ tự
    const users = await createUsers(20);
    const categories = await createCategories();
    const products = await createProducts(categories, users);
    const blogs = await createBlogs(15);
    const orders = await createOrders(users, products, 30);

    // Cập nhật wishlist cho một số users
    const regularUsers = users.filter((u) => u.role === "User");
    for (const user of regularUsers.slice(0, 10)) {
      const wishlistProducts = faker.helpers.arrayElements(
        products,
        faker.number.int({ min: 0, max: 5 }),
      );
      user.wishlist = wishlistProducts.map((p) => p._id);
      await user.save();
    }
    console.log("💝 Đã cập nhật wishlist cho users");

    // In thông tin tổng kết
    console.log("\n✅ SEED DỮ LIỆU THÀNH CÔNG!\n");
    console.log("📊 THỐNG KÊ:");
    console.log(
      `   - Users: ${users.length} (1 Admin, 1 Staff, ${users.length - 2} Users)`,
    );
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Blogs: ${blogs.length}`);
    console.log(`   - Orders: ${orders.length}`);
    console.log("\n🔑 THÔNG TIN ĐĂNG NHẬP:");
    console.log("   Admin: admin@tetgift.com / admin123");
    console.log("   Staff: staff@tetgift.com / staff123");
    console.log("   User: user123 (tất cả users khác)");
    console.log("\n");
  } catch (error) {
    console.error("❌ Lỗi khi seed dữ liệu:", error);
  } finally {
    // Ngắt kết nối và thoát
    await mongoose.connection.close();
    console.log("🔌 Đã ngắt kết nối MongoDB");
    process.exit(0);
  }
};

// Chạy seed
seedDatabase();
