import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser'
import verifyUser from "./middleware/verifyUser.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

const client = new PrismaClient();




app.post("/users/acc", async (req, res) => {
  const { name, email, password } = req.body;
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
      message: "Account created successfully",
      status: "Success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating the account",
      status: "Error",
    });
  }
});

app.post("/users/login", async (req, res) => {
  try {
    // Read the email and password from the request body
    const { email, password } = req.body;

    // Find the user by email
    const user = await client.user.findFirst({
      where: {
        email,
      },
    });

    // //check if the user exists
    if (!user) {
      // // if not, return an error
      res.status(404).json({ message: "Wrong Email address or password" });
      return;
    }

    //  // if the user exists, compare the password with the hashed password in the database

    const isMatch = await bcrypt.compare(password, user.password);

    // // if the password does not match, return an error
    if (!isMatch) {
      res.status(401).json({ message: "Wrong Email address or password" });
      return;
    }
    // // if the password matches, create a JWT token and send it to the client
    const payload = {
      id: user.id,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
    res.status(200).cookie("token", token, {}).json({
      message: "Login successful",
      status: "Success",
      token: token,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging in",
      status: "Error",
    });
  }
});

app.post("/posts", verifyUser, async (req, res) => {
    
  
  try {   
         const { title, body } = req.body;   
         const post =await client.post.create({
            data: {
                title,
                body,
                userId: req.user.id,
            },
        });
    res.status(200).json({
      message: "Post created successfully",
      status: "Success",
      data: post,
    });

  }catch (error) {
    res.status(500).json({
      message: "Error creating the post",
      status: "Error",
    });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
