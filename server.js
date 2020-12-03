const express = require("express");
const fs = require("fs");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

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
    let temp = JSON.parse(fs.readFileSync('db.json'));
    temp[data.userHash] = {
      encryptedKey: data.encryptedKey,
      iv: data.iv,
      pswdHash: data.pswdHash,
      email: data.email,
      name: data.name
    };
    fs.writeFileSync('db.json', JSON.stringify(temp, null, 2));
  });
  socket.on('check user', (userHash) => {
    let exists = false;
    const temp = JSON.parse(fs.readFileSync('db.json'));
    if (temp[userHash]) {
      exists = true;
    }
    io.to(socket.id).emit('check user', exists);
  });
  socket.on('check login', (data) => {
    let validated = false;
    const temp = JSON.parse(fs.readFileSync('db.json'));
    if (temp[data.userHash]) {
      if (temp[data.userHash].pswdHash == data.pswdHash) {
        validated = true;
      }
    }
    io.to(socket.id).emit('check login', validated);
  });
  socket.on('get email', (userHash) => {
    const temp = JSON.parse(fs.readFileSync('db.json'));
    io.to(socket.id).emit('get email', {
      email: temp[userHash].email,
      iv: temp[userHash].iv,
      encryptedKey: temp[userHash].encryptedKey
    });
  });
  socket.on('get name', (userHash) => {
    const temp = JSON.parse(fs.readFileSync('db.json'));
    io.to(socket.id).emit('get name', {
      name: temp[userHash].name,
      iv: temp[userHash].iv,
      encryptedKey: temp[userHash].encryptedKey
    });
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
  res.send("<script src='logout.js'></script>");
});

app.get("/main.js", function (req, res) {
  res.sendFile(`${__dirname}/main.js`);
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

const server = http.listen(process.env.PORT || 2050, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Server running at http://%s:%s", host, port);
});
