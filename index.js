import express, { Router } from 'express';
import users from './MOCK_DATA.json' assert { type: 'json' };
import fs from 'fs';

const app = express();
const userRoute = Router();

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/users', userRoute);

userRoute.get('/', (req, res) => {
    const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join('')}
    </ul>
    `;
    res.send(html);
});

userRoute.get('/:id', (req, res) => {
    const user = users.find((user) => user.id === Number(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

userRoute.post('/register', (req, res) => {
    const { first_name, last_name, email, gender } = req.body;
    if (!first_name || !last_name || !email || !gender) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newUser = {
        id: users.length + 1,
        first_name,
        last_name,
        email,
        gender
    };
    users.push(newUser);

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save user data' });
        }
        res.status(201).json({ ...newUser, success: 'Your account was created successfully' });
    });
});

userRoute.put('/update/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = {
        id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        gender: req.body.gender
    };

    users[index] = updatedUser;

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update user data' });
        }
        res.status(202).json({ ...updatedUser, message: 'User updated successfully' });
    });
});
userRoute.delete("/delete/:id",(req,res)=>{
    let id=req.params.id;
    let index=users.findIndex((user)=>Number(user.id)===Number(id));
    users.splice(index,1);
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err)=>{
        if(err){
            return res.status(500).json({error:"failed to delete user data"})
        }
        res.json({message:"user delted successfully"})
    })
})
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
