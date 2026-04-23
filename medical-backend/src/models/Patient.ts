import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type Gender = 'M' | 'F' | 'O';

export interface IPatient {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  snsNumber: string;
  doctor: Types.ObjectId;
}

export interface PatientDocument extends IPatient, Document {
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<PatientDocument>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['M', 'F', 'O'], default: 'O' },
    snsNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\d{9}$/, 'snsNumber deve ter 9 dígitos']
    },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true }
  },
  { timestamps: true }
);

patientSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const r = ret as unknown as Record<string, unknown>;
    r.id = r._id;
    delete r._id;
    return r;
  }
});

const Patient: Model<PatientDocument> = mongoose.model<PatientDocument>('Patient', patientSchema);

export default Patient;
