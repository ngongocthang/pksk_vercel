export function convertToSlug(text) {
    return text
        .toLowerCase() // Chuyển toàn bộ chuỗi sang chữ thường
        .normalize("NFD") // Chuyển ký tự có dấu thành tổ hợp (e.g., ê → e + ˆ)
        .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
        .replace(/đ/g, "d") // Thay thế đ bằng d
        .replace(/Đ/g, "D") // Thay thế Đ bằng D
        .replace(/\s+/g, "") // Xóa khoảng trắng
        .trim(); // Loại bỏ khoảng trắng dư thừa ở đầu và cuối
}