const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const path = require('path'); // Include the path module

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let db;

MongoClient.connect('mongodb+srv://automatic:profile@cluster0.locdubq.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err);
    console.log('Connected to MongoDB');
    db = client.db('userProfileDB');
});

// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' });

// New route for handling profile picture uploads
app.post('/upload', upload.single('profilePicture'), (req, res) => {
    // Handle the uploaded profile picture
    const file = req.file;
    if (file) {
        console.log('Profile picture uploaded:', file);
        // You can save the file path or perform additional processing here
        res.json({ success: true, filePath: file.path });
    } else {
        console.error('No file uploaded');
        res.status(400).json({ success: false, message: 'No file uploaded' });
    }
});

// New route for fetching additional profile details
app.get('/profile/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Simulate fetching user profile details from the database
        const user = await db.collection('users').findOne({ _id: new ObjectID(userId) });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve the HTML file on the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Use path.join for correct file path
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
