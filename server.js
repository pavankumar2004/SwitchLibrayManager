// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");

const fs = require('fs');
const path = require('path');

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting the templating engine to EJS
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  });

// Session configuration with connect-mongo
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  }),
);

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Logging session creation and destruction
app.use((req, res, next) => {
  const sess = req.session;
  // Make session available to all views
  res.locals.session = sess;
  if (!sess.views) {
    sess.views = 1;
    console.log("Session created at: ", new Date().toISOString());
  } else {
    sess.views++;
  }
  next();
});



// Middleware to clear existing login if exists, excluding certain paths
app.use((req, res, next) => {
  const excludedPaths = ['/auth/login', '/auth/register', '/auth/logout'];
  if (req.session && req.session.userId && !excludedPaths.includes(req.path)) {
    req.session.destroy(err => {
      if (err) {
        console.error('Error during session destruction:', err);
        return next(err);
      }
      return res.redirect('/auth/login');
    });
  } else {
    next();
  }
});

// Authentication Routes
app.use(authRoutes);

// Game Routes
app.use('/', gameRoutes); // Updated to mount gameRoutes at '/'

// Root path response
app.get("/", async (req, res) => {
  try {
    res.render("welcome");
  } catch (error) {
    console.error('Failed to render welcome view:', error.message);
    console.error(error.stack);
    res.status(500).send("There was an error serving your request.");
  }
});

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
})
