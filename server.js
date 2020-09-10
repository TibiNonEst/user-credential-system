var express = require("express");
var fs = require("fs");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.set("view engine", "pug");
app.set("views","./");

app.use(function(req, res, next) {
  res.header("Content-Security-Policy", "default-src 'self' 'unsafe-inline' cdn.nexzcore.com ajax.cloudflare.com fonts.googleapis.com fonts.gstatic.com cdn.jsdelivr.net static.cloudflareinsights.com www.google.com www.w3.org data:");
  res.header("X-Frame-Options", "DENY");
  res.header("X-Powered-By", "Nexzcore");
  res.header("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

io.on('connection', (socket) => {
  socket.on('signup', (data) => {
    var temp = JSON.parse(fs.readFileSync('db.json'));
    temp[data.userHash] = {encryptedKey:data.encryptedKey,iv:data.iv,pswdHash:data.pswdHash,email:data.email,name:data.name};
    fs.writeFileSync('db.json', JSON.stringify(temp,null,2));
  });
  socket.on('check user', (userHash) => {
    var exists = false;
    var temp = JSON.parse(fs.readFileSync('db.json'));
    if (temp[userHash]) {
      exists = true;
    }
    io.emit('check user', exists);
  });
  socket.on('check login', (data) => {
    var validated = false;
    var temp = JSON.parse(fs.readFileSync('db.json'));
    if (temp[data.userHash]) {
      if (temp[data.userHash].pswdHash == data.pswdHash) {
        validated = true;
      }
    }
    io.emit('check login', validated);
  });
  socket.on('get email', (userHash) => {
    var temp = JSON.parse(fs.readFileSync('db.json'));
    io.emit('get email', {email:temp[userHash].email,iv:temp[userHash].iv,encryptedKey:temp[userHash].encryptedKey});
  });
  socket.on('get name', (userHash) => {
    var temp = JSON.parse(fs.readFileSync('db.json'));
    io.emit('get name', {name:temp[userHash].name,iv:temp[userHash].iv,encryptedKey:temp[userHash].encryptedKey});
  });
});

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/signup", function (req, res) {
  res.render("signup");
});

app.get("/logout", function (req, res) {
  res.send("<script src=\"logout.js\"></script>");
});

app.get("/login.js", function (req, res) {
  res.sendFile(`${__dirname}/login.js`);
});

app.get("/signup.js", function (req, res) {
  res.sendFile(`${__dirname}/signup.js`);
});

app.get("/logout.js", function (req, res) {
  res.sendFile(`${__dirname}/logout.js`);
});

var server = http.listen(process.env.PORT || 2050, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Server running at http://%s:%s", host, port);
});