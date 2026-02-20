const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bc = require('bcrypt');
const db = new sqlite3.Database('Users.db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'Sumit loves BolB';
const app = express();
app.use(express.json());
const port = 2007

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({message: 'Access Denied!'});
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({message: 'Invalid or expired token!'});
    }
    req.user = user;
    next();
  })
}

app.post('/Login/Sponsor', async (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM USER WHERE Email = (?)`;
  db.get(query, [email], async (err, row) => {
    if (err) {
      return res.status(500).json({message: "Sorry, We are facing an issue processing yout request. Kindly try after some time", Head: 'INTERNAL SERVER ISSUE'});
    } else if (!row) {
      return res.status(404).json({message: 'Invalid Creds!'});
    } else {
      const match = await bc.compare(password, row.password);
      if (!match) {
        return res.status(401).json({message: 'Incorrect password!'})
      } else {
        const token = jwt.sign(
              {id: row.ID, email: row.Email},
              JWT_SECRET,
              {expiresIn: '30d'}
            );
        res.status(200).json({message: 'Login Successful', token: token});
      }
    }
  });
});

`app.post('/Register/Sponsor', (req, res) => {
  const {email, password, username, phone } = req.body;
  db.run('INSERT INTO USER(Email, Password, Username, Phone) values (?, ?, ?, ?)', (err) {
    if (err) {
      return res.status(500).json({message: err});
    } else {
    res.status(200).json({message: 'Success'});
  }
  });
});`

app.listen(port);
