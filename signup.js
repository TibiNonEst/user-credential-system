$(function () {
  var socket = io();
  var userHash;
  $("form").submit(function(e) {
    e.preventDefault(); // prevents page reloading
    userHash = CryptoJS.SHA3($("#email").val()).toString();
    socket.emit("check user", userHash);
  });
  socket.on("check user", function(callback){
    if (!callback) {
      var salt = CryptoJS.SHA3($("#email").val()+$("#email").val().length+$("#password").val()).toString();
      var key = CryptoJS.PBKDF2($("#password").val(), salt, {keySize: 512 / 32, iterations: 10000}).toString();
      var iv = CryptoJS.lib.WordArray.random(512 / 8).toString();
      var userKey = CryptoJS.lib.WordArray.random(512 / 8).toString();
      var encryptedKey = CryptoJS.AES.encrypt(userKey, key, {mode: CryptoJS.mode.CTR, iv: iv}).toString();
      var email = CryptoJS.AES.encrypt($("#email").val(), userKey, {mode: CryptoJS.mode.CTR, iv: iv}).toString();
      var name = CryptoJS.AES.encrypt($("#name").val(), userKey, {mode: CryptoJS.mode.CTR, iv: iv}).toString();
      var pswdHash = CryptoJS.SHA3($("#password").val()).toString();
      socket.emit("signup", {
        encryptedKey: encryptedKey,
        iv: iv,
        pswdHash: pswdHash,
        userHash: userHash,
        email: email,
        name: name 
      });
      localStorage.userKey = key;
      localStorage.userHash = userHash;
      window.location.assign("/");
    } else {
      console.log("There is already an account with that email!");
    }
  });
});
