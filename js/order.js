import { orderAPI } from "./api.js";

function getStatusBadge(status) {
  switch (status) {
    case "PENDING":
      return `<span class="badge" style="background-color:#FFD966; color:#000;">PENDING</span>`;
    case "CONFIRMED":
      return `<span class="badge" style="background-color:#5BC0DE; color:#fff;">CONFIRMED</span>`;
    case "COMPLETED":
      return `<span class="badge" style="background-color:#28A745; color:#fff;">COMPLETED</span>`;
    case "CANCELLED":
      return `<span class="badge" style="background-color:#DC3545; color:#fff;">CANCELLED</span>`;
    default:
      return `<span class="badge bg-secondary">${status}</span>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const orderList = document.getElementById("order-list");
  const loading = document.getElementById("loading");
  const message = document.getElementById("message");
  const tabs = document.querySelectorAll("#statusTabs button");

  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("id");

  if (!token || !userID) {
    message.innerHTML = "Vui lòng đăng nhập để xem đơn hàng của bạn.";
    return;
  }

  // Hàm load đơn hàng theo status
  async function loadOrders(status) {
    try {
      loading.classList.remove("d-none");
      message.innerHTML = "";
      orderList.innerHTML = "";

      const page = 1;
      const limit = 99;
      const data = await orderAPI.getAllByCustomer(page, limit, userID, status);

      loading.classList.add("d-none");

      if (!data || !data.data || data.data.length === 0) {
        message.innerHTML = "Bạn chưa có đơn hàng nào.";
        return;
      }

      renderOrders(data.data);
    } catch (err) {
      loading.classList.add("d-none");
      message.innerHTML = `Lỗi tải đơn hàng: ${err.message}`;
    }
  }

  function renderOrders(orders) {
    orderList.innerHTML = orders
      .map(
        (order, index) => `
    <div class="col-12">
      <div class="card shadow-sm rounded-4 mb-3 border-0">

        <!-- Header card -->
        <div class="card-header d-flex flex-column align-items-start"
             data-bs-toggle="collapse"
             data-bs-target="#collapseItems${index}"
             aria-expanded="false"
             style="cursor:pointer; background-color:#5B3920; color:#fff; padding:1rem; border-top-left-radius:1rem; border-top-right-radius:1rem;">

          <!-- Ngày đặt -->
          <span style="color:#FFFFFF; font-size:0.95rem;">
            <strong style="color:#F2E8DA; font-weight:700;">Ngày đặt:</strong>
            <span style="color:#FFFFFF; margin-left:6px;">${new Date(
              order.timeBooking
            ).toLocaleString("vi-VN")}</span>
          </span>

          <!-- Mã đơn -->
          <span class="mt-2">
            <strong style="color:#F2E8DA; font-weight:700;">Mã đơn:</strong>
            <span style="color:#FFFFFF; margin-left:6px;">${order.id}</span>
          </span>

          <!-- Trạng thái & Tổng tiền cùng dòng -->
          <div class="d-flex justify-content-start w-100 mt-2" style="align-items:center; gap:20px;">
            <span>
              <strong style="color:#F2E8DA; font-weight:700;">Trạng thái:</strong>
              <span style="margin-left:6px;">${getStatusBadge(
                order.status
              )}</span>
            </span>
            <span>
              <strong style="color:#F2E8DA; font-weight:700;">Tổng tiền:</strong>
              <span style="color:#FFFFFF; margin-left:6px;">${order.total.toLocaleString()}đ</span>
            </span>
          </div>

        </div>

        <!-- Body collapse -->
        <div id="collapseItems${index}" class="collapse">
          <div class="card-body p-3" style="background-color:#FFF9C4; border-bottom-left-radius:1rem; border-bottom-right-radius:1rem;">
            <ul class="list-unstyled mb-0">
              ${order.items
                .map(
                  (it) => `
                <li class="d-flex align-items-center mb-3" style="gap:12px;">
                  <img src="${it.item.image}" alt="${it.item.name}"
                       class="rounded" style="width:60px; height:60px; object-fit:cover; border:1px solid #ddd;">
                  
                  <div class="flex-grow-1" style="min-width:0;">
                    <div style="color:#3d2b23; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                      ${it.item.name}
                    </div>
                    <div style="color:#6c5847; font-size:0.9rem;">SL: ${
                      it.quantity
                    } × ${it.item.price.toLocaleString()}đ</div>
                  </div>

                  <div style="font-weight:700; color:#5B3920; margin-left:12px;">
                    ${(it.quantity * it.item.price).toLocaleString()}đ
                  </div>
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        </div>

      </div>
    </div>
  `
      )
      .join("");
  }

  // Tab click event
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const status = tab.getAttribute("data-status");
      loadOrders(status);
    });
  });

  // Load tab mặc định: PENDING
  loadOrders("PENDING");
});
