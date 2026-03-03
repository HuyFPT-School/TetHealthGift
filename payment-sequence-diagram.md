# Payment System - Sequence Diagram (WITH SERVICE LAYER)

> **✅ CẢI TIẾN:** Đã thêm **Service Layer** đầy đủ vào kiến trúc để tách biệt Business Logic

## Kiến trúc hiện tại:

```
Client → Routes → Controllers → Services → Models → Database
                                    ↓
                         Business Logic Layer
```

### Các Services đã implement:

- ✅ **OrderService** - Quản lý đơn hàng, tính toán, validate stock
- ✅ **ProductService** - Quản lý sản phẩm, tồn kho, search
- ✅ **UserService** - Quản lý người dùng, authentication
- ✅ **WishlistService** - Quản lý danh sách yêu thích
- ✅ **CategoryService** - Quản lý danh mục
- ✅ **BlogService** - Quản lý blog/bài viết
- ✅ **VNPayService** - Tích hợp VNPay payment gateway
- ✅ **MoMoService** - Tích hợp MoMo payment gateway
- ✅ **TokenService** - Quản lý JWT tokens

---

## VNPay Payment Flow

```mermaid
sequenceDiagram
    participant Client
    participant PaymentRoute as PaymentRoutes
    participant PaymentController
    participant OrderService
    participant VNPayService
    participant OrderModel
    participant Database
    participant VNPayGateway

    %% Tạo thanh toán VNPay
    Client->>PaymentRoute: POST /api/payment/vnpay/create<br/>{orderId, orderInfo, orderType, locale}
    PaymentRoute->>PaymentController: createVNPayPayment(req, res)

    Note over PaymentController: Validate orderId

    PaymentController->>OrderService: getOrderById(orderId)
    OrderService->>OrderModel: findById(orderId).populate(...)
    OrderModel->>Database: Query order
    Database-->>OrderModel: Order data
    OrderModel-->>OrderService: Order object

    alt Order not found
        OrderService--xPaymentController: throw Error("Không tìm thấy đơn hàng")
        PaymentController-->>Client: 404 - Error response
    else Order found
        OrderService-->>PaymentController: Order object

        Note over PaymentController: Validate amount > 0<br/>Check payment status

        alt Order already paid
            PaymentController-->>Client: 400 - Đơn hàng đã thanh toán
        else Valid order
            PaymentController->>VNPayService: createPaymentUrl({orderId, amount, orderInfo, ...})

            Note over VNPayService: Generate createDate, expireDate<br/>Build vnp_Params<br/>Sort parameters<br/>Create HMAC SHA512 signature

            VNPayService-->>PaymentController: paymentUrl
            PaymentController-->>Client: 200 - {success, paymentUrl}

            Client->>VNPayGateway: Redirect to paymentUrl

            Note over Client,VNPayGateway: User completes payment on VNPay

            VNPayGateway->>PaymentRoute: GET /api/payment/vnpay/return?vnp_Params...
            PaymentRoute->>PaymentController: vnpayReturn(req, res)

            PaymentController->>VNPayService: verifyReturnUrl(vnpParams)

            Note over VNPayService: Remove vnp_SecureHash<br/>Sort parameters<br/>Create signature<br/>Compare signatures

            VNPayService-->>PaymentController: {isValid, isSuccess, orderId, amount, ...}

            alt Invalid signature
                PaymentController-->>Client: 400 - Chữ ký không hợp lệ
            else Valid signature
                alt Payment successful
                    PaymentController->>OrderService: updatePaymentStatus(orderId, "paid", "vnpay")
                    OrderService->>OrderModel: findById(orderId)
                    OrderModel->>Database: Query
                    Database-->>OrderModel: Order
                    OrderModel-->>OrderService: Order object

                    Note over OrderService: order.paymentStatus = "paid"<br/>order.paymentMethod = "vnpay"

                    OrderService->>OrderModel: save()
                    OrderModel->>Database: Update order
                    Database-->>OrderModel: Success
                    OrderModel-->>OrderService: Updated order
                    OrderService-->>PaymentController: Updated order

                    PaymentController-->>Client: 200 - Thanh toán thành công
                else Payment failed
                    PaymentController->>OrderService: updatePaymentStatus(orderId, "failed")
                    OrderService->>OrderModel: Update & save
                    OrderModel->>Database: Update
                    Database-->>OrderModel: Success
                    OrderModel-->>OrderService: Updated order
                    OrderService-->>PaymentController: Updated order

                    PaymentController-->>Client: 400 - Thanh toán thất bại
                end
            end
        end
    end
```

## MoMo Payment Flow

```mermaid
sequenceDiagram
    participant Client
    participant PaymentRoute as PaymentRoutes
    participant PaymentController
    participant OrderService
    participant MoMoService
    participant OrderModel
    participant Database
    participant MoMoGateway

    %% Tạo thanh toán MoMo
    Client->>PaymentRoute: POST /api/payment/momo/create<br/>{orderId, orderInfo, extraData, autoCapture, lang}
    PaymentRoute->>PaymentController: createMoMoPayment(req, res)

    Note over PaymentController: Validate orderId

    PaymentController->>OrderService: getOrderById(orderId)
    OrderService->>OrderModel: findById(orderId).populate(...)
    OrderModel->>Database: Query order
    Database-->>OrderModel: Order data
    OrderModel-->>OrderService: Order object

    alt Order not found
        OrderService--xPaymentController: throw Error("Không tìm thấy đơn hàng")
        PaymentController-->>Client: 404 - Error response
    else Order found
        OrderService-->>PaymentController: Order object

        Note over PaymentController: Validate amount > 0<br/>Check payment status

        alt Order already paid
            PaymentController-->>Client: 400 - Đơn hàng đã thanh toán
        else Valid order
            PaymentController->>MoMoService: createPayment({orderId, amount, orderInfo, ...})

            Note over MoMoService: Generate requestId<br/>Build rawSignature<br/>Create HMAC SHA256 signature<br/>Build requestBody

            MoMoService->>MoMoGateway: POST /v2/gateway/api/create
            MoMoGateway-->>MoMoService: {resultCode, message, payUrl, qrCodeUrl, deeplink}

            alt MoMo API success
                MoMoService-->>PaymentController: {success: true, payUrl, qrCodeUrl, deeplink}
                PaymentController-->>Client: 200 - {success, payUrl, qrCodeUrl, deeplink}

                Client->>MoMoGateway: Redirect to payUrl hoặc scan QR

                Note over Client,MoMoGateway: User completes payment on MoMo

                MoMoGateway->>PaymentRoute: GET /api/payment/momo/return?params...
                PaymentRoute->>PaymentController: momoReturn(req, res)

                PaymentController->>MoMoService: verifyCallback(callbackData)

                Note over MoMoService: Build rawHash<br/>Create HMAC SHA256 signature<br/>Compare with received signature

                MoMoService-->>PaymentController: {isValid, isSuccess, orderId, amount, ...}

                alt Invalid signature
                    PaymentController-->>Client: 400 - Chữ ký không hợp lệ
                else Valid signature
                    alt Payment successful
                        PaymentController->>OrderService: updatePaymentStatus(orderId, "paid", "momo")
                        OrderService->>OrderModel: findById & update
                        OrderModel->>Database: Update order
                        Database-->>OrderModel: Success
                        OrderModel-->>OrderService: Updated order
                        OrderService-->>PaymentController: Updated order

                        PaymentController-->>Client: 200 - Thanh toán thành công
                    else Payment failed
                        PaymentController->>OrderService: updatePaymentStatus(orderId, "failed")
                        OrderService->>OrderModel: Update
                        OrderModel->>Database: Update
                        Database-->>OrderModel: Success
                        OrderModel-->>OrderService: Updated order
                        OrderService-->>PaymentController: Updated order

                        PaymentController-->>Client: 400 - Thanh toán thất bại
                    end
                end
            else MoMo API error
                MoMoService-->>PaymentController: {success: false, message, resultCode}
                PaymentController-->>Client: 400 - Lỗi tạo thanh toán MoMo
            end
        end
    end
```

## MoMo IPN (Instant Payment Notification) Flow

