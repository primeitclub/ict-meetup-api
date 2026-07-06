import nodemailer from "nodemailer";
import mjml2html from "mjml";
import fs from "fs";
import path from "path";
import { envConfig } from "../../shared/config/env";

export interface ClubInfo {
      teamName: string;
      versionName: string;
      logoUrl?: string | null;
      heroTitle?: string | null;
      heroDescription?: string | null;
      clubEmail?: string | null;
      clubPhoneNumber?: string | null;
}

interface RegistrationReceivedOptions {
      to: string;
      username: string;
      eventTitle: string;
      club: ClubInfo;
}

interface RegistrationStatusOptions {
      to: string;
      username: string;
      eventTitle: string;
      club: ClubInfo;
      rejectionReason?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildClubContactBlock(club: ClubInfo): string {
      const lines: string[] = [];
      if (club.clubEmail) {
            lines.push(`<a href="mailto:${escapeHtml(club.clubEmail)}" style="color:#4f6ef7;text-decoration:none;">${escapeHtml(club.clubEmail)}</a>`);
      }
      if (club.clubPhoneNumber) {
            lines.push(`<span>${escapeHtml(club.clubPhoneNumber)}</span>`);
      }
      if (!lines.length) return "";
      return `<mj-text font-size="13px" color="#555555" padding-top="4px">${lines.join(" &nbsp;·&nbsp; ")}</mj-text>`;
}

function buildLogoSection(logoUrl: string | null | undefined): string {
      if (!logoUrl) return "";
      return `<mj-text align="center" padding-bottom="0"><img src="${escapeHtml(logoUrl)}" alt="ICT Meetup Logo" style="max-height:48px;max-width:160px;object-fit:contain;display:block;margin:0 auto;" /></mj-text>`;
}

function buildHeroDescriptionSection(description: string | null | undefined): string {
      if (!description) return "";
      return `<mj-text align="center" color="#94a3b8" font-size="13px" padding-top="4px">${escapeHtml(description)}</mj-text>`;
}

class MailService {
      private transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                  user: envConfig.MAIL_USER,
                  pass: envConfig.MAIL_PASSWORD,
            },
      });

      // Simple in-memory queue — prevents SMTP flooding under load
      private queue: (() => Promise<void>)[] = [];
      private processing = false;

      private enqueue(job: () => Promise<void>): void {
            this.queue.push(job);
            if (!this.processing) this.processQueue();
      }

      private async processQueue(): Promise<void> {
            this.processing = true;
            while (this.queue.length > 0) {
                  const job = this.queue.shift()!;
                  try {
                        await job();
                  } catch (err) {
                        console.error("[MailQueue] Job failed:", (err as Error).message);
                  }
            }
            this.processing = false;
      }

      private getMjmlTemplate(templateName: string): string {
            const templatePath = path.join(__dirname, "templates", `${templateName}.mjml`);
            return fs.readFileSync(templatePath, "utf-8");
      }

      private async compileTemplate(templateName: string, variables: Record<string, string>): Promise<string> {
            let mjmlSource = this.getMjmlTemplate(templateName);
            for (const [key, value] of Object.entries(variables)) {
                  mjmlSource = mjmlSource.replaceAll(`{{${key}}}`, value);
            }
            const { html, errors } = await mjml2html(mjmlSource, { validationLevel: "soft" });
            if (errors.length) {
                  errors.forEach((e: any) => console.warn(`[MailService] MJML warning in ${templateName}:`, e.formattedMessage));
            }
            return html;
      }

      sendRegistrationReceived({ to, username, eventTitle, club }: RegistrationReceivedOptions): void {
            this.enqueue(async () => {
                  const html = await this.compileTemplate("registration-received", {
                        username,
                        eventTitle,
                        teamName: club.teamName,
                        versionName: club.versionName,
                        logoSection: buildLogoSection(club.logoUrl),
                        heroTitle: club.heroTitle ?? club.versionName,
                        heroDescriptionSection: buildHeroDescriptionSection(club.heroDescription),
                        clubContactBlock: buildClubContactBlock(club),
                        year: new Date().getFullYear().toString(),
                  });
                  await this.transporter.sendMail({
                        from: `"ICT Meetup" <${envConfig.MAIL_FROM}>`,
                        to,
                        subject: `Registration Received — ${eventTitle}`,
                        html,
                  });
            });
      }

      sendRegistrationApproved({ to, username, eventTitle, club }: RegistrationStatusOptions): void {
            this.enqueue(async () => {
                  const html = await this.compileTemplate("registration-approved", {
                        username,
                        eventTitle,
                        teamName: club.teamName,
                        versionName: club.versionName,
                        logoSection: buildLogoSection(club.logoUrl),
                        heroTitle: club.heroTitle ?? club.versionName,
                        heroDescriptionSection: buildHeroDescriptionSection(club.heroDescription),
                        clubContactBlock: buildClubContactBlock(club),
                        year: new Date().getFullYear().toString(),
                  });
                  await this.transporter.sendMail({
                        from: `"ICT Meetup" <${envConfig.MAIL_FROM}>`,
                        to,
                        subject: `Registration Confirmed — ${eventTitle}`,
                        html,
                  });
            });
      }

      sendRegistrationRejected({ to, username, eventTitle, club, rejectionReason }: RegistrationStatusOptions): void {
            this.enqueue(async () => {
                  const rejectionReasonBlock = rejectionReason
                        ? `<strong>Reason:</strong> ${escapeHtml(rejectionReason)}<br/>`
                        : "";
                  const html = await this.compileTemplate("registration-rejected", {
                        username,
                        eventTitle,
                        rejectionReasonBlock,
                        teamName: club.teamName,
                        versionName: club.versionName,
                        logoSection: buildLogoSection(club.logoUrl),
                        heroTitle: club.heroTitle ?? club.versionName,
                        heroDescriptionSection: buildHeroDescriptionSection(club.heroDescription),
                        clubContactBlock: buildClubContactBlock(club),
                        year: new Date().getFullYear().toString(),
                  });
                  await this.transporter.sendMail({
                        from: `"ICT Meetup" <${envConfig.MAIL_FROM}>`,
                        to,
                        subject: `Registration Update — ${eventTitle}`,
                        html,
                  });
            });
      }
}

export const mailService = new MailService();
