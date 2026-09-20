const urgentTerms = [
  'chest pain', 'difficulty breathing', 'trouble breathing', 'unconscious',
  'severe bleeding', 'suicide', 'overdose', 'poisoning', 'seizure', 'stroke'
];

const medicineAdviceTerms = [
  'dosage', 'dose', 'prescribe', 'prescription', 'side effect', 'interaction',
  'antibiotic', 'tablet', 'capsule', 'injection', 'can i take', 'should i take'
];

function classifyMessage(message) {
  const normalized = message.toLowerCase();
  if (urgentTerms.some((term) => normalized.includes(term))) return 'urgent';
  if (medicineAdviceTerms.some((term) => normalized.includes(term))) return 'medicine-advice';
  return 'general';
}

function safeEscalation(kind) {
  if (kind === 'urgent') {
    return 'This may need urgent medical attention. Please call your local emergency service or visit the nearest emergency department now. JAGTAP MEDICAL’s assistant cannot assess emergencies.';
  }
  if (kind === 'medicine-advice') {
    return 'For medicine-specific advice, doses, interactions, or side effects, please speak with a licensed pharmacist or doctor. I can help with store information, categories, prescriptions, and consultation navigation.';
  }
  return null;
}

module.exports = { classifyMessage, safeEscalation };
