const { classifyMessage, safeEscalation } = require('./safety');

const faqResponses = [
  { terms: ['hour', 'open', 'close', 'timing'], response: 'JAGTAP MEDICAL is open Monday–Saturday from 8:00 AM to 9:30 PM, and Sunday from 9:00 AM to 2:00 PM.' },
  { terms: ['vet', 'animal', 'pet', 'dog', 'cat'], response: 'Yes. We support veterinary care with medicines, supplements, and essentials for companion and farm animals. Please contact our pharmacist to confirm availability.' },
  { terms: ['prescription', 'upload'], response: 'You can upload a clear prescription on the website. A licensed pharmacist must review it before any prescription medicine is dispensed.' },
  { terms: ['doctor', 'consult'], response: 'You can request a private doctor consultation from the Consult a Doctor page. A coordinator will confirm the available time slot.' },
  { terms: ['member', 'membership'], response: 'Jagtap Care Circle members receive selected savings, eligible local delivery, and refill reminders.' },
  { terms: ['category', 'allopathy', 'homeopathy', 'ayurveda', 'cosmetic'], response: 'JAGTAP MEDICAL offers Allopathy, Homeopathy, Veterinary, Ayurveda, and Cosmetics categories.' },
  { terms: ['phone', 'contact', 'whatsapp'], response: 'You can call or WhatsApp JAGTAP MEDICAL at +91 98765 43210. Please replace this placeholder number with the store’s real contact number before launch.' }
];

function localAssistant(message) {
  const normalized = message.toLowerCase();
  const match = faqResponses.find((item) => item.terms.some((term) => normalized.includes(term)));
  return match
    ? match.response
    : 'I can help with store hours, pharmacy categories, veterinary care, prescription guidance, membership, or finding a doctor consultation. For medicine-specific advice, please speak with a pharmacist or doctor.';
}

async function getAssistantResponse(message) {
  const classification = classifyMessage(message);
  const escalation = safeEscalation(classification);
  if (escalation) return { response: escalation, source: 'safety-rule' };

  // The website remains useful without an AI key. A live model is only used for safe, pharmacy-navigation questions.
  if (!process.env.OPENAI_API_KEY) return { response: localAssistant(message), source: 'local-faq' };

  try {
    const OpenAI = require('openai');
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      temperature: 0.2,
      max_tokens: 160,
      messages: [
        {
          role: 'system',
          content: 'You are the JAGTAP MEDICAL website assistant in India. Only help users navigate pharmacy information: store hours, categories, veterinary availability, prescriptions, memberships, contact details, and doctor-consultation booking. Never diagnose, recommend a drug, provide dosage, interpret symptoms, or give medicine-specific clinical advice. If asked for clinical advice, say a licensed pharmacist or doctor must help. Be concise, warm, and do not invent store facts.'
        },
        { role: 'user', content: message }
      ]
    });
    return { response: completion.choices[0]?.message?.content || localAssistant(message), source: 'openai' };
  } catch (error) {
    console.error('Optional OpenAI request failed:', error.message);
    return { response: localAssistant(message), source: 'local-faq-fallback' };
  }
}

module.exports = { getAssistantResponse };
