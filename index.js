import express, { Router } from 'express';
import users from './MOCK_DATA.json' assert { type: 'json' };
import fs from 'fs';
import { User } from './models/user.model.js';
import dbconnect from './mongodbConnect.js';

dbconnect()
    .then(() => {
        console.log("mongodb connected successfully");
    })
    .catch((err) => {
        console.log(err);
        throw err;
    });

const app = express();
const userRoute = Router();

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/users', userRoute);

userRoute.get('/', async (req, res) => {
    try {
        const alluser = await User.find({});
        const html = `
        <ul>
        ${alluser.map(user => `<li>${user.first_name}</li>`).join(' ')}
        </ul>
        `;
        res.send(html);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}).get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json({ user });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}).post('/', async (req, res) => {
    const { first_name, last_name, email, gender } = req.body;
    if (!first_name || !last_name || !email || !gender) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        await User.create({
            first_name,
            last_name,
            email,
            gender
        });
        res.status(201).json({
            message: "User created successfully"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}).put('/:id', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            gender: req.body.gender
        });
        res.status(202).json({
            message: "User updated successfully"
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}).delete("/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).json({
            message: "User deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
