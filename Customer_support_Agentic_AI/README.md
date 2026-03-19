# AI Customer Support Agent

An AI-powered customer support system built with **Next.js 14**, **Claude AI (claude-sonnet-4-6)**, **Nodemailer**, and **Tailwind CSS**.

## Features

- 🤖 **Chatbot Widget** — Floating bubble chat with real-time AI streaming
- 📝 **Contact Form** — Full support form with instant AI responses
- 📧 **Auto Email** — AI response delivered to customer inbox via Gmail SMTP
- 🚨 **Smart Escalation** — Low-confidence or urgent messages auto-flagged
- 🧠 **Multi-turn Memory** — Session context maintained for follow-up questions
- 📊 **Audit Logging** — All conversations logged to `support-logs.json`

## Architecture

| Agent | Role |
|-------|------|
| **Intake** | Validates fields, classifies category (billing/technical/refund/shipping/general) |
| **Response** | Claude-powered AI answer with confidence scoring |
| **Email** | Sends branded HTML email via Gmail SMTP + BCC to team |
| **Escalation** | Monitors confidence + keywords, sends priority alerts |
| **Memory** | Maintains last 6 messages per session (30min TTL) |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in your keys in .env.local

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key from [console.anthropic.com](https://console.anthropic.com) |
| `GMAIL_USER` | Gmail address for sending emails |
| `GMAIL_APP_PASSWORD` | Gmail App Password (enable 2FA first, then generate at Google Account → Security → App Passwords) |
| `SUPPORT_TEAM_EMAIL` | Team inbox for BCC copies and escalation alerts |

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
