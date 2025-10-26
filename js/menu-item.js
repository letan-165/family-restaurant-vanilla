import { itemAPI } from "./api.js";

const CACHE_KEY = "cachedMenu";
const CACHE_TTL = 1000 * 60 * 5;

export async function loadMenus() {
  const menu1Container = document.getElementById("menu-list");
  const menu2Container = document.getElementById("menu-list-2");

  const cachedStr = localStorage.getItem(CACHE_KEY);
  if (cachedStr) {
    const cached = JSON.parse(cachedStr);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      renderMenu(cached.menu1, "menu-list", "/public/food-bun.png");
      renderMenu(cached.menu2, "menu-list-2", "/public/food-mi.png");
      return;
    }
  }

  const spinner1 = createSpinner();
  const spinner2 = createSpinner();
  menu1Container.appendChild(spinner1);
  menu2Container.appendChild(spinner2);

  try {
    const menu1 = await itemAPI.getAll(1, 4);
    const menu2 = await itemAPI.getAll(2, 4);

    renderMenu(menu1.data, "menu-list", "/public/food-bun.png");
    renderMenu(menu2.data, "menu-list-2", "/public/food-mi.png");

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        menu1: menu1.data,
        menu2: menu2.data,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu menu:", error);
    menu1Container.innerHTML = `<p class="text-center text-danger">Không thể tải dữ liệu.</p>`;
    menu2Container.innerHTML = `<p class="text-center text-danger">Không thể tải dữ liệu.</p>`;
  } finally {
    spinner1.remove();
    spinner2.remove();
  }
}

function createSpinner() {
  const div = document.createElement("div");
  div.classList.add("d-flex", "justify-content-center", "align-items-center", "my-3");
  div.innerHTML = `
    <div class="spinner-border text-brown" role="status">
      <span class="visually-hidden">Đang tải...</span>
    </div>
  `;
  return div;
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
