const express = require('express');
const path = require('path');
require('dotenv').config();

const surveyRoutes = require('./routes/survey');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware Setup
// Enable parsing of JSON request bodies 
app.use(express.json());
// Enable parsing of URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS and JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// --- View Engine Setup ---
// Set up the view engine to render HTML files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html'); // Treat .html files as views
app.engine('html', require('ejs').renderFile); // Use EJS to render plain HTML files

// --- HTML Page Routes ---
// Redirect root URL to the fill survey page
app.get('/', (req, res) => {
    res.redirect('/fill-survey');
});

// Route to serve the Fill Out Survey HTML page
app.get('/fill-survey', (req, res) => {
    res.render('fill-survey'); 
});

// Route to serve the View Survey Results HTML page
app.get('/view-results', (req, res) => {
    res.render('view-results'); 
});

// All API routes defined in routes/survey.js will be prefixed with /api
app.use('/api', surveyRoutes); 


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Access Survey Form directly at: http://localhost:${PORT}/fill-survey`);
    console.log(`Access Survey Results directly at: http://localhost:${PORT}/view-results`);
    console.log(`Root URL redirect: http://localhost:${PORT}/`); // This will now redirect
});