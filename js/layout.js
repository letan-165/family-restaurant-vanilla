import { BASE_URL } from "./api.js";

function getAuthData() {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const picture = localStorage.getItem("picture");
  const exp = localStorage.getItem("token_exp");
  const now = Math.floor(Date.now() / 1000);

  if (!token || !exp || now >= parseInt(exp)) return null;
  return { token, name, picture };
}

function clearAuth() {
  localStorage.removeItem("id");
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  localStorage.removeItem("picture");
  localStorage.removeItem("token_exp");
}

// --- HEADER ---
fetch("/html/layout/header.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("header").innerHTML = data;

    const currentPageSpan = document.getElementById("current-page");
    const links = document.querySelectorAll(".navbar-nav .nav-link");
    const currentPath = window.location.pathname;

    links.forEach((link) => {
      const linkPath = new URL(link.href).pathname;
      link.classList.toggle("active", linkPath === currentPath);
      if (linkPath === currentPath)
        currentPageSpan.textContent = link.dataset.title;
    });

    const loginLink = document.getElementById("login-link");
    const orderLink = document.getElementById("order-link");
    const auth = getAuthData();

    if (auth) {
      loginLink.innerHTML = `
        <img src="${auth.picture}" alt="Avatar" height="35" class="rounded-circle me-2 border">
        <span class="fw-bold">${auth.name}</span>
      `;
      loginLink.style.cursor = "pointer";

      loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("Bạn có muốn đăng xuất không?")) {
          clearAuth();
          alert("Đã đăng xuất thành công!");
          location.reload();
        }
      });
    } else {
      clearAuth();
      loginLink.href = `${BASE_URL}/auth/google`;
      loginLink.innerHTML = `
        <img src="/public/google.png" alt="Đăng nhập" height="30" class="me-2">
        <span class="fw-bold">Đăng nhập</span>
      `;
    }

    if (orderLink) {
      orderLink.addEventListener("click", (e) => {
        const auth = getAuthData();
        if (!auth) {
          e.preventDefault();
          alert("Vui lòng đăng nhập để xem đơn hàng của bạn!");
        }
      });
    }
  });

// --- FOOTER ---
fetch("/html/layout/footer.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });
