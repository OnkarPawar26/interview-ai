const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');



/**
 * @name registerUserController
 * @description Controller to handle user registration . Accepts username, email, and password from the request body and creates a new user in the database.
 * @route POST /api/auth/register
 * @access Public
 *  
 */
async function registerUserController(req, res) {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required" });
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    });

    if (isUserAlreadyExists) {
        return res.status(400).json({ message: "Account with this username or email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
        username,
        email,
        password: hash
    });

    const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token);

    res.status(201).json({
        message: "User registered successfully",
        newUser: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        }
    });
}


/**
 * @name loginUserController
 * @description Controller to handle user login. Expects email and password from the request body, verifies the credentials, and returns a JWT token if successful.
 * @route POST /api/auth/login  
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: user._id, username: user.username
    }, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.cookie('token',token)

    res.status(200).json({
        message : "User loggedIn Successfully",
        user : {
            id : user._id,
            username : user.username,
            email : user.email,
        }
    })
}


module.exports = { 
    registerUserController ,
    loginUserController
};