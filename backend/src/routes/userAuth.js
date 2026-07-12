const express = require('express');

const authRouter =  express.Router();
const {register, login,logout, adminRegister,deleteProfile, data, getAllUsers, updateUserRole} = require('../controllers/userAuthent')
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require('../middleware/adminMiddleware');

authRouter.get('/data/:id',userMiddleware, data);
// Register
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
// authRouter.js
authRouter.get('/admin/users', adminMiddleware, getAllUsers);
authRouter.patch('/admin/users/:userId/role', adminMiddleware, updateUserRole);
authRouter.post('/admin/register', adminMiddleware ,adminRegister);
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);



authRouter.get('/check',userMiddleware,(req,res)=>{

const reply = {
        firstName: req.result.firstName,
        emailId: req.result.emailId,
        _id:req.result._id,
        role:req.result.role,
    }

    res.status(200).json({
        user:reply,
        message:"Valid User"
    });
})



module.exports = authRouter;







