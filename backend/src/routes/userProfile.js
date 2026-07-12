const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
const userMiddleware = require('../middleware/userMiddleware');


// Get public profile by ID (Anyone can access)
userRouter.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id)
      .select('-password') // Exclude password
      .populate('problemSolved', 'title difficulty'); // Populate solved problems with basic info
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        age: user.age,
        role: user.role,
        problemSolved: user.problemSolved,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update own profile (Only logged in user can update their own)
userRouter.put('/profile/update', userMiddleware, async (req, res) => {
  try {
    const userId = req.result._id; // From middleware
    const { firstName, lastName, age } = req.body;

    // Validation
    if (firstName && (firstName.length < 3 || firstName.length > 20)) {
      return res.status(400).json({ message: "First name must be 3-20 characters" });
    }
    if (lastName && (lastName.length < 3 || lastName.length > 20)) {
      return res.status(400).json({ message: "Last name must be 3-20 characters" });
    }
    if (age && (age < 6 || age > 80)) {
      return res.status(400).json({ message: "Age must be between 6 and 80" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        firstName, 
        lastName, 
        age,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
    console.log("Profile update hit ..!")
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = userRouter;