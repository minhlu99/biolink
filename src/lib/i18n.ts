export type Language = 'vi' | 'en';

export const translations = {
  vi: {
    share: 'Chia sẻ',
    qr: 'Mã QR',
    qrDesc: 'Quét mã QR để mở trang liên kết cá nhân trên điện thoại',
    downloadQr: 'Tải ảnh QR',
    close: 'Đóng',
    callNow: 'Gọi ngay',
    sendMail: 'Gửi thư',
    pinned: 'Ghim',
    hot: 'Hot',
    copied: 'Đã sao chép liên kết vào bộ nhớ tạm!',
    copyFailed: 'Không thể sao chép, vui lòng sao chép thủ công.',
    empty: 'Chưa có liên kết nào được kích hoạt.',
    emptyDesc: 'Thêm hàng mới vào Google Sheet để hiển thị liên kết tại đây ✨',
    verified: 'Đã xác minh',
  },
  en: {
    share: 'Share',
    qr: 'QR Code',
    qrDesc: 'Scan QR code to open this bio link page on mobile',
    downloadQr: 'Download QR',
    close: 'Close',
    callNow: 'Call now',
    sendMail: 'Email',
    pinned: 'Pinned',
    hot: 'Hot',
    copied: 'Link copied to clipboard!',
    copyFailed: 'Failed to copy, please copy manually.',
    empty: 'No active links available yet.',
    emptyDesc: 'Add new rows in Google Sheet to display links here ✨',
    verified: 'Verified',
  },
};

/**
 * Helper to parse bilingual text format: "Nội dung tiếng Việt | English Content"
 * If no separator "|" exists, returns original text.
 */
export function parseBilingual(text: string | undefined, lang: Language = 'vi'): string {
  if (!text) return '';
  if (!text.includes('|')) return text.trim();

  const parts = text.split('|').map((p) => p.trim());
  if (lang === 'en' && parts[1]) {
    return parts[1];
  }
  return parts[0] || text;
}
