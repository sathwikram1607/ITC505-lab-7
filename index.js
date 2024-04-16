const express = require('express');
const path = require('path'); // Include the path module
const fs = require('fs'); // Include the fs module for file system operations
const app = express();

app.use(express.urlencoded({ extended: true }));

// Middleware to set no-cache for every response
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Serve index.html at the root path
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

// Serve modified index.html at the root path
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send("Error reading file.");
            return;
        }
        // Get file stats
        fs.stat(filePath, (err, stats) => {
            if (err) {
                res.status(500).send("Error getting file stats.");
                return;
            }
            // Replace placeholder in the HTML content
            const lastModified = stats.mtime.toISOString(); // or use .toLocaleString() for a more readable format
            const modifiedData = data.replace('<span id="lastModified"></span>', `<span id="lastModified">${lastModified}</span>`);
            res.send(modifiedData);
        });
    });
});

// Your existing route for /cs212/homework/8
app.get('/cs212/homework/8', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Your POST route for /cs212/homework/8
app.post('/cs212/homework/8', (req, res) => {
    const { adjective, pluralNoun, personName, verb, noun } = req.body;
    const madLib = `This night, I encountered a ${adjective} group of ${pluralNoun} that remind me of ${personName}. 
                    Consequently, I chose to ${verb} near the ${noun}.`;

    res.send(madLib);
});

module.exports = app;
