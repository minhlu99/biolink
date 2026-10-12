# 🚀 BioLink - Modern Edge Linktree Clone

Landing page giới thiệu liên kết cá nhân (Bio Links) hiệu năng cao, giao diện Dark Glassmorphism sang trọng, hiệu ứng chuyển động mượt mà, hỗ trợ **Headless CMS (Google Sheets / JSON)** và deploy **hoàn toàn miễn phí trên Cloudflare Pages**.

---

## ✨ Tính Năng Nổi Bật

- ⚡ **Siêu Tốc**: Xây dựng bằng **Astro + Tailwind CSS**, điểm số **100/100 Lighthouse**, tải trang dưới 50ms.
- 🎨 **Hiệu Ứng Cao Cấp**:
  - Nền Ambient Aurora Mesh chuyển động mềm mại trên GPU.
  - Avatar phát sáng với hiệu ứng thở (breathing aura) và badge xác minh.
  - Link nổi bật (Highlighted) có viền xoay gradient đa sắc cầu vồng và badge `HOT` động.
  - Micro-interactions khi rê chuột, bấm thẻ, và hiệu ứng haptic/spring mượt mà.
- 📱 **Hỗ Trợ Mobile & Chia Sẻ Đỉnh Cao**:
  - Tự động nhận diện thiết bị, giao diện responsive chuẩn app.
  - **Mã QR Popup**: Tự tạo mã QR trực tiếp trên trang để người khác quét ngay khi gặp mặt trực tiếp (kèm nút tải ảnh QR).
  - **Nút Chia Sẻ**: Tích hợp Web Share API native trên điện thoại và tự động copy link kèm toast thông báo nếu trên desktop.
- 🛠️ **Headless CMS Linh Hoạt**:
  - **Cách 1 (Không cần code)**: Kết nối **Google Sheets** làm Headless CMS. Sửa link ngay trên app Google Sheets điện thoại là trang web tự động cập nhật!
  - **Cách 2 (Cho Developer)**: Sửa trực tiếp file `src/data/profile.json` rồi push Git.
- 🌐 **Deploy 0đ với Cloudflare Pages**: Băng thông không giới hạn, auto SSL, gắn Custom Domain tùy thích.

---

## 🛠️ Cài Đặt & Chạy Thử Tại Local

Dự án sử dụng **pnpm** để quản lý package:

```bash
# 1. Di chuyển vào thư mục dự án
cd /Users/myos/Developer/Personal/biolink

# 2. Khởi chạy dev server
pnpm dev
```

Mở trình duyệt tại: `http://localhost:4321`

---

## 📱 Hướng Dẫn Sử Dụng Headless CMS (Google Sheets)

Nếu bạn muốn thêm/sửa/xóa link ngay trên điện thoại mà **không cần mở code hay git push**:

### Bước 1: Tạo Google Sheet
1. Vào Google Drive, tạo một bảng tính mới.
2. Đặt tên các cột ở **Hàng 1** chính xác như sau:
   | id | title | subtitle | url | icon | category | highlight | pinned | active |
   |:---|:---|:---|:---|:---|:---|:---|:---|:---|
   | 1 | Dự án SaaS | Nền tảng tự động hóa | https://example.com | rocket | Dự Án | TRUE | TRUE | TRUE |
   | 2 | Kênh YouTube | Video công nghệ | https://youtube.com | youtube | Mạng Xã Hội | FALSE | FALSE | TRUE |
   | 3 | Mời Cà Phê | Ủng hộ tác giả | https://buymeacoffee.com | coffee | Ủng Hộ | TRUE | FALSE | TRUE |

- **Cột `icon`** hỗ trợ: `rocket`, `github`, `book`, `calendar`, `coffee`, `code`, `globe`, `youtube`, `link`.
- **Cột `highlight`**: `TRUE` (sẽ có viền phát sáng gradient và badge HOT).
- **Cột `active`**: `TRUE` để hiển thị, `FALSE` để ẩn link tạm thời.

### 🖼️ Cập nhật Avatar, Tên & Bio trực tiếp từ Google Sheet:
Bạn (hoặc khách) có thể đổi Avatar, Tên và Bio bất cứ lúc nào bằng cách thêm các hàng cấu hình vào Sheet:
| id | title | subtitle | url | icon | category | highlight | pinned | active |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| **avatar** | Ảnh đại diện | | **https://link-anh.com/avatar.webp** | | | | | TRUE |
| **bio** | Giới thiệu | **Software Engineer & Content Creator ✨ \| Developer & Creator** | | | | | | TRUE |
| **name** | Họ và Tên | **Nguyễn Văn A** | | | | | | TRUE |

> 💡 **Hỗ trợ cả link Google Drive cho Avatar!** Bạn chỉ cần dán link chia sẻ Google Drive (dạng `https://drive.google.com/file/d/.../view`), hệ thống sẽ tự động chuyển đổi sang link ảnh hiển thị tốc độ cao.

#### 📐 Tiêu chuẩn Avatar tối ưu nhất hiện nay:
- **Định dạng tối ưu**: **`.webp`** (nhẹ hơn JPG 30%, chất lượng hiển thị sắc nét, tải tức thì).
- **Tỉ lệ khung hình**: Vuông tuyệt đối **`1:1`**.
- **Kích thước độ phân giải khuyến nghị**: **`500 x 500 px`** (hoặc `800 x 800 px` cho màn hình Retina siêu nét).
- **Dung lượng tệp lý tưởng**: **`30 KB - 80 KB`** (tối đa 150 KB).
- **Bố cục chân dung**: Căn giữa mặt, khuôn mặt chiếm khoảng 60% - 70% khung hình để khi bo tròn (`rounded-full`) không bị che mất tóc hay tai.

### Bước 2: Chia sẻ công khai
- Bấm nút **Chia sẻ (Share)** ở góc trên bên phải Google Sheet.
- Chuyển quyền truy cập chung thành: **Bất kỳ ai có đường liên kết đều có thể xem (Anyone with the link can view)**.

### Bước 3: Lấy Sheet ID
Đường link Google Sheet của bạn có dạng:
`https://docs.google.com/spreadsheets/d/`**`1a2b3c4d5e6f7g8h9i...`**`/edit`
$\rightarrow$ Chuỗi ký tự ở giữa chính là **Sheet ID**.

### Bước 4: Cấu hình vào dự án
Tạo file `.env` (hoặc cấu hình trong Cloudflare Pages):
```env
PUBLIC_GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i...
```

---

## ☁️ Hướng Dẫn Deploy Lên Cloudflare Pages (Miễn Phí 100%)

1. **Khởi tạo Git & Push lên GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial bio link project"
   # Push lên repo GitHub của bạn
   ```
2. **Đăng nhập Cloudflare Dashboard**:
   - Vào mục **Workers & Pages** $\rightarrow$ **Create Application** $\rightarrow$ chọn tab **Pages**.
   - Chọn **Connect to Git** và kết nối với repository của bạn.
3. **Cấu hình Build Settings**:
   - **Framework Preset**: Chọn `Astro`
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
   - *(Tùy chọn)* Trong phần **Environment variables**, thêm `PUBLIC_GOOGLE_SHEET_ID` với Sheet ID của bạn.
4. **Deploy**:
   - Bấm **Save and Deploy**. Cloudflare sẽ build trang trong khoảng ~20 giây.
   - Bạn sẽ nhận được link miễn phí có đuôi `.pages.dev` và có thể gắn custom domain (ví dụ `links.yourdomain.com`).
