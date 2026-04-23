import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type DiagnosisStatus = 'active' | 'resolved' | 'chronic';

export interface IPatientDisease {
  patient: Types.ObjectId;
  disease: Types.ObjectId;
  dateOfDiagnosis: Date;
  status: DiagnosisStatus;
}

export interface PatientDiseaseDocument extends IPatientDisease, Document {
  createdAt: Date;
  updatedAt: Date;
}

const patientDiseaseSchema = new Schema<PatientDiseaseDocument>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    disease: { type: Schema.Types.ObjectId, ref: 'Disease', required: true, index: true },
    dateOfDiagnosis: { type: Date, required: true, default: () => new Date() },
    status: {
      type: String,
      enum: ['active', 'resolved', 'chronic'],
      required: true,
      default: 'active'
    }
  },
  { timestamps: true }
);

patientDiseaseSchema.index({ patient: 1, disease: 1 }, { unique: true });

patientDiseaseSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const r = ret as unknown as Record<string, unknown>;
    r.id = r._id;
    delete r._id;
    return r;
  }
});

const PatientDisease: Model<PatientDiseaseDocument> = mongoose.model<PatientDiseaseDocument>(
  'PatientDisease',
  patientDiseaseSchema
);

export default PatientDisease;
