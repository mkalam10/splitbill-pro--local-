// This file is for illustrative purposes to show how the MongoDB schemas would look using Mongoose.
// This is not functional code in the frontend application. A backend server is required to interact with MongoDB.

export const userSchemaString = `
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String, // In a real application, this would be a hashed password
    required: true,
  },
}, { timestamps: true });

// In a real backend, you would export the model like this:
// export default mongoose.model('User', userSchema);
`;

export const billSchemaString = `
import mongoose, { Schema } from 'mongoose';

const participantSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    avatarColor: { type: String, required: true },
}, { _id: false });

const itemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    participantIds: [{ type: String }],
}, { _id: false });

const extraSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, required: true },
    mode: { type: String, required: true },
    value: { type: Number, required: true },
    splitMode: { type: String, required: true },
}, { _id: false });

const billSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  hostId: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'IDR'
  },
  participants: [participantSchema],
  items: [itemSchema],
  extras: [extraSchema],
  user: { // Link to the user who owns this bill
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// In a real backend, you would export the model like this:
// export default mongoose.model('Bill', billSchema);
`;
