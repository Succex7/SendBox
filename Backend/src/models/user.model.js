import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const generateUniqueId = async () => {
  const words = ['SWIFT', 'BOLT', 'NOVA', 'FLUX', 'ECHO', 'APEX', 
                 'ZION', 'VIBE', 'TREK', 'CORE', 'BLAZE', 'DRIFT', 'STORM', 'FROST', 'GLOW', 'PULSE', 'FLARE', 'CREST', 'DASH', 'WAVE', 'SPARK', 'RIDGE', 'SURGE', 'PHANTOM', 'TITAN', 'LUNAR', 'SOLAR', 'NEON', 'PIXEL', 'SIGMA', 'OMEGA', 'QUANTUM', 'RAPTOR', 'SPECTRUM', 'VORTEX', 'ZENITH'];
  
  let id, exists;
  do {
    const word = words[Math.floor(Math.random() * words.length)];
    const number = Math.floor(1000 + Math.random() * 9000);
    id = `${word}-${number}`;
    exists = await mongoose.model('User').findOne({ uniqueId: id });
  } while (exists);
  
  return id;
};

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    // Unique identifier users share with each other to connect
    uniqueId: { type: String, unique: true, default: generateUniqueId },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);