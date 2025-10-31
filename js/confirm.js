import { orderAPI } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const orderList = document.getElementById("order-list");
  const orderTotal = document.getElementById("order-total");
  const confirmForm = document.getElementById("confirm-form");
  const submitButton = confirmForm.querySelector("button[type='submit']");

  // Lấy dữ liệu đơn hàng
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // escape HTML nhỏ gọn để tránh chèn mã độc
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  if (cart.length === 0) {
    orderList.innerHTML =
      "<p class='text-muted'>Chưa có món nào được chọn.</p>";
    orderTotal.textContent = "0đ";
    // vô hiệu nút gửi nếu không có món
    if (submitButton) submitButton.disabled = true;
  } else {
    let total = 0;
    const rows = cart
      .map((item) => {
        const itemPrice = Number(item.price) || 0;
        const qty = Number(item.quantity) || 0;
        const itemTotal = itemPrice * qty;
        total += itemTotal;

        return `
            <tr>
              <td>${escapeHtml(item.name)}</td>
              <td class="text-end align-middle">${itemPrice.toLocaleString(
                "vi-VN"
              )}đ</td>
              <td class="text-center align-middle">${qty}</td>
              <td class="text-end align-middle fw-bold text-brown">${itemTotal.toLocaleString(
                "vi-VN"
              )}đ</td>
            </tr>
          `;
      })
      .join("");

    const tableHtml = `
        <div class="table-responsive">
          <table class="table mb-0">
            <thead class="table-light">
              <tr>
                <th>Tên món</th>
                <th class="text-end">Giá</th>
                <th class="text-center">SL</th>
                <th class="text-end">Tổng</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      `;

    orderList.innerHTML = tableHtml;
    orderTotal.textContent = total.toLocaleString("vi-VN") + "đ";

    if (submitButton) submitButton.disabled = false;
  }

  // Xử lý submit form
  confirmForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userID = localStorage.getItem("id");
    const receiver = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    if (!receiver || !phone || !address) {
      alert("Vui lòng điền đầy đủ thông tin nhận hàng.");
      return;
    }

    const request = {
      customer: { userID, receiver, phone, address },
      items: cart,
    };

    console.log("Dữ liệu đơn hàng gửi đi:", request);

    try {
      await orderAPI.booking(request);
      alert("Đặt hàng thành công! Cảm ơn bạn đã ủng hộ ❤️");
      localStorage.removeItem("cart");
      window.location.href = "/html/order.html";
    } catch (err) {
      console.error("Lỗi khi gửi đơn hàng:", err);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    }
  });
});
