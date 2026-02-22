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

app.post('/Register/Sponsor', (req, res) => {
  const {email, password, username, phone } = req.body;

  db.get("SELECT COUNT(*) as count FROM USER", (err, row) => {  // Generate an ID(Sequential ID)
    if (err) return res.status(500).json({message: err});
    const ID = row.count + 1;
    db.run("INSERT INTO SPONSOR(ID) values(?)", [ID], (err) => { // Create/Add a sponsor with that ID
      if (err) return res.status(500).json({message: err});
      // Create an account with that ID
      db.run("INSERT INTO USER(Email, Password, Username, Phone, UType, ID) values (?, ?, ?, ?, 'SPNSR', ?)", [email, password, username, phone, ID], (err) =>{
        if (err) {
          return res.status(500).json({message: err});
        } else {
        res.status(200).json({message: 'Success'});
        }
      });
    });
  });
});

app.post('/Login/Organization', async (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM USER WHERE Email = (?) and Utype ='ORG'`;
  db.get(query, [email], async (err, row) => {
    if (err) {
      return res.status(500).json({message: "Sorry, We are facing an issue processing your request. Kindly try after some time", Head: 'INTERNAL SERVER ISSUE'});
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

app.post('/Register/Organization', (req, res) => {
  const {email, password, username, phone } = req.body;

  db.get("SELECT COUNT(*) as count FROM USER", (err, row) => {  // Generate an ID(Sequential ID)
    if (err) return res.status(500).json({message: err});
    const ID = row.count + 1;
    db.run("INSERT INTO ORGANIZATION(ID) values(?)", [ID], (err) => { // Create/Add a sponsor with that ID
      if (err) return res.status(500).json({message: err});
      // Create an account with that ID
      db.run("INSERT INTO USER(Email, Password, Username, Phone, UType, ID) values (?, ?, ?, ?, 'ORG', ?)", [email, password, username, phone, ID], (err) =>{
        if (err) {
          return res.status(500).json({message: err});
        } else {
        res.status(200).json({message: 'Success'});
        }
      });
    });
  });
});

app.get('/getSponsorDetails/:id',(req,res)=>{
  db.get("SELECT * FROM USER,SPONSOR WHERE USER.ID = SPONSOR.ID and USER.id=?", [req.params.id], (err, rows) => {
    if (err) {
      return res.status(500).json({message: err});
    } else {
      res.status(200).json(rows);
    }
  });
});

app.get('/getOrganizationDetails/:id',(req,res)=>{
  db.get("SELECT * FROM USER,ORGANIZATION WHERE USER.ID = ORGANIZATION.ID and USER.id=?", [req.params.id], (err, rows) => {
    if (err) {
      return res.status(500).json({message: err});
    } else {
      res.status(200).json(rows);
    }
  });
});

app.get('/delSponsor/:id',(req,res)=>{
  db.run("DELETE FROM USER,SPONSOR WHERE USER.ID = SPONSOR.ID and USER.ID = ?", [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({message: err});
    } else {
      res.status(200).json({message: 'Sponsor deleted successfully'});
    }
  });
});

app.get('/delOrganization/:id',(req,res)=>{
  db.run("DELETE FROM USER,ORGANIZATION WHERE USER.ID = ORGANIZATION.ID and USER.ID = ?", [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({message: err});
    } else {
      res.status(200).json({message: 'Organization deleted successfully'});
    }
  });
});

app.listen(port);
