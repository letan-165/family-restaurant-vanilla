const LOCAL = "http://localhost:8080";
const SERVER = "https://noble-debee-tandev-06be2084.koyeb.app";
export const BASE_URL = LOCAL;

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });

  if (!res.ok) throw new Error(`Request lỗi: ${res.status}`);
  return res.json();
}

export const itemAPI = {
  getAll: (page, limit) =>
    request(`/items?page=${page}&limit=${limit}&sortField=index&sortOrder=asc`),
  get: (id) => request(`/items/${id}`),
};

export const orderAPI = {
  getAllByCustomer: (page, limit, userID, status) =>
    request(
      `/orders/user/${userID}?page=${page}&limit=${limit}&status=${status}&sortField=timeBooking&sortOrder=desc`
    ),
  booking: (data) =>
    request("/orders", { method: "POST", body: JSON.stringify(data) }),
};
