let form = document.getElementById('form');

function initLogin() {
    let loginBtn = document.createElement('div');
    loginBtn.innerHTML = `<button type="submit" form="form">Login</button>`;
    form.appendChild(loginBtn);
}
initLogin();

// function login(e) {
//     e.preventDefault();
//     let username = document.getElementById("username").value;
//     // TODO: Query check here. Return a matching error to the user
//
//     // sessionStorage.setItem('username', username);
//     window.location = "/index";
// }

// module.exports = {login};
