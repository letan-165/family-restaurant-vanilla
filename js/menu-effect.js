import { loadMenus } from "./menu-item.js";

async function initMenuPage() {
  await loadMenus();

  const dishes = document.querySelectorAll(".dish");
  const totalDisplay = document.querySelector(".cart-box span");
  const orderButton = document.querySelector(".cart-box button");

  // Hàm cập nhật tổng tiền
  function updateTotal() {
    let total = 0;
    dishes.forEach((dish) => {
      const qty = parseInt(
        dish.querySelector(".dish-actions span").textContent
      );
      const priceText = dish
        .querySelector(".dish-price")
        .textContent.replace(/[^\d]/g, "");
      total += qty * parseInt(priceText);
    });
    totalDisplay.textContent = total.toLocaleString("vi-VN") + "đ";
  }

  // Xử lý nút cộng / trừ
  dishes.forEach((dish) => {
    const minusBtn = dish.querySelector("button:first-child");
    const plusBtn = dish.querySelector("button:last-child");
    const qtySpan = dish.querySelector(".dish-actions span");

    plusBtn.addEventListener("click", () => {
      let value = parseInt(qtySpan.textContent);
      qtySpan.textContent = value + 1;
      dish.classList.add("active");
      updateTotal();
    });

    minusBtn.addEventListener("click", () => {
      let value = parseInt(qtySpan.textContent);
      if (value > 0) {
        qtySpan.textContent = value - 1;
        if (value - 1 === 0) dish.classList.remove("active");
        updateTotal();
      }
    });
  });

  // Khi nhấn ĐẶT MÓN
  orderButton.addEventListener("click", () => {
    const cart = [];

    dishes.forEach((dish) => {
      const qty = parseInt(
        dish.querySelector(".dish-actions span").textContent
      );
      if (qty > 0) {
        const id = dish.dataset.id;
        const name = dish.querySelector(".dish-name").textContent.trim();
        const priceText = dish
          .querySelector(".dish-price")
          .textContent.replace(/[^\d]/g, "");
        const price = parseInt(priceText);
        cart.push({ id, name, price, quantity: qty });
      }
    });

    if (cart.length === 0) {
      alert("Vui lòng chọn ít nhất một món trước khi đặt hàng!");
      return;
    }

    // Lưu giỏ hàng vào localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Chuyển sang trang xác nhận
    window.location.href = "/html/confirm.html";
  });
}

document.addEventListener("DOMContentLoaded", initMenuPage);
