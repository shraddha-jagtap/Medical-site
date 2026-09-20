require('dotenv').config();
const path = require('path');
const express = require('express');
const { getAssistantResponse } = require('./chatbot');
const { saveChat, saveConsultation } = require('./database');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, '..')));

app.get('/api/store', (req, res) => {
  res.json({
    name: 'JAGTAP MEDICAL',
    categories: ['Allopathy', 'Homeopathy', 'Veterinary', 'Ayurveda', 'Cosmetics'],
    hours: { mondayToSaturday: '8:00 AM – 9:30 PM', sunday: '9:00 AM – 2:00 PM' }
  });
});

app.post('/api/chat', async (req, res, next) => {
  try {
    const message = String(req.body.message || '').trim();
    const sessionId = String(req.body.sessionId || 'anonymous').slice(0, 80);
    if (!message || message.length > 600) return res.status(400).json({ error: 'Please send a question under 600 characters.' });
    const result = await getAssistantResponse(message);
    await saveChat({ sessionId, message, response: result.response });
    res.json(result);
  } catch (error) { next(error); }
});

app.post('/api/consultations', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const phone = String(req.body.phone || '').trim();
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone number are required.' });
    const request = await saveConsultation({
      name: name.slice(0, 100), phone: phone.slice(0, 30),
      preferredTime: String(req.body.preferredTime || '').slice(0, 100),
      concernSummary: String(req.body.concernSummary || '').slice(0, 500)
    });
    res.status(201).json({ message: 'Request received. A JAGTAP MEDICAL coordinator will contact you to confirm a slot.', request });
  } catch (error) { next(error); }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Something went wrong. Please contact JAGTAP MEDICAL directly.' });
});

app.listen(port, () => console.log(`JAGTAP MEDICAL is running at http://localhost:${port}`));
