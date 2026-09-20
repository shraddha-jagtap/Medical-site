const $ = (selector) => document.querySelector(selector);
const chatbox = $('#chatbox');
const chatToggle = $('#chatToggle');
const chatSessionId = sessionStorage.getItem('jagtapChatSession') || crypto.randomUUID();
sessionStorage.setItem('jagtapChatSession', chatSessionId);

chatToggle?.addEventListener('click', () => chatbox.classList.toggle('open'));
$('#closeChat')?.addEventListener('click', () => chatbox.classList.remove('open'));

function addMessage(text, type = 'bot') {
  const element = document.createElement('div');
  element.className = `message ${type}`;
  element.textContent = text;
  $('#messages').insertBefore(element, $('.suggestions'));
  $('#messages').scrollTop = $('#messages').scrollHeight;
  return element;
}

async function askAssistant(question) {
  addMessage(question, 'user');
  const pending = addMessage('Jagtap Assistant is checking…');
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: question, sessionId: chatSessionId })
    });
    const payload = await response.json();
    pending.textContent = payload.response || payload.error || 'Please contact JAGTAP MEDICAL directly for help.';
  } catch {
    pending.textContent = 'The assistant is currently offline. Please call or WhatsApp JAGTAP MEDICAL at +91 98765 43210.';
  }
}

document.querySelectorAll('.suggestions button').forEach((button) => {
  button.addEventListener('click', () => askAssistant(button.textContent));
});

$('#chatForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = $('#chatInput');
  const question = input.value.trim();
  if (!question) return;
  input.value = '';
  askAssistant(question);
});

$('#uploadBtn')?.addEventListener('click', () => $('#fileInput').click());
$('#fileInput')?.addEventListener('change', (event) => {
  if (!event.target.files[0]) return;
  $('#uploadBtn').querySelector('b').textContent = `${event.target.files[0].name} selected`;
  $('#uploadBtn').querySelector('small').textContent = 'A pharmacist must review this before dispensing.';
});

$('#consultationForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = $('#consultationStatus');
  const button = form.querySelector('button');
  button.disabled = true;
  status.textContent = 'Sending your request…';
  try {
    const response = await fetch('/api/consultations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error);
    status.textContent = payload.message;
    form.reset();
  } catch (error) {
    status.textContent = error.message || 'Unable to send your request. Please call the pharmacy directly.';
  } finally { button.disabled = false; }
});

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
