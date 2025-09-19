const Contact = require('../models/Contact');
const { sendEmail } = require('../utils/emailService');
const { sanitizeInput } = require('../config/security');

exports.submitContact = async (req, res) => {
  try {
    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(req.body.name),
      email: sanitizeInput(req.body.email),
      phone: sanitizeInput(req.body.phone),
      message: sanitizeInput(req.body.message)
    };

    const contact = new Contact(sanitizedData);
    await contact.save();

    // Send confirmation email to user
    await sendEmail(
      sanitizedData.email,
      'Thank You for Contacting Us',
      `Dear ${sanitizedData.name}, Thank you for reaching out to Ayan College of Nursing. We have received your message and will get back to you within 24-48 hours.`
    );

    // Notify admin
    await sendEmail(
      process.env.ADMIN_EMAIL,
      'New Contact Form Submission',
      `Name: ${sanitizedData.name}\nEmail: ${sanitizedData.email}\nPhone: ${sanitizedData.phone}\nMessage: ${sanitizedData.message}`
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message'
    });
  }
};

// Get all contacts (admin only)
exports.getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, unread } = req.query;
    const query = unread === 'true' ? { isRead: false } : {};
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Contact.countDocuments(query);
    
    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts' });
  }
};

// Mark contact as read (admin only)
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json({ message: 'Marked as read', contact });
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact' });
  }
};