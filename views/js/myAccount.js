let formHeader = document.getElementById('form-header');

function initMyAccount() {
    if (sessionStorage.getItem('username')) {
        const user = sessionStorage.getItem('username');
        formHeader.innerHTML += ": " + user;
    }
}
initMyAccount();