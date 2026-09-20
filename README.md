## Technology Architecture

### Frontend

- HTML5 for page structure
- CSS3 for responsive design, animations, and Healing Teal visual theme
- Vanilla JavaScript for interactions, scroll animations, chatbot UI, prescription upload handling, and consultation requests
- Fully responsive design for mobile, tablet, and desktop users

### AI Chatbot

The website includes a JAGTAP MEDICAL AI Assistant interface to help users quickly find information about:

- Store opening and closing hours
- Human and veterinary medicine categories
- Prescription-upload guidance
- Doctor consultation options
- Membership benefits
- Delivery and contact information

For production, the chatbot can be powered by OpenAI’s API with a Retrieval-Augmented Generation (RAG) setup.

Suggested GenAI workflow:

```text
Customer question
      ↓
JAGTAP MEDICAL chatbot interface
      ↓
Backend API / secure server
      ↓
OpenAI model
      ↓
Knowledge base search
(store inventory, FAQs, timings, policies, medicine guidance)
      ↓
Helpful response with safety checks
