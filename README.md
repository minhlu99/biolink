# 🚀 BioLink - Modern Edge Linktree Clone

Landing page giới thiệu liên kết cá nhân (Bio Links) hiệu năng cao, giao diện **Light Bento / Linktree Pro Aesthetic** thanh lịch, nền **Pastel Mesh Gradient** sang trọng, hỗ trợ **Song ngữ Anh - Việt (VI/EN)**, **Tự động nhận diện URL & Full Icon**, kết nối **Google Sheets làm Headless CMS** và deploy **hoàn toàn miễn phí trên Cloudflare Pages (0đ vĩnh viễn)**.

---

## ✨ Tính Năng Nổi Bật

- ⚡ **Siêu Tốc (100/100 Lighthouse)**: Xây dựng bằng **Astro + Tailwind CSS**, zero-JS runtime cho phần nội dung, tải trang dưới 30ms.
- 🎨 **Giao Diện Thị Giác Cao Cấp**:
  - Nền **Luminous Pastel Mesh Gradient** ấm áp, sang trọng (chuẩn Bento.me / Apple).
  - Thẻ card kính mờ tinh thể trắng (`rgba(255,255,255,0.94)` kèm `backdrop-blur-md`).
  - **Full Icon lớn (~32px)** không bị viền gò bó, nhận diện thương hiệu tức thì.
  - Link nổi bật (**`Hot`**) có viền xoay gradient đa sắc cầu vồng chuyển động liên tục.
  - Link ghim (**`Ghim`**) tự động sắp xếp lên vị trí cao nhất trên cùng.
- 🤖 **Tự Động Nhận Diện Link Thông Minh**:
  - Tự động nhận diện domain và gán đúng icon + màu sắc thương hiệu: **Threads, Facebook, TikTok, Instagram, Zalo, YouTube, Shopee, Telegram, Messenger**.
  - **Số điện thoại**: Tự nhận diện và gắn badge **"Gọi ngay"** (bấm vào là gọi luôn trên điện thoại).
  - **Email**: Tự nhận diện và gắn badge **"Gửi thư"** (bấm vào mở ứng dụng mail).
  - Cột `icon` trong Google Sheet có thể để trống hoàn toàn!
- 🌐 **Hỗ Trợ Song Ngữ (Bilingual VI / EN)**:
  - Nút chuyển ngôn ngữ `VI | EN` mượt mà, lưu vào `localStorage`.
  - Hỗ trợ cú pháp song ngữ trong Google Sheet: `Tiêu đề tiếng Việt | English Title`.
- 🛠️ **Headless CMS Không Cần Code (Google Sheets)**:
  - Thêm / sửa / xóa link ngay trên ứng dụng Google Sheets điện thoại.
  - Đổi được cả **Avatar**, **Tên** và **Bio** trực tiếp từ Google Sheet (nhận cả link Google Drive).
  - **LiveSync 60s Cooldown**: Tự động đồng bộ link mới sau 1 phút mà không cần deploy lại!
- 📱 **Tiện Ích Chia Sẻ Đỉnh Cao**:
  - **Popup Mã QR** tự động vẽ mã QR của trang web + nút tải ảnh QR để in hoặc quét trực tiếp.
  - **Web Share API**: Bật menu chia sẻ gốc trên điện thoại / tự copy link kèm Toast thông báo nổi trên desktop.
- ☁️ **Deploy 0đ với Cloudflare Pages**: Băng thông không giới hạn, auto SSL, gắn Custom Domain miễn phí.

---

## 🛠️ Cài Đặt & Chạy Thử Tại Local

```bash
# 1. Di chuyển vào thư mục dự án
cd /Users/myos/Developer/Personal/biolink

# 2. Khởi chạy dev server
pnpm dev
```
Mở trình duyệt tại: `http://localhost:4321`

---

## 📱 Hướng Dẫn Sử Dụng Headless CMS (Google Sheets)

