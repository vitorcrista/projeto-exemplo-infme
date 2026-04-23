import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IDisease {
  name: string;
  description?: string;
}

export interface DiseaseDocument extends IDisease, Document {
  createdAt: Date;
  updatedAt: Date;
}

const diseaseSchema = new Schema<DiseaseDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true }
  },
  { timestamps: true }
);

diseaseSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const r = ret as unknown as Record<string, unknown>;
    r.id = r._id;
    delete r._id;
    return r;
  }
});

const Disease: Model<DiseaseDocument> = mongoose.model<DiseaseDocument>('Disease', diseaseSchema);

export default Disease;
