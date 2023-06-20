let form = document.getElementById('form');

function initLogin() {
    let loginBtn = document.createElement('div');
    loginBtn.innerHTML = `<button onclick="login(event)">Login</button>`;
    form.appendChild(loginBtn);
}
initLogin();

function login(e) {
    e.preventDefault();
    let username = document.getElementById("username").value;
    sessionStorage.setItem('username', username);
    window.location = "../static/index.html";
}