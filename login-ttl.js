if (localStorage.hasOwnProperty("loginTTL")) {
  if (Math.floor(Date.now() / 1000) > localStorage.loginTTL) {
    localStorage.removeItem("userKey");
    localStorage.removeItem("loginTTL");
  }
}
