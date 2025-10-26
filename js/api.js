const LOCAL = "http://localhost:8080";
const SERVER = "https://noble-debee-tandev-06be2084.koyeb.app";
const BASE_URL = SERVER;

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error("Request lỗi!");
  return res.json();
}

export const itemAPI = {
  getAll: (page, limit) => request(`/items?page=${page}&limit=${limit}&sortField=price&sortOrder=asc`),
  get: (id) => request(`/items/${id}`),
};

export const orderAPI = {
  getAllByCustomer: (userID) => request(`/orders/user/${userID}?page=2&limit=5&status=completed&sortField=price&sortOrder=asc`),
  booking: (data) => request("/orders", { method: "POST", body: JSON.stringify(data) }),
};