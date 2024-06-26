// backend/routes/user.js
const express = require('express');

const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const  { authMiddleware } = require("../middleware");
const bcrypt = require("bcrypt");

const signupBody = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})


router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    console.log(success);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    
    res.json({
        message: "User created successfully"
        
    })
})


const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})



router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    console.log(success);

    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const { username, password } = req.body;
    console.log(username, password);
  
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      console.log(user);
      
      if (password!=user.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  
      res.json({
        message: "Signin successful",
        token: token,
        user: user._id
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  });

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})



module.exports = router;