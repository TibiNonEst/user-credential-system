const socket = io();
let userHash;
$(function () {
  $("form").submit(function(e) {
    e.preventDefault(); // prevents page reloading
    userHash = CryptoJS.SHA3($("#email").val()).toString();
    const pswdHash = CryptoJS.SHA3($("#password").val()).toString();
    socket.emit("check login", {
      userHash: userHash,
      pswdHash:pswdHash
    });
  });
  socket.on("check login", function(callback){
    if (callback) {
      const salt = CryptoJS.SHA3($("#email").val() + $("#email").val().length + $("#password").val()).toString();
      const key = CryptoJS.PBKDF2($("#password").val(), salt, {keySize: 512 / 32, iterations: 10000}).toString();
      localStorage.userKey = key;
      localStorage.userHash = userHash;
      window.location.assign("/");
    } else {
      $("#userError").removeClass("d-none");
    }
  });
});
