const Admission = require('../models/Admission');
const { sendEmail } = require('../utils/emailService');
const { uploadFile } = require('../utils/fileUpload');
const { sanitizeInput } = require('../config/security');

// Submit admission form
exports.submitAdmission = async (req, res) => {
  try {
    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(req.body.name),
      email: sanitizeInput(req.body.email),
      phone: sanitizeInput(req.body.phone),
      gender: sanitizeInput(req.body.gender),
      dob: req.body.dob,
      course: sanitizeInput(req.body.course)
    };

    // Handle file upload
    let marksheetData = null;
    if (req.files && req.files.marksheet) {
      marksheetData = await uploadFile(req.files.marksheet, 'marksheets');
    }

    // Create admission record
    const admission = new Admission({
      ...sanitizedData,
      marksheet: marksheetData
    });

    await admission.save();

    // Send confirmation email
    await sendEmail(
      sanitizedData.email,
      'Admission Application Received',
      `Dear ${sanitizedData.name}, Thank you for submitting your application to Ayan College of Nursing. We will review your application and contact you soon.`
    );

    // Notify admin
    await sendEmail(
      process.env.ADMIN_EMAIL,
      'New Admission Application',
      `A new admission application has been submitted by ${sanitizedData.name} for ${sanitizedData.course} course.`
    );

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: admission._id
    });
  } catch (error) {
    console.error('Admission submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting application'
    });
  }
};

// Get all admissions (admin only)
exports.getAdmissions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};
    
    const admissions = await Admission.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Admission.countDocuments(query);
    
    res.json({
      admissions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admissions' });
  }
};

// Update admission status (admin only)
exports.updateAdmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const admission = await Admission.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!admission) {
      return res.status(404).json({ message: 'Admission not found' });
    }
    
    // Send status update email
    await sendEmail(
      admission.email,
      'Application Status Update',
      `Dear ${admission.name}, Your application status has been updated to: ${status}.`
    );
    
    res.json({ message: 'Status updated successfully', admission });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status' });
  }
};