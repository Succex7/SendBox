import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Synchronous ID generator — async not supported in Mongoose default
const generateUniqueId = () => {
  const words = [
    'SWIFT', 'BOLT', 'NOVA', 'FLUX', 'ECHO', 'APEX',
    'ZION', 'VIBE', 'TREK', 'CORE', 'BLAZE', 'DRIFT',
    'STORM', 'FROST', 'GLOW', 'PULSE', 'FLARE', 'CREST',
    'DASH', 'WAVE', 'SPARK', 'RIDGE', 'SURGE', 'PHANTOM',
    'TITAN', 'LUNAR', 'SOLAR', 'NEON', 'PIXEL', 'SIGMA',
    'OMEGA', 'QUANTUM', 'RAPTOR', 'SPECTRUM', 'VORTEX', 'ZENITH'
  ];
  const word = words[Math.floor(Math.random() * words.length)];
  const number = Math.floor(1000 + Math.random() * 9000);
  return `${word}-${number}`;
};

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    // Unique identifier users share with each other to connect
    uniqueId: { type: String, unique: true },

    // Password Reset via OTP
    resetOtp: { type: String, default: null },         // Stores HASHED OTP, never plain text
    resetOtpExpiry: { type: Date, default: null },     // Expires 10 mins after generation
    resetOtpAttempts: { type: Number, default: 0 },   // Brute force counter — max 5
  },
  { timestamps: true }
);

// Pre-save: Generate uniqueId for new users 
userSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  let id, exists;
  do {
    id = generateUniqueId();
    exists = await mongoose.model('User').findOne({ uniqueId: id });
  } while (exists);

  this.uniqueId = id;
});

// Pre-save: Hash password when modified 
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

});

//  Instance method: Compare passwords 
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);