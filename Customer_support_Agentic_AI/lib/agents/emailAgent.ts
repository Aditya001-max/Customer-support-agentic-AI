// lib/agents/emailAgent.ts — Agent 3: Email dispatch via Nodemailer + Gmail SMTP
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { config } from '../config';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.gmail.user(),
        pass: config.gmail.appPassword(),
      },
    });
  }
  return transporter;
}

function loadTemplate(templateName: string): string {
  const templatePath = path.join(process.cwd(), 'lib', 'emailTemplates', templateName);
  return fs.readFileSync(templatePath, 'utf-8');
}

function fillTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return result;
}

export interface CustomerEmailParams {
  customerName: string;
  customerEmail: string;
  originalQuestion: string;
  aiResponse: string;
  ticketId: string;
  category: string;
}

/**
 * Send the AI-generated response email to the customer
 */
export async function sendCustomerEmail(params: CustomerEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const template = loadTemplate('customerReply.html');
    const html = fillTemplate(template, {
      customerName: params.customerName,
      originalQuestion: params.originalQuestion,
      aiResponse: params.aiResponse.replace(/\n/g, '<br>'),
      ticketId: params.ticketId,
      category: params.category.charAt(0).toUpperCase() + params.category.slice(1),
      year: new Date().getFullYear().toString(),
    });

    const transport = getTransporter();

    await transport.sendMail({
      from: `"AI Support Agent" <${config.gmail.user()}>`,
      to: params.customerEmail,
      bcc: config.supportTeamEmail(),
      subject: `Re: ${params.category.charAt(0).toUpperCase() + params.category.slice(1)} Support — Ticket #${params.ticketId}`,
      html,
    });

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown email error';
    console.error('Email send failed:', message);
    return { success: false, error: message };
  }
}

export interface EscalationEmailParams {
  customerName: string;
  customerEmail: string;
  originalQuestion: string;
  aiResponse: string;
  ticketId: string;
  category: string;
  escalationReason: string;
  confidence: number;
}

/**
 * Send escalation alert email to the support team
 */
export async function sendEscalationEmail(params: EscalationEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const template = loadTemplate('escalationAlert.html');
    const html = fillTemplate(template, {
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      originalQuestion: params.originalQuestion,
      aiResponse: params.aiResponse.replace(/\n/g, '<br>'),
      ticketId: params.ticketId,
      category: params.category.charAt(0).toUpperCase() + params.category.slice(1),
      escalationReason: params.escalationReason,
      confidence: (params.confidence * 100).toFixed(0),
      timestamp: new Date().toISOString(),
      year: new Date().getFullYear().toString(),
    });

    const transport = getTransporter();

    await transport.sendMail({
      from: `"AI Support — ESCALATION" <${config.gmail.user()}>`,
      to: config.supportTeamEmail(),
      subject: `🚨 ESCALATION — Ticket #${params.ticketId} — ${params.escalationReason}`,
      html,
    });

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown email error';
    console.error('Escalation email failed:', message);
    return { success: false, error: message };
  }
}