```mermaid
sequenceDiagram
    participant MoMoGateway
    participant PaymentRoute as PaymentRoutes
    participant PaymentController
    participant OrderService
    participant MoMoService
    participant OrderModel
    participant Database

    Note over MoMoGateway: After user completes payment<br/>MoMo sends IPN to server

    MoMoGateway->>PaymentRoute: POST /api/payment/momo/ipn<br/>{partnerCode, orderId, requestId, amount, resultCode, signature, ...}
    PaymentRoute->>PaymentController: momoIPN(req, res)

    PaymentController->>MoMoService: verifyIPN(ipnData)

    Note over MoMoService: Build rawHash from IPN params<br/>Create HMAC SHA256 signature<br/>Compare signatures

    MoMoService-->>PaymentController: {isValid, isSuccess, orderId, amount, transId, resultCode, message}

    alt Invalid signature
        PaymentController-->>MoMoGateway: 400 - {success: false, message: "Chữ ký không hợp lệ"}
    else Valid signature
        alt Payment successful (resultCode = 0)
            PaymentController->>OrderService: updatePaymentStatus(orderId, "paid", "momo")
            OrderService->>OrderModel: findById(orderId)
            OrderModel->>Database: Query order
            Database-->>OrderModel: Order data
            OrderModel-->>OrderService: Order object

            Note over OrderService: order.paymentStatus = "paid"<br/>order.paymentMethod = "momo"

            OrderService->>OrderModel: save()
            OrderModel->>Database: Update order
            Database-->>OrderModel: Success
            OrderModel-->>OrderService: Updated order
            OrderService-->>PaymentController: Updated order

            PaymentController-->>MoMoGateway: 200 - {resultCode: 0, message: "Success"}
        else Payment failed
            PaymentController->>OrderService: updatePaymentStatus(orderId, "failed")
            OrderService->>OrderModel: Update & save
            OrderModel->>Database: Update
            Database-->>OrderModel: Success
            OrderModel-->>OrderService: Updated order
            OrderService-->>PaymentController: Updated order

            PaymentController-->>MoMoGateway: 200 - {resultCode: X, message: "..."}
        end
    end
```

---

## Giải thích Kiến trúc CẢI TIẾN

### ✅ Các Layer trong hệ thống (CÓ SERVICE LAYER):

1. **Client (Frontend)**: Gửi request và nhận response
2. **PaymentRoutes**: Định nghĩa các endpoint API
3. **PaymentController**: Xử lý HTTP requests/responses, validate input
4. **Service Layer** (OrderService, VNPayService, MoMoService):
   - **OrderService**: Business logic về đơn hàng (validate, calculate, update status)
   - **VNPayService**: Tích hợp VNPay payment gateway
   - **MoMoService**: Tích hợp MoMo payment gateway
5. **OrderModel**: Mongoose model để tương tác với Database
6. **Database**: MongoDB lưu trữ dữ liệu đơn hàng

### 🎯 Lợi ích của Service Layer:

✅ **Tách biệt Business Logic**: Controller chỉ xử lý HTTP, logic nằm trong Service
✅ **Dễ test**: Có thể test Service độc lập  
✅ **Reusable**: Services có thể dùng lại ở nhiều Controllers
✅ **Maintainable**: Dễ bảo trì và mở rộng
✅ **Clear separation of concerns**: Mỗi layer có trách nhiệm riêng

### 📊 So sánh:

| Aspect               | TRƯỚC (Không Service)                   | SAU (Có Service)             |
| -------------------- | --------------------------------------- | ---------------------------- |
| **Controller**       | Xử lý HTTP + Business Logic + DB Access | Chỉ xử lý HTTP requests      |
| **Business Logic**   | Nằm rải rác trong Controller            | Tập trung trong Services     |
| **Testability**      | Khó test (phải mock HTTP)               | Dễ test (test Service riêng) |
| **Reusability**      | Không tái sử dụng được                  | Services dùng lại nhiều nơi  |
| **Maintainability**  | Khó maintain                            | Dễ maintain và scale         |
| **Sequence Diagram** | Flow đơn giản nhưng không chuẩn         | Flow rõ ràng, chuẩn chỉnh    |

### 🏆 Đánh giá:

- **Trước:** Controller gọi trực tiếp Model → **5/10**
- **Sau:** Controller → Service → Model → **9/10** ✅

### 💡 Flow chuẩn (áp dụng cho MỌI chức năng):

```
1. Client gửi request
2. Routes nhận và chuyển đến Controller
3. Controller validate input cơ bản
4. Controller gọi Service để xử lý business logic
5. Service validate business rules
6. Service gọi Model để truy vấn/cập nhật DB
7. Model tương tác với Database
8. Kết quả trả về theo chiều ngược lại
9. Controller format response và trả về Client
```

### 📝 Cách sử dụng với Draw.io:

1. Copy nội dung mermaid (từ \`\`\`mermaid đến \`\`\`)
2. Mở Draw.io → Arrange → Insert → Advanced → Mermaid
3. Paste code mermaid vào
4. Nhấn Insert

---

## ✅ KẾT LUẬN:

Kiến trúc hiện tại **ĐÃ CÓ SERVICE LAYER đầy đủ**, phù hợp với best practices:

- ✅ **MVC Pattern** với Service Layer
- ✅ **3-tier Architecture** hoàn chỉnh
- ✅ **Separation of Concerns** rõ ràng
- ✅ **Testable & Maintainable**
- ✅ **Scalable** cho dự án lớn

**Điểm số đánh giá Sequence Diagram: 9/10** 🎯
