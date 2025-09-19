const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    ensureUploadDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only document and image files are allowed'));
  }
};

// Multer configuration
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
});

// Function to handle file upload
const uploadFile = (file, subfolder = '') => {
  return new Promise((resolve, reject) => {
    const uploadPath = path.join(__dirname, '../uploads', subfolder);
    ensureUploadDir(uploadPath);
    
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.name);
    const filePath = path.join(uploadPath, uniqueName);
    
    file.mv(filePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          filename: uniqueName,
          path: filePath,
          originalName: file.name
        });
      }
    });
  });
};

module.exports = { upload, uploadFile };