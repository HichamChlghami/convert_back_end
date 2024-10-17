// const express = require('express');
// const router = express.Router();
// const Users =  require('../../model/users')
// const bcrypt = require('bcrypt')

// // Hnadle post for users 
// router.post("/users", async (req, res) => {
//     try {
//       const user = req.body;
      
//       const salt = await bcrypt.genSalt(10);
//       const hashPass = await bcrypt.hash(user.password , salt)
  
  
  
//       const newUser = new Users({
//         fullname: user.fullname,
//         email: user.email,
//         password: hashPass,

//       });
//       await newUser.save();
//       res.status(201).json(newUser); // Sending back the newly created user
//     } catch (error) {
//       res.status(500).json({ message: 'Error creating user', error: error.message });
//     }
//   });
  



// module.exports = router;
const express = require('express');
const router = express.Router();
const Users = require('../../model/users');
const bcrypt = require('bcrypt');
const cron = require('node-cron');
// Check if email already exists
router.post('/users/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await Users.findOne({ email });
    
    if (existingUser) {
      return res.json({ exists: true });
    }
    return res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: 'Error checking email', error: error.message });
  }
});

// Handle post for users 
router.post("/users", async (req, res) => {
  try {
    const user = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(user.password, salt);

    const newUser = new Users({
      fullname: user.fullname,
      email: user.email,
      password: hashPass,
      payer:user.payer,
      subscriber:user.subscriber,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// login  
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await Users.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: 'Email not registered' });
  }

  // Compare the hashed password with the provided password
  const validated = await bcrypt.compare(password, user.password);
  if (!validated) {
    return res.status(400).json({ error: 'Incorrect password' });
  }

  // Respond with user details after successful login
  return res.status(200).json({ 
    message: 'User login successful', 
    user: { 
      email: user.email, 
      name: user.fullname, // Add any other details you need
      payer:user.payer,
      subscriber:user.subscriber
    }
  });
});




router.post('/users/update-payer', async (req, res) => {
  try {
      const { email } = req.body;
      
      // Find the user by email
      const user = await Users.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });

      }
      // Update payer status to true
      user.payer = true;
      await user.save();
      // Schedule a task to set payer back to false after 24 hours
      cron.schedule('* * * * *', async () => {
          // 24-hour delay
          const twentyFourHours = 24 * 60 * 60 * 1000;
          setTimeout(async () => {
              // Update payer status to false after 24 hours
              user.payer = false;
              await user.save();
          }, twentyFourHours);
      });

      res.json({ message: 'User payer status updated, will reset after 24 hours', user });
  } catch (error) {
      res.status(500).json({ message: 'Error updating payer status', error: error.message });
  }
});





router.post('/users/update-subscriber', async (req, res) => {
  try {
      const { email , subscriber } = req.body;
      
      // Find the user by email
      const user = await Users.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });

      }
      // Update payer status to true
      user.payer = true;
      user.subscriber = subscriber
      await user.save();
      // Schedule a task to set payer back to false after 24 hours
   
      res.json({ message: 'User payer status updated, will reset after 24 hours', user });
  } catch (error) {
      res.status(500).json({ message: 'Error updating payer status', error: error.message });
  }
});






router.post('/cancel-user-subscription', async (req, res) => {
  try {
      const { email  } = req.body;
      
      // Find the user by email
      const user = await Users.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });

      }
      // Update payer status to true
      user.payer = false;
      user.subscriber = 'false'
      await user.save();
      // Schedule a task to set payer back to false after 24 hours
   
      res.json({ message: 'User payer status updated, will reset after 24 hours', user });
  } catch (error) {
      res.status(500).json({ message: 'Error updating payer status', error: error.message });
  }
});




module.exports = router;
