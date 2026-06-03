import fs from 'fs';
import path from 'path';
import libxml, { Document } from 'libxmljs2';

// O XSD vive em medical-backend/schema, um nível acima de src/ (e de dist/).
const SCHEMA_PATH = path.resolve(__dirname, '../../schema/medical-export.xsd');

let cachedSchema: Document | null = null;

function getSchema(): Document {
  if (!cachedSchema) {
    cachedSchema = libxml.parseXml(fs.readFileSync(SCHEMA_PATH, 'utf8'));
  }
  return cachedSchema;
}

export interface ValidationError {
  line?: number;
  message: string;
}

export interface ValidationResult {
  /** Documento já parseado, reutilizável para a importação se for válido. */
  doc: Document | null;
  /** Erros de XML malformado ou de não conformidade com o XSD. */
  errors: ValidationError[];
}

/** Faz parse do XML e valida-o contra o XSD da exportação. */
export function validateXml(xml: string): ValidationResult {
  let doc: Document;
  try {
    doc = libxml.parseXml(xml);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'XML malformado';
    return { doc: null, errors: [{ message }] };
  }

  const valid = doc.validate(getSchema());
  if (valid) {
    return { doc, errors: [] };
  }

  const errors: ValidationError[] = doc.validationErrors.map((e) => ({
    line: typeof e.line === 'number' ? e.line : undefined,
    message: (e.message || 'Erro de validação').trim()
  }));
  return { doc, errors };
}
