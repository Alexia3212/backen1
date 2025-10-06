import express from 'express';
import {ConnectDB} from './connectdb.js';
import User from './model/user.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ optional: true });

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: '*', // Your frontend URL
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

ConnectDB();

app.post('/login', async(req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        
        if (!phoneNumber || !password) {
            return res.status(400).json({ 
                message: 'Phone number and password are required',
                received: { phoneNumber, password }
            });
        }

        if (password.trim().length === 0) {
            return res.status(400).json({ 
                message: 'Password cannot be empty' 
            });
        }

        if (password.length < 6 || password.length > 20) {
            return res.status(400).json({ 
                message: 'Password must be 6-20 characters long' 
            });
        }

        await User.create({ phoneNumber, password });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Login error details:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
});

app.get('/health', (req, res) => {
  res.send('Server is healthy');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
