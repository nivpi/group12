let rightItems = document.querySelector('.right-items');

function initApp(){
    if (sessionStorage.getItem('username')) {
        const user = sessionStorage.getItem('username');
        let userLabel = document.createElement('li');
        userLabel.innerHTML = `Hello ${user}`;
        rightItems.appendChild(userLabel);
        let myAccountBtn = document.createElement('li');
        myAccountBtn.innerHTML = `
        <a href="myAccount.html">My Account</a>`;
        rightItems.appendChild(myAccountBtn);
        let logoutBtn = document.createElement('li');
        logoutBtn.classList.add('button-logout');
        logoutBtn.innerHTML = `
        <button id="logout-button" onclick="logout()">Logout</button>`;
        rightItems.appendChild(logoutBtn);
    }
    else {
        let loginBtn = document.createElement('li');
        loginBtn.innerHTML = `
        <a href="login.html">Login</a>`;
        rightItems.appendChild(loginBtn);
    }
}
initApp();