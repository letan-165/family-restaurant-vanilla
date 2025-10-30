const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const userName = params.get("name");
const picture = params.get("picture");
const token = params.get("token");

const messageDiv = document.getElementById("message");

if (id && token && userName && picture) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  const exp = payload.exp;

  const decodedName = decodeURIComponent(userName);
  const decodedPic = decodeURIComponent(picture);

  localStorage.setItem("id", id);
  localStorage.setItem("token", token);
  localStorage.setItem("name", decodedName);
  localStorage.setItem("picture", decodedPic);
  localStorage.setItem("token_exp", exp);

  messageDiv.innerHTML = `
    <div class="alert alert-success" role="alert">
      Xin chào <b>${decodedName}</b>!<br>
      <img src="${decodedPic}" alt="avatar" class="avatar mt-2"><br>
      <small>Đăng nhập thành công — đang chuyển hướng...</small>
    </div>
  `;
} else {
  messageDiv.innerHTML = `
    <div class="alert alert-danger" role="alert">
      Đăng nhập thất bại.<br>
      Vui lòng thử lại!
    </div>
  `;
}

setTimeout(() => {
  window.location.href = "/index.html";
}, 2000);
