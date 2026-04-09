# AI Customer Support Agent

A customer support chatbot that replies to users and sends them an email with the answer. Built with Next.js and Claude API.

---



## What it does

- Chat widget on your site that answers support questions
- Contact form that emails the customer an AI-generated reply
- Flags urgent messages and notifies your team
- Keeps conversation history so follow-up questions make sense

---

## Stack

- Next.js 14
- Anthropic Claude API
- Nodemailer (Gmail)
- TypeScript + Tailwind

---

## Setup

**1. Clone and install**
```bash
git clone https://github.com/Aditya001-max/Customer-support-agentic-AI
cd ai-support-agent
npm install
```

**2. Create a `.env.local` file**
```env
ANTHROPIC_API_KEY=sk-ant-...
GMAIL_USER=you@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
SUPPORT_TEAM_EMAIL=team@yourcompany.com
NEXT_PUBLIC_COMPANY_NAME=Your Company
```

> For Gmail App Password: Google Account → Security → 2-Step Verification → App Passwords

**3. Run it**
```bash
npm run dev
```

Go to `http://localhost:3000`

---

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Streaming chat (SSE) — chatbot widget |
| `/api/contact` | POST | Contact form submission — validates, responds, emails |
| `/api/escalate` | POST | Manual escalation trigger by ticket ID |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: Anthropic Claude (claude-sonnet-4-6)
- **Email**: Nodemailer + Gmail SMTP
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## How to test

1. Open the chat widget (bottom right) and send a message
2. Go to `/contact`, fill the form with a real email, and submit
3. Check your inbox — the AI reply should arrive in under 30 seconds
4. Try typing "I need a refund urgently" to trigger an escalation alert

---

## Project structure

```
app/
  api/chat          → streaming chat endpoint
  api/contact       → contact form + email pipeline
  contact/          → contact page
lib/
  agents/           → intake, response, email, escalation, memory
  emailTemplates/   → HTML email templates
components/
  ChatWidget        → floating chat bubble
  ContactForm       → support form
support-logs.json   → ticket log (auto-created)
```

---
