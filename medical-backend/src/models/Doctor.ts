import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IDoctor {
  name: string;
  email: string;
  passwordHash: string;
}

export interface DoctorDocument extends IDoctor, Document {
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<DoctorDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'email inválido']
    },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

doctorSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const r = ret as unknown as Record<string, unknown>;
    r.id = r._id;
    delete r._id;
    delete r.passwordHash;
    return r;
  }
});

const Doctor: Model<DoctorDocument> = mongoose.model<DoctorDocument>('Doctor', doctorSchema);

export default Doctor;
