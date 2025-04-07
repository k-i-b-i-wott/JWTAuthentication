import express from 'express';
import {PrismaClient} from "@prisma/client"
import bcrypt from 'bcrypt';

const client = new PrismaClient();
const app = express();
app.use(express.json());

app.post('/users/acc', async (req, res) => {
    const { name,email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    try {
         const user = await client.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        res.status(200).json({ 
            message: 'Account created successfully',
            status:"Success",
            data: user,
     });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating the account',
            status:"Error"
            
     });        
    }
});

app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;
    try {

    }catch (error) {
        
    }
});
















const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}    
);