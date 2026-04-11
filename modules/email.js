import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const name = 'email';
export const description = 'Send and read email via ProtonMail Bridge (IMAP/SMTP)';
export const version = '1.0.0';

const configDir = path.resolve(__dirname, '../../data/email');

function loadEmailConfig() {
  const file = path.join(configDir, 'config.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export const tools = [
  {
    name: 'email_send',
    description: 'Send an email via ProtonMail Bridge SMTP',
    parameters: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'Recipient email' },
        subject: { type: 'string' },
        body: { type: 'string' },
        cc: { type: 'string' },
        bcc: { type: 'string' }
      },
      required: ['to', 'subject', 'body']
    },
    execute: async (params, ctx) => {
      const cfg = loadEmailConfig();
      if (!cfg) return { error: 'Email not configured. Run email_setup first.' };

      // Use Node built-in to send via SMTP
      // ProtonMail Bridge exposes localhost SMTP
      const net = await import('net');
      const tls = await import('tls');

      return await sendSmtp(cfg, params);
    }
  },
  {
    name: 'email_check',
    description: 'Check inbox for recent emails via ProtonMail Bridge IMAP',
    parameters: {
      type: 'object',
      properties: {
        limit: { type: 'number', default: 10 },
        folder: { type: 'string', default: 'INBOX' }
      }
    },
    execute: async (params) => {
      const cfg = loadEmailConfig();
      if (!cfg) return { error: 'Email not configured. Run email_setup first.' };
      // Stub: full IMAP implementation needs a library or raw socket work
      return { stub: true, message: 'IMAP check requires nodemailer or imapflow. Install with: npm install imapflow' };
    }
  },
  {
    name: 'email_setup',
    description: 'Configure ProtonMail Bridge connection',
    parameters: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'Your ProtonMail address' },
        bridgePassword: { type: 'string', description: 'ProtonMail Bridge password (not your main password)' },
        smtpHost: { type: 'string', default: '127.0.0.1' },
        smtpPort: { type: 'number', default: 1025 },
        imapHost: { type: 'string', default: '127.0.0.1' },
        imapPort: { type: 'number', default: 1143 }
      },
      required: ['email', 'bridgePassword']
    },
    execute: async (params) => {
      fs.mkdirSync(configDir, { recursive: true });
      const config = {
        email: params.email,
        bridgePassword: params.bridgePassword,
        smtp: {
          host: params.smtpHost || '127.0.0.1',
          port: params.smtpPort || 1025,
          secure: false,
          auth: {
            user: params.email,
            pass: params.bridgePassword
          }
        },
        imap: {
          host: params.imapHost || '127.0.0.1',
          port: params.imapPort || 1143,
          secure: false,
          auth: {
            user: params.email,
            pass: params.bridgePassword
          }
        }
      };
      fs.writeFileSync(
        path.join(configDir, 'config.json'),
        JSON.stringify(config, null, 2)
      );
      return { configured: true, email: params.email };
    }
  }
];

async function sendSmtp(cfg, params) {
  // Minimal raw SMTP sender for ProtonMail Bridge
  const net = await import('net');

  return new Promise((resolve) => {
    const socket = net.connect(cfg.smtp.port, cfg.smtp.host, () => {
      let step = 0;
      const lines = [
        `EHLO gidion`,
        `AUTH LOGIN`,
        Buffer.from(cfg.smtp.auth.user).toString('base64'),
        Buffer.from(cfg.smtp.auth.pass).toString('base64'),
        `MAIL FROM:<${cfg.email}>`,
        `RCPT TO:<${params.to}>`,
        `DATA`,
        [
          `From: ${cfg.email}`,
          `To: ${params.to}`,
          params.cc ? `Cc: ${params.cc}` : '',
          `Subject: ${params.subject}`,
          `Content-Type: text/plain; charset=utf-8`,
          ``,
          params.body,
          `.`
        ].filter(Boolean).join('\r\n'),
        `QUIT`
      ];

      socket.on('data', (data) => {
        const response = data.toString();
        if (step < lines.length) {
          socket.write(lines[step] + '\r\n');
          step++;
        }
      });

      socket.on('end', () => resolve({ sent: true, to: params.to }));
      socket.on('error', (err) => resolve({ error: err.message }));

      setTimeout(() => {
        socket.destroy();
        resolve({ error: 'SMTP timeout' });
      }, 15000);
    });
  });
}

export async function init(ctx) {
  fs.mkdirSync(configDir, { recursive: true });
  ctx.log('email module loaded (ProtonMail Bridge)');
}
