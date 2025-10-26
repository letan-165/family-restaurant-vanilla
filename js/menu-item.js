import { itemAPI } from "./api.js";

export async function loadMenus() {
  const loading = document.getElementById("loading"); // Spinner
  const menu1Container = document.getElementById("menu-list");
  const menu2Container = document.getElementById("menu-list-2");

  try {
    if (loading) loading.classList.remove("d-none");

    menu1Container.innerHTML = "";
    menu2Container.innerHTML = "";

    const menu1 = await itemAPI.getAll(1, 4);
    const menu2 = await itemAPI.getAll(2, 4);

    renderMenu(menu1.data, "menu-list", "/public/food-bun.png");
    renderMenu(menu2.data, "menu-list-2", "/public/food-mi.png");

  } catch (error) {
    console.error("Lỗi khi tải dữ liệu menu:", error);
    menu1Container.innerHTML = `<p class="text-center text-danger">Không thể tải dữ liệu.</p>`;
  } finally {
    if (loading) loading.classList.add("d-none");
  }
}

function renderMenu(items, containerId, img) {
  const container = document.getElementById(containerId);

  if (!items || items.length === 0) {
    container.innerHTML = `<p class="text-center text-muted">Không có món nào để hiển thị.</p>`;
    return;
  }

  container.innerHTML = items
    .map(
      (item) => `
      <div class="col-6 col-md-3">
        <div class="card text-center dish border-2 p-1">
          <img src="${img}" class="card-img-top rounded-3" alt="${item.name}">
          <div class="card-body p-2">
            <p class="fw-bold">${item.name}</p>
            <p class="dish-price mb-2">${item.price.toLocaleString("vi-VN")}đ</p>
            <div class="dish-actions d-flex justify-content-center align-items-center gap-2">
              <button class="btn btn-sm btn-dark rounded-circle">-</button>
              <span>0</span>
              <button class="btn btn-sm btn-dark rounded-circle">+</button>
            </div>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}
