const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder
    cb(null, path.join(__dirname, '..', 'src', 'uploads'));
  },
  filename: function (req, file, cb) {
    // Generate a unique identifier using uuid
    const uniqueIdentifier = uuidv4();

    // Get the file extension
    const fileExtension = path.extname(file.originalname);

    // Set the file name with the unique identifier
    const fileName = `my-photo-${uniqueIdentifier}${fileExtension}`;

    cb(null, fileName);
  }
});

  
  const upload = multer({ storage, field: 'file'  });

  module.exports = upload