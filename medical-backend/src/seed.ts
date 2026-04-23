import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDB } from './db';
import Patient from './models/Patient';
import Disease from './models/Disease';
import PatientDisease from './models/PatientDisease';
import Doctor from './models/Doctor';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medical_demo';

const DEMO_PASSWORD = 'demo1234';

const doctors = [
  { name: 'Dra. Ana Moreira', email: 'ana@hospital.pt'   },
  { name: 'Dr. Bruno Lopes',  email: 'bruno@hospital.pt' }
];

// doctorIdx 0 = Ana, 1 = Bruno
const patients = [
  { firstName: 'Ana',      lastName: 'Silva',     dateOfBirth: '1985-03-12', gender: 'F' as const, snsNumber: '100000011', doctorIdx: 0 },
  { firstName: 'Bruno',    lastName: 'Costa',     dateOfBirth: '1978-07-22', gender: 'M' as const, snsNumber: '100000012', doctorIdx: 0 },
  { firstName: 'Carla',    lastName: 'Martins',   dateOfBirth: '1990-11-05', gender: 'F' as const, snsNumber: '100000013', doctorIdx: 0 },
  { firstName: 'Diogo',    lastName: 'Ferreira',  dateOfBirth: '2001-01-30', gender: 'M' as const, snsNumber: '100000014', doctorIdx: 0 },
  { firstName: 'Eva',      lastName: 'Pereira',   dateOfBirth: '1995-09-18', gender: 'F' as const, snsNumber: '100000015', doctorIdx: 0 },
  { firstName: 'Fábio',    lastName: 'Rodrigues', dateOfBirth: '1969-06-02', gender: 'M' as const, snsNumber: '100000016', doctorIdx: 1 },
  { firstName: 'Gabriela', lastName: 'Santos',    dateOfBirth: '1982-04-14', gender: 'F' as const, snsNumber: '100000017', doctorIdx: 1 },
  { firstName: 'Hugo',     lastName: 'Almeida',   dateOfBirth: '1975-12-25', gender: 'M' as const, snsNumber: '100000018', doctorIdx: 1 },
  { firstName: 'Inês',     lastName: 'Carvalho',  dateOfBirth: '1998-08-08', gender: 'F' as const, snsNumber: '100000019', doctorIdx: 1 },
  { firstName: 'João',     lastName: 'Nunes',     dateOfBirth: '1988-02-17', gender: 'M' as const, snsNumber: '100000020', doctorIdx: 1 }
];

const diseases = [
  { name: 'Diabetes Mellitus tipo 2', description: 'Doença metabólica crónica caracterizada por hiperglicemia.' },
  { name: 'Hipertensão arterial',     description: 'Pressão arterial sistémica elevada de forma persistente.' },
  { name: 'Asma',                      description: 'Doença inflamatória crónica das vias aéreas.' },
  { name: 'Depressão',                 description: 'Transtorno do humor caracterizado por tristeza persistente.' },
  { name: 'Refluxo gastroesofágico',   description: 'Retorno do conteúdo gástrico para o esófago.' },
  { name: 'Artrite reumatoide',        description: 'Doença autoimune que afecta as articulações.' },
  { name: 'Enxaqueca',                 description: 'Cefaleia recorrente, frequentemente unilateral e pulsátil.' },
  { name: 'Hipotiroidismo',            description: 'Produção insuficiente de hormonas pela tiroide.' }
];

async function seed(): Promise<void> {
  await connectDB(MONGO_URI);

  await PatientDisease.deleteMany({});
  await Patient.deleteMany({});
  await Disease.deleteMany({});
  await Doctor.deleteMany({});

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const createdDoctors = await Doctor.insertMany(
    doctors.map((d) => ({ ...d, passwordHash }))
  );
  console.log(`Inseridos ${createdDoctors.length} médicos (password "${DEMO_PASSWORD}").`);

  const createdPatients = await Patient.insertMany(
    patients.map((p) => ({
      firstName: p.firstName,
      lastName: p.lastName,
      dateOfBirth: p.dateOfBirth,
      gender: p.gender,
      snsNumber: p.snsNumber,
      doctor: createdDoctors[p.doctorIdx]._id
    }))
  );
  const createdDiseases = await Disease.insertMany(diseases);
  console.log(`Inseridos ${createdPatients.length} pacientes e ${createdDiseases.length} doenças.`);

  const byDisease = Object.fromEntries(createdDiseases.map((d) => [d.name, d._id]));

  const links = [
    { patientIdx: 0, diseaseName: 'Hipertensão arterial',     status: 'chronic'  as const, dateOfDiagnosis: '2019-02-10' },
    { patientIdx: 0, diseaseName: 'Diabetes Mellitus tipo 2', status: 'chronic'  as const, dateOfDiagnosis: '2020-09-02' },
    { patientIdx: 1, diseaseName: 'Asma',                      status: 'active'   as const, dateOfDiagnosis: '2015-06-20' },
    { patientIdx: 2, diseaseName: 'Depressão',                 status: 'resolved' as const, dateOfDiagnosis: '2021-01-15' },
    { patientIdx: 2, diseaseName: 'Enxaqueca',                 status: 'active'   as const, dateOfDiagnosis: '2023-05-04' },
    { patientIdx: 3, diseaseName: 'Refluxo gastroesofágico',   status: 'active'   as const, dateOfDiagnosis: '2024-03-12' },
    { patientIdx: 4, diseaseName: 'Hipotiroidismo',            status: 'chronic'  as const, dateOfDiagnosis: '2018-11-28' },
    { patientIdx: 5, diseaseName: 'Hipertensão arterial',     status: 'chronic'  as const, dateOfDiagnosis: '2012-04-01' },
    { patientIdx: 5, diseaseName: 'Artrite reumatoide',        status: 'active'   as const, dateOfDiagnosis: '2022-08-19' },
    { patientIdx: 6, diseaseName: 'Enxaqueca',                 status: 'chronic'  as const, dateOfDiagnosis: '2017-03-05' },
    { patientIdx: 7, diseaseName: 'Diabetes Mellitus tipo 2', status: 'active'   as const, dateOfDiagnosis: '2023-11-11' },
    { patientIdx: 8, diseaseName: 'Asma',                      status: 'resolved' as const, dateOfDiagnosis: '2010-07-23' },
    { patientIdx: 9, diseaseName: 'Depressão',                 status: 'active'   as const, dateOfDiagnosis: '2024-01-30' }
  ];

  const docs = links.map((l) => ({
    patient: createdPatients[l.patientIdx]._id,
    disease: byDisease[l.diseaseName],
    dateOfDiagnosis: new Date(l.dateOfDiagnosis),
    status: l.status
  }));

  const createdLinks = await PatientDisease.insertMany(docs);
  console.log(`Inseridas ${createdLinks.length} relações paciente–doença.`);
  console.log(
    `Distribuição: Dra. Ana → ${patients.filter((p) => p.doctorIdx === 0).length} pacientes, ` +
      `Dr. Bruno → ${patients.filter((p) => p.doctorIdx === 1).length} pacientes.`
  );

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed falhou:', err);
  process.exit(1);
});
