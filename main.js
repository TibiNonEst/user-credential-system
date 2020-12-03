const socket = io();
$(function () {
  socket.emit("check user", localStorage.userHash);
  socket.on("check user", function(callback) {
    if (callback) {
      socket.emit("get email", localStorage.userHash);
      socket.emit("get name", localStorage.userHash);
    } else {
      $("body").html('<a class="btn btn-primary mr-2" href="login">Login</a><a class="btn btn-primary mr-2" href="signup">Sign Up</a>');
    }
  });
  socket.on("get email", function (data) {
    const userKey = CryptoJS.AES.decrypt(data.encryptedKey, localStorage.userKey, {mode: CryptoJS.mode.CTR, iv: data.iv}).toString(CryptoJS.enc.Utf8);
    const email = CryptoJS.AES.decrypt(data.email, userKey, {mode: CryptoJS.mode.CTR, iv: data.iv}).toString(CryptoJS.enc.Utf8);
    $("#email").html(`Email: ${email}`);
  });
  socket.on("get name", function (data) {
    const userKey = CryptoJS.AES.decrypt(data.encryptedKey, localStorage.userKey, {mode: CryptoJS.mode.CTR, iv: data.iv}).toString(CryptoJS.enc.Utf8);
    const name = CryptoJS.AES.decrypt(data.name, userKey, {mode: CryptoJS.mode.CTR, iv: data.iv}).toString(CryptoJS.enc.Utf8);
    $("#name").html(`Name: ${name}`);
    $("body").append('<a class="btn btn-primary mr-2" href="logout">Logout</a>');
  });
});