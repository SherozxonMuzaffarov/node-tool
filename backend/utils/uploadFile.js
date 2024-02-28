const multer = require('multer');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder
    cb(null, path.join(__dirname, 'src', 'upload'));
  },
  filename: function (req, file, cb) {
    // Set the file name
    cb(null, 'my-photo.jpeg');
  }
});
  
  const upload = multer({ storage, field: 'file'  });

  module.exports = upload