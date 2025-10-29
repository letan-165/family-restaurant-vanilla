import { itemAPI } from "./api.js";

const CACHE_KEY = "INDEX_PAGE";
const CACHE_TTL = 1000 * 60 * 10;

window.addEventListener("DOMContentLoaded", loadList);

export async function loadList() {
  const container = document.getElementById("menu-list");
  const cachedStr = localStorage.getItem(CACHE_KEY);
  if (cachedStr) {
    const cached = JSON.parse(cachedStr);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      renderMenu(cached.menu, "menu-list");
      return;
    }
  }
  const spinner = createSpinner();
  container.appendChild(spinner);


  try {
      const menu = await itemAPI.getAll(1, 4);
  
      renderMenu(menu.data, "menu-list");
  
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          menu: menu.data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu menu:", error);
      container.innerHTML = `<p class="text-center text-danger">Không thể tải dữ liệu.</p>`;
    } finally {
      spinner.remove();
    }

}


function renderMenu(items,containerId) {
  const container = document.getElementById(containerId);

  if (!items || items.length === 0) {
    container.innerHTML = `<p class="text-center text-muted">Không có món nào để hiển thị.</p>`;
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const imgSrc = item.img && item.img.trim() !== "" ? item.img : "/public/logo.png";

      return `
        <div class="col-6 col-md-3">
          <div class="card shadow-sm border-0">
            <img src="${imgSrc}" class="card-img-top" alt="${item.name} ">
            <div class="card-body">
              <h6 class="card-title">${item.name}</h6>
              <p class="card-text fw-bold">${item.price.toLocaleString("vi-VN")}₫</p>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
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