function logout() {
    // sessionStorage.clear();
    deleteAllCookies(document);// TODO: Check if it is correct
    window.location = "/index";
}

function deleteAllCookies(doc) {
    var c = doc.cookie.split("; ");
    for (i in c)
        document.cookie =/^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
}