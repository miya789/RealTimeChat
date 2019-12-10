'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const fs = require('fs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// const dynamodb = require('./dynamoDB.js');
// console.log(dynamodb);
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  if (!exists) {
    db.run("CREATE TABLE Posts (id INTEGER PRIMARY KEY AUTOINCREMENT, post TEXT)");
    console.log("New table Posts created!");
    db.serialize(() => {
      db.run('INSERT INTO Posts (post) VALUES ("aaa")');
    });
  } else {
    console.log('Database "Posts" ready to go!');
    db.serialize(() => {
      // db.run('show tables');
      // db.run('INSERT INTO Posts (post) VALUES ("aaa")');
    });

    db.each("SELECT * FROM Posts", (err, row) => {
      if (row) {
        console.log(`record: ${row.post}`);
      } else {
        console.log(`record: ${err}`);
      }
    });
  }
});

http.listen(PORT, () => console.log(`listening on *:${PORT}`));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.get('/getPosts', (req, res) => {
  db.all("SELECT * FROM Posts", (err, rows) => {
    res.send(JSON.stringify(rows));
  })
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    socket.on('transfer data', (data) => {
        console.log('transfer data');
        io.emit('chat message', data);
    });
});
