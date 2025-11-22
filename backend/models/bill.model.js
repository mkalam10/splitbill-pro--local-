
const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    avatarColor: { type: String, required: true },
}, { _id: false });

const ItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    participantIds: [{ type: String }],
}, { _id: false });

const ExtraSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, required: true },
    mode: { type: String, required: true },
    value: { type: Number, required: true },
    splitMode: { type: String, required: true },
}, { _id: false });

const BillSchema = new mongoose.Schema({
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
  participants: [ParticipantSchema],
  items: [ItemSchema],
  extras: [ExtraSchema],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
}, { 
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

module.exports = mongoose.model('Bill', BillSchema);
