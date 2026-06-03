/** Utilitários mínimos para gerar XML válido a partir de dados da aplicação. */

/** Escapa texto para uso seguro dentro de elementos e atributos XML. */
export function escapeXml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Formata uma data como xs:date (YYYY-MM-DD). */
export function toXsdDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Formata uma data como xs:dateTime (ISO 8601 completo). */
export function toXsdDateTime(date: Date): string {
  return date.toISOString();
}