### Bước 1: Tạo Google Sheet
1. Vào Google Drive, tạo một bảng tính mới.
2. Đặt tên các cột ở **Hàng 1** chính xác như sau:
   | id | title | subtitle | url | icon | category | highlight | pinned | active |
   |:---|:---|:---|:---|:---|:---|:---|:---|:---|
   | 1 | Chat Zalo với mình | Phản hồi trong 15 phút | https://zalo.me/0901234567 | | Liên Hệ | FALSE | FALSE | TRUE |
   | 2 | Hotline / Gọi trực tiếp | Hỗ trợ 24/7 | 0901234567 | | Liên Hệ | TRUE | TRUE | TRUE |
   | 3 | Theo dõi Threads | Đời sống & Tech | https://threads.net/@myos | | Mạng Xã Hội | FALSE | FALSE | TRUE |
   | 4 | Dự án SaaS mới | Nền tảng tự động hóa | https://example.com | rocket | Dự Án | TRUE | FALSE | TRUE |

- **Cột `icon`**: Có thể **để trống hoàn toàn**, hệ thống tự nhận diện URL! (Hoặc điền các icon thủ công: `rocket`, `book`, `calendar`, `coffee`, `globe`).
- **Cột `pinned`**: `TRUE` để ghim lên đầu trang.
- **Cột `highlight`**: `TRUE` để có viền phát sáng gradient và badge `HOT`.
- **Cột `active`**: `TRUE` để hiển thị, `FALSE` để ẩn link.

### 🖼️ Cập nhật Avatar, Tên & Bio từ Google Sheet:
Thêm các hàng cấu hình đặc biệt vào bảng tính:
| id | title | subtitle | url | active |
|:---|:---|:---|:---|:---|
| **avatar** | Ảnh đại diện | | **https://link-anh.com/avatar.webp** *(hoặc link Google Drive)* | **TRUE** |
| **bio** | Giới thiệu | **Software Engineer & Builder ✨ \| Developer & Creator** | | **TRUE** |
| **name** | Họ và Tên | **Nguyễn Văn A** | | **TRUE** |

#### 📐 Tiêu chuẩn Avatar tối ưu nhất:
- **Định dạng**: **`.webp`** (nhẹ hơn JPG 35%, hiển thị sắc nét).
- **Tỉ lệ khung hình**: Vuông **`1:1`**.
- **Độ phân giải khuyến nghị**: **`500 x 500 px`** (hoặc `800 x 800 px` cho màn hình Retina).
- **Dung lượng**: **`30 KB - 80 KB`** (tối đa 150 KB).
- **Bố cục**: Căn giữa mặt, khuôn mặt chiếm 60% – 70% khung hình.

### Bước 2: Chia sẻ công khai
- Bấm nút **Chia sẻ (Share)** ở góc trên bên phải Google Sheet.
- Chuyển quyền truy cập chung thành: **Bất kỳ ai có đường liên kết đều có thể xem (Anyone with the link can view)**.

### Bước 3: Lấy Sheet ID & Cấu hình
Đường link Google Sheet của bạn có dạng:
`https://docs.google.com/spreadsheets/d/`**`[SHEET_ID]`**`/edit`
$\rightarrow$ Copy chuỗi ký tự ở giữa và đặt vào file `.env`:
```env
PUBLIC_GOOGLE_SHEET_ID=your_sheet_id_here
```

---

## ☁️ Hướng Dẫn Deploy Lên Cloudflare Pages (0đ Vĩnh Viễn)

1. **Đẩy mã nguồn lên GitHub**:
   ```bash
   cd /Users/myos/Developer/Personal/biolink
   git remote add origin https://github.com/<username>/biolink.git
   git push -u origin main
   ```
2. **Đăng nhập Cloudflare Dashboard**:
   - Vào [dash.cloudflare.com](https://dash.cloudflare.com) $\rightarrow$ **Workers & Pages** $\rightarrow$ **Create Application** $\rightarrow$ chọn tab **Pages**.
   - Bấm **Connect to Git** và chọn repository `biolink`.
3. **Cấu hình Build Settings**:
   - **Framework Preset**: Chọn `Astro`
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
   - Trong phần **Environment variables**, bấm **Add variable**:
     - Variable: `PUBLIC_GOOGLE_SHEET_ID`
     - Value: ID Google Sheet của bạn
4. **Deploy**:
   - Bấm **Save and Deploy**. Cloudflare sẽ build trang trong khoảng ~25 giây.
   - Bạn sẽ nhận được link miễn phí có đuôi `.pages.dev` và có thể gắn custom domain tùy thích.
