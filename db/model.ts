import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  admissionNumber: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  whatsappNumber: {
    type: String,
    required: true,
    match: /^(\+254|0|254)?(7|1)([0-9]{8})$/,
  },
  category: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);
