const redisClient = require("../config/redis");
const User =  require("../models/user")
const validate = require('../utils/validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Submission = require("../models/submission")

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",        
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",      
  maxAge: 60 * 60 * 1000,
  path: '/',
};


const register = async (req, res) => {
  try {
    const { firstName, emailId, password } = req.body;

    if (!firstName || !emailId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      emailId,
      password: hashedPassword,
      role: "user"
    });

    const token = jwt.sign(
      { _id: user._id, emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        emailId: user.emailId,
        role: user.role
      },
      message: "Registered successfully"
    });
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    }

    res.status(500).json({ message: err.message });
  }
};


const login = async (req,res)=>{

    try{
        const {emailId, password} = req.body;

        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");

        const user = await User.findOne({emailId});

        
        const match = await bcrypt.compare(password,user.password);

        if(!match)
            throw new Error("Invalid Credentials");

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role:user.role,
        }

        
        const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: process.env.JWT_ACCESS_EXPIRE});
        
        res.cookie('token', token, cookieOptions);
        res.status(201).json({
            user:reply,
            message:"Loggin Successfully"
        })
    }
    catch(err){
        res.status(401).send("Error: "+err);
    }
}



// logOut feature

const logout = async(req,res)=>{

    try{
        const {token} = req.cookies;
        const payload=jwt.verify(token,process.env.JWT_KEY)

        //Redis optional karana chaiye
        if(redisClient.isReady){
            await redisClient.set(`token:${token}`,'Blocked');
            await redisClient.expireAt(`token:${token}`,payload.exp);
          }else{
            console.log("Redis unavailable. Skipping blacklist.");
        }

        res.cookie("token",null,{expires: new Date(Date.now())});
        res.send("Logged Out Succesfully");

    }
    catch(err){
        res.status(503).send("Error: "+err);
    }
}



const adminRegister = async (req, res) => {
  try {
    validate(req.body);
    const { firstName, emailId, password } = req.body;

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const user = await User.create({
      firstName: firstName.trim(),
      emailId: emailId.toLowerCase().trim(),
      password: hashedPassword,
      role: "admin"   
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        emailId: user.emailId,
        role: user.role
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const getAllUsers = async (req, res) => {
  try {
   
    const users = await User.find({ role: 'user' })
      .select('-password')   
      .sort({ createdAt: -1 });

  
    res.status(200).json({
      success: true,
      users: users
    });
  } catch (err) {
    console.error('Error in getAllUsers:', err);
    res.status(500).json({ error: err.message });
  }
};


const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body; 

  
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    
    if (userId === req.result._id.toString() && role !== 'admin') {
      return res.status(403).json({ error: 'You cannot demote yourself' });
    }

   
    const user = await User.findByIdAndUpdate(
      userId,
      { role: role },
      { new: true, runValidators: true }
    ).select('-password');

  
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

  
    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user
    });
  } catch (err) {
    console.error('Error in updateUserRole:', err);
    res.status(500).json({ error: err.message });
  }
};



const deleteProfile = async(req,res)=>{
  
    try{
       const userId = req.result._id;
   
    await User.findByIdAndDelete(userId);

    
    res.status(200).send("Deleted Successfully");

    }
    catch(err){
      
        res.status(500).send("Internal Server Error");
    }
}


module.exports = {register, login,logout,adminRegister,deleteProfile, getAllUsers, updateUserRole};
