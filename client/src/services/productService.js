// ============================================================
// FILE: src/services/productService.js
// Dữ liệu sản phẩm + các hàm filter/search
// ============================================================

export const PRODUCTS = [
  {
    id: 1,
    name: "Hộp Quà Tết Bạch Trà Thượng Hạng",
    slug: "hop-qua-tet-bach-tra-thuong-hang",
    price: 850000,
    originalPrice: 1050000,
    category: "tra",
    herbs: ["bach-tra", "hoa-cuc"],
    benefits: ["thu-gian", "dep-da"],
    rating: 4.8,
    reviewCount: 124,
    badge: "Bán chạy",
    badgeColor: "#c0392b",
    description:
      "Hộp quà tinh tế với bạch trà thượng hạng, hoa cúc sấy khô và mật ong rừng nguyên chất. Phù hợp biếu tặng sếp, đối tác và người thân yêu quý.",
    variants: [
      { id: "v1", label: "Set Quà 1 – Cơ Bản", price: 850000, items: ["Bạch trà 100g", "Hoa cúc 50g", "Mật ong 250ml"] },
      { id: "v2", label: "Set Quà 2 – Cao Cấp", price: 1200000, items: ["Bạch trà 200g", "Hoa cúc 100g", "Mật ong 500ml", "Hộp gỗ khắc laser"] },
    ],
    images: ["🍵", "🌸", "🍯"],
    gradient: "linear-gradient(135deg,#C0392B 0%,#922B21 100%)",
    inStock: true,
  },
  {
    id: 2,
    name: "Bộ Sâm Ngọc Linh Thiên Nhiên",
    slug: "bo-sam-ngoc-linh-thien-nhien",
    price: 2400000,
    originalPrice: 2800000,
    category: "sam",
    herbs: ["sam-ngoc-linh", "linh-chi"],
    benefits: ["tang-cuong-suc-de-khang", "chong-lao-hoa"],
    rating: 4.9,
    reviewCount: 87,
    badge: "Cao cấp",
    badgeColor: "#D4AF37",
    description:
      "Sâm Ngọc Linh chính hiệu từ vùng núi Quảng Nam, kết hợp linh chi đỏ đặc biệt. Tăng cường sức đề kháng, chống lão hóa, bồi bổ sức khỏe toàn diện.",
    variants: [
      { id: "v1", label: "Set Quà 1 – 3 Củ", price: 2400000, items: ["Sâm Ngọc Linh 3 củ (50g)", "Linh chi đỏ 100g", "Túi vải cao cấp"] },
      { id: "v2", label: "Set Quà 2 – 6 Củ", price: 4500000, items: ["Sâm Ngọc Linh 6 củ (100g)", "Linh chi đỏ 200g", "Hộp gỗ khắc tên", "Giấy chứng nhận"] },
    ],
    images: ["🌿", "🍄", "✨"],
    gradient: "linear-gradient(135deg,#D4AF37 0%,#C0392B 100%)",
    inStock: true,
  },
  {
    id: 3,
    name: "Combo Hạt Dinh Dưỡng Mã Vương",
    slug: "combo-hat-dinh-duong-ma-vuong",
    price: 650000,
    originalPrice: 780000,
    category: "hat",
    herbs: ["hat-macca", "hat-dieu"],
    benefits: ["bo-nao", "tang-cuong-suc-de-khang"],
    rating: 4.7,
    reviewCount: 203,
    badge: "Mới",
    badgeColor: "#27ae60",
    description:
      "Tổ hợp các loại hạt dinh dưỡng cao cấp: hạt mắc ca Úc, hạt điều rang muối, óc chó Mỹ và hạnh nhân California. Bổ não, tốt tim mạch.",
    variants: [
      { id: "v1", label: "Set Quà 1 – 4 loại", price: 650000, items: ["Hạt mắc ca 200g", "Hạt điều 200g", "Óc chó 150g", "Hạnh nhân 150g"] },
      { id: "v2", label: "Set Quà 2 – 6 loại", price: 950000, items: ["Hạt mắc ca 300g", "Hạt điều 200g", "Óc chó 200g", "Hạnh nhân 200g", "Hạt bí 150g", "Hạt hướng dương 150g"] },
    ],
    images: ["🥜", "🌰", "💪"],
    gradient: "linear-gradient(135deg,#E74C3C 0%,#D35400 100%)",
    inStock: true,
  },
  {
    id: 4,
    name: "Linh Chi Đỏ Hàn Quốc Premium",
    slug: "linh-chi-do-han-quoc-premium",
    price: 1800000,
    originalPrice: 2100000,
    category: "linh-chi",
    herbs: ["linh-chi"],
    benefits: ["chong-lao-hoa", "tang-cuong-suc-de-khang", "thu-gian"],
    rating: 4.6,
    reviewCount: 56,
    badge: "Nhập khẩu",
    badgeColor: "#8e44ad",
    description:
      "Linh chi đỏ 6 năm tuổi nhập khẩu từ Hàn Quốc, đạt chuẩn KGC. Chứa hàm lượng polysaccharide và triterpenoid cao nhất, tăng miễn dịch, chống oxy hóa.",
    variants: [
      { id: "v1", label: "Set Quà 1 – Hộp 500g", price: 1800000, items: ["Linh chi thái lát 500g", "Hộp thiếc cao cấp", "Brochure hướng dẫn"] },
      { id: "v2", label: "Set Quà 2 – Hộp 1kg", price: 3200000, items: ["Linh chi thái lát 1kg", "Hộp gỗ khắc logo", "Brochure hướng dẫn", "Túi vải lụa"] },
    ],
    images: ["🍄", "🌺", "💊"],
    gradient: "linear-gradient(135deg,#8e44ad 0%,#C0392B 100%)",
    inStock: true,
  },
  {
    id: 5,
    name: "Mật Ong Rừng Hoa Nhãn Nguyên Chất",
    slug: "mat-ong-rung-hoa-nhan-nguyen-chat",
    price: 420000,
    originalPrice: 500000,
    category: "mat-ong",
    herbs: ["hoa-nhan"],
    benefits: ["dep-da", "tang-cuong-suc-de-khang", "thu-gian"],
    rating: 4.5,
    reviewCount: 312,
    badge: "Bán chạy",
    badgeColor: "#c0392b",
    description:
      "Mật ong hoa nhãn nguyên chất 100% từ vùng Hưng Yên, không pha trộn, không qua nhiệt. Giữ nguyên enzyme tự nhiên, phù hợp cho cả gia đình.",
    variants: [
      { id: "v1", label: "Set Quà 1 – 2 hũ 500ml", price: 420000, items: ["Mật ong hoa nhãn 2 x 500ml", "Hộp carton cao cấp"] },
      { id: "v2", label: "Set Quà 2 – 3 hũ 1L", price: 780000, items: ["Mật ong hoa nhãn 3 x 1L", "Hộp gỗ thông", "Thìa gỗ tặng kèm"] },
    ],
    images: ["🍯", "🐝", "🌸"],
    gradient: "linear-gradient(135deg,#e67e22 0%,#C0392B 100%)",
    inStock: false,
  },
  {
    id: 6,
    name: "Cao Hồng Sâm Dưỡng Sinh",
    slug: "cao-hong-sam-duong-sinh",
    price: 1650000,
    originalPrice: 1900000,
    category: "sam",
    herbs: ["hong-sam"],
    benefits: ["tang-cuong-suc-de-khang", "chong-lao-hoa", "bo-nao"],
    rating: 4.7,
    reviewCount: 91,
    badge: null,
    badgeColor: null,
    description:
      "Cao hồng sâm 6 năm tuổi cô đặc theo phương pháp truyền thống Hàn Quốc. Bồi bổ khí huyết, tăng cường sinh lực, phù hợp cho người lớn tuổi.",
    variants: [
      { id: "v1", label: "Set Quà 1 – 240g", price: 1650000, items: ["Cao hồng sâm 240g", "Muỗng lấy cao", "Hộp thiếc"] },
      { id: "v2", label: "Set Quà 2 – 480g Deluxe", price: 2900000, items: ["Cao hồng sâm 480g", "Muỗng vàng", "Hộp gỗ khắc tên", "Giấy chứng nhận xuất xứ"] },
    ],
    images: ["🌿", "✨", "🎁"],
    gradient: "linear-gradient(135deg,#C0392B 0%,#7b241c 100%)",
    inStock: true,
  },
];

export const FILTER_OPTIONS = {
  categories: [
    { value: "all", label: "Tất cả" },
    { value: "tra", label: "Trà dược liệu" },
    { value: "sam", label: "Sâm & Hồng sâm" },
    { value: "hat", label: "Hạt dinh dưỡng" },
    { value: "linh-chi", label: "Linh chi" },
    { value: "mat-ong", label: "Mật ong" },
  ],
  herbs: [
    { value: "bach-tra", label: "Bạch trà" },
    { value: "sam-ngoc-linh", label: "Sâm Ngọc Linh" },
    { value: "hong-sam", label: "Hồng sâm" },
    { value: "linh-chi", label: "Linh chi" },
    { value: "hoa-cuc", label: "Hoa cúc" },
    { value: "hat-macca", label: "Hạt mắc ca" },
    { value: "hoa-nhan", label: "Hoa nhãn" },
  ],
  benefits: [
    { value: "tang-cuong-suc-de-khang", label: "Tăng sức đề kháng" },
    { value: "chong-lao-hoa", label: "Chống lão hóa" },
    { value: "thu-gian", label: "Thư giãn giải stress" },
    { value: "dep-da", label: "Đẹp da" },
    { value: "bo-nao", label: "Bổ não, tập trung" },
  ],
  priceRanges: [
    { value: "all", label: "Tất cả mức giá" },
    { value: "0-500000", label: "Dưới 500,000đ" },
    { value: "500000-1000000", label: "500k – 1 triệu" },
    { value: "1000000-2000000", label: "1 – 2 triệu" },
    { value: "2000000-99999999", label: "Trên 2 triệu" },
  ],
};

export function filterProducts(products, filters) {
  return products.filter((p) => {
    if (filters.category && filters.category !== "all" && p.category !== filters.category) return false;
    if (filters.herbs?.length && !filters.herbs.some((h) => p.herbs.includes(h))) return false;
    if (filters.benefits?.length && !filters.benefits.some((b) => p.benefits.includes(b))) return false;
    if (filters.priceRange && filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (p.price < min || p.price > max) return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

export function sortProducts(products, sortBy) {
  const arr = [...products];
  if (sortBy === "price-asc") return arr.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") return arr.sort((a, b) => b.price - a.price);
  if (sortBy === "rating") return arr.sort((a, b) => b.rating - a.rating);
  if (sortBy === "popular") return arr.sort((a, b) => b.reviewCount - a.reviewCount);
  return arr;
}

export function formatPrice(n) {
  return n.toLocaleString("vi-VN") + " đ";
}