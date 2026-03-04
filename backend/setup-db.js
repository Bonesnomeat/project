const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('Sponza.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS User (
    ID TEXT PRIMARY KEY,
    Email TEXT UNIQUE NOT NULL,
    Password TEXT NOT NULL,
    Username TEXT NOT NULL,
    UType TEXT NOT NULL CHECK(UType IN ('ORG', 'SPNSR', 'ADMIN'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Organization (
    ID TEXT PRIMARY KEY,
    ContactName TEXT,
    Email TEXT,
    Phone TEXT,
    Designation TEXT,
    FOREIGN KEY (ID) REFERENCES User(ID)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Company (
    ID TEXT PRIMARY KEY,
    companyLogo TEXT,
    companyName TEXT,
    industry TEXT,
    companyType TEXT,
    estd TEXT,
    website TEXT,
    description TEXT,
    targetAudience TEXT,
    history TEXT,
    instagram TEXT,
    twitter TEXT,
    linkedin TEXT,
    facebook TEXT,
    GSTNumber TEXT,
    RBA TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Sponsor (
    ID TEXT PRIMARY KEY,
    FullName TEXT,
    Email TEXT,
    Phone TEXT,
    Whatsapp TEXT,
    Designation TEXT,
    OfficialEmail TEXT,
    companyID TEXT,
    FOREIGN KEY (ID) REFERENCES User(ID),
    FOREIGN KEY (companyID) REFERENCES Company(ID)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Events (
    ID TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    expectedAttendees INTEGER,
    startDate TEXT,
    endDate TEXT,
    eventTime TEXT,
    venue TEXT,
    duration TEXT,
    registrationFee REAL,
    estimatedRevenue REAL,
    website TEXT,
    collegeName TEXT,
    affUni TEXT,
    collegeType TEXT,
    collegeWebsite TEXT,
    city TEXT,
    state TEXT,
    organizerName TEXT,
    designation TEXT,
    organizerEmail TEXT,
    organizerPhone TEXT,
    organizerWhatsapp TEXT,
    totalBudget REAL,
    benefits TEXT,
    history TEXT,
    instagram TEXT,
    twitter TEXT,
    facebook TEXT,
    linkedin TEXT,
    createdBy TEXT,
    FOREIGN KEY (createdBy) REFERENCES User(ID)
  )`);

  console.log('All tables created successfully!');
});

db.close();
