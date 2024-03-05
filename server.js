const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const app = express();
const port = 5500;

// Supabase client initialization
const supabase = createClient('https://nithvyhwzszgnrwtavcj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdGh2eWh3enN6Z25yd3RhdmNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2NDY4NTksImV4cCI6MjAyNTIyMjg1OX0.GX27uLz6gul_lFrMcU_vA6U7VogvVT88P7JBZEM1gZ4');

// Middleware
app.use(bodyParser.json());

// Route handler for GET /api/users
app.get('/api/users', async (req, res) => {
    try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) {
            console.error('Error fetching users:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to handle user login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const passwordHash = crypto.createHash('md5').update(password).digest('hex');

    try {
        const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('userid', username)
            .eq('password_hash', passwordHash)
            .single();
        if (error) {
            console.error('Error executing query', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (data) {
            res.status(200).json({ success: true, message: 'Login successful', role: data.role });
        } else {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error executing query', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to handle fetching user details
app.get('/api/user', async (req, res) => {
    const { username } = req.query;

    try {
        const { data, error } = await supabase.from('users').select('*').eq('userid', username).single();
        if (error) {
            console.error('Error executing query', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error executing query', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static('public'));

// Start the server
app.listen(port, '127.0.0.1', () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});
