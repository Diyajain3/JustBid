import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/db.js';
import sendEmail from '../utils/sendEmail.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'user',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    res.status(201).json({
      ...user,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        company: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error picking user data' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(200).json({ message: 'If that email is in our system, a reset link has been generated.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.user.update({
      where: { email },
      data: { resetPasswordToken, resetPasswordExpires }
    });

    const resetUrl = `${req.headers.origin || 'http://localhost:5173'}/auth/reset/${resetToken}`;

    const message = `You are receiving this email because a password reset was requested for your account.\n\nPlease make a PUT request to:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'JustBid - Password Reset Token',
        text: message
      });
      
      console.log(`\n\n[EMAIL DISPATCHED] Password Reset Link for ${email}:\n--> ${resetUrl}\n\n`);

      res.status(200).json({ 
        message: 'If that email is in our system, a reset link has been generated.',
        resetUrl // Exposing for dev local testing
      });
    } catch (err) {
      console.error('Error sending email:', err);
      
      await prisma.user.update({
        where: { email },
        data: { 
          resetPasswordToken: null, 
          resetPasswordExpires: null 
        }
      });
      
      return res.status(500).json({ message: 'Error sending email. Please try again later.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating reset token' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken,
        resetPasswordExpires: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    res.json({ message: 'Password has been successfully reset! You may now login.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error resetting password' });
  }
};
