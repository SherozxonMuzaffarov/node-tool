// addDefaultUser.js

const bcrypt = require('bcrypt');
const User = require('../models/users'); // Adjust the path based on your project structure

const addDefaultUser = async () => {
  try {
    // Check if there is already a default user
    const existingUser = await User.findOne({ role: 'Admin' });

    if (existingUser) {
      console.log('Default user already exists.');
      return;
    }

    // Hash the default password
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Create a new default user
    await User.create({
      name: 'Admin',
      phone_number: '2057117',
      password: hashedPassword,
      role: 'Admin',
      depo:"O'zvagonta'mir"
    });

    console.log('Default user added successfully.');
  } catch (error) {
    console.error('Error adding default user:', error);
  }
};

module.exports = addDefaultUser;
