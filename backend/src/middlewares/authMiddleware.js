const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  // التحقق من وجود Token فـ الـ Headers (Authorization: Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. استخراج الـ Token من الهيدر
      token = req.headers.authorization.split(' ')[1];

      // 2. فك التشفير والتحقق من صحة الـ Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

      // 3. البحث عن المستخدم وإرفاقه فـ req.user (بلا كلمة السر)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // المرور للوظيفة الموالية
    } catch (error) {
      return res.status(401).json({ message: 'غير مصرح لك، الـ Token غير صحيح' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'غير مصرح لك، لا يوجد Token' });
  }
};

module.exports = { protect };