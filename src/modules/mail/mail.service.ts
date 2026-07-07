import nodemailer from "nodemailer";
import mjml2html from "mjml";
import fs from "fs";
import path from "path";
import { envConfig } from "../../shared/config/env";

export interface ClubInfo {
      versionName: string;
      logoUrl?: string | null;
      heroTitle?: string | null;
      heroDescription?: string | null;
      clubEmail?: string | null;
      clubPhoneNumber?: string | null;
      socialMediaLinks?: { platform: string; link: string }[] | null;
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

const PLATFORM_META: Record<string, { color: string; label: string }> = {
      linkedin:  { color: "#0A66C2", label: "in" },
      facebook:  { color: "#1877F2", label: "fb" },
      instagram: { color: "#E4405F", label: "ig" },
      twitter:   { color: "#1DA1F2", label: "tw" },
      x:         { color: "#000000", label: "X"  },
      youtube:   { color: "#FF0000", label: "yt" },
      tiktok:    { color: "#010101", label: "tt" },
      discord:   { color: "#5865F2", label: "dc" },
      telegram:  { color: "#2CA5E0", label: "tg" },
      whatsapp:  { color: "#25D366", label: "wa" },
      github:    { color: "#181717", label: "gh" },
};

function escapeHtml(str: string): string {
      return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

function buildLogoSection(logoUrl: string | null | undefined): string {
      if (!logoUrl) return "";
      return `<mj-text align="center" padding-bottom="0"><img src="${escapeHtml(logoUrl)}" alt="ICT Meetup Logo" style="max-height:48px;max-width:160px;object-fit:contain;display:block;margin:0 auto;" /></mj-text>`;
}

function buildHeroDescriptionSection(description: string | null | undefined): string {
      if (!description) return "";
      return `<mj-text align="center" color="#94a3b8" font-size="13px" padding-top="4px">${escapeHtml(description)}</mj-text>`;
}

function buildClubContactBlock(club: ClubInfo): string {
      const lines: string[] = [];
      if (club.clubEmail) {
            lines.push(`<a href="mailto:${escapeHtml(club.clubEmail)}" style="color:#3b82f6;text-decoration:none;">${escapeHtml(club.clubEmail)}</a>`);
      }
      if (club.clubPhoneNumber) {
            lines.push(`<span>${escapeHtml(club.clubPhoneNumber)}</span>`);
      }
      if (!lines.length) return "";
      return `<mj-text font-size="13px" color="#64748b" padding-top="2px">${lines.join(" &nbsp;&middot;&nbsp; ")}</mj-text>`;
}

function buildSocialLinksBlock(links?: { platform: string; link: string }[] | null): string {
      if (!links?.length) return "";
      const icons = links
            .map(({ platform, link }) => {
                  const key = platform.toLowerCase().trim().replace(/\s+/g, "");
                  const meta = PLATFORM_META[key] ?? { color: "#475569", label: platform.slice(0, 2).toLowerCase() };
                  return `<a href="${escapeHtml(link)}" target="_blank" style="display:inline-block;width:30px;height:30px;background:${meta.color};border-radius:50%;text-align:center;line-height:30px;color:#ffffff;font-size:11px;font-weight:bold;text-decoration:none;margin:0 5px;font-family:Arial,sans-serif;">${escapeHtml(meta.label)}</a>`;
            })
            .join("");
      return `<mj-text align="center" padding="0 0 8px">${icons}</mj-text>`;
}

class MailService {
      private transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                  user: envConfig.MAIL_USER,
                  pass: envConfig.MAIL_PASSWORD,
            },
      });

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
                        versionName: club.versionName,
                        logoSection: buildLogoSection(club.logoUrl),
                        heroTitle: club.heroTitle ?? club.versionName,
                        heroDescriptionSection: buildHeroDescriptionSection(club.heroDescription),
                        clubContactBlock: buildClubContactBlock(club),
                        socialLinksBlock: buildSocialLinksBlock(club.socialMediaLinks),
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
                        versionName: club.versionName,
                        logoSection: buildLogoSection(club.logoUrl),
                        heroTitle: club.heroTitle ?? club.versionName,
                        heroDescriptionSection: buildHeroDescriptionSection(club.heroDescription),
                        clubContactBlock: buildClubContactBlock(club),
                        socialLinksBlock: buildSocialLinksBlock(club.socialMediaLinks),
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
                        ? `<mj-text padding="0"><div style="background:#fef2f2;border-left:3px solid #ef4444;padding:14px 18px;border-radius:3px;margin:8px 0 0;font-size:14px;color:#7f1d1d;"><strong>Reason:</strong> ${escapeHtml(rejectionReason)}</div></mj-text>`
                        : "";
                  const html = await this.compileTemplate("registration-rejected", {
                        username,
                        eventTitle,
                        rejectionReasonBlock,
                        versionName: club.versionName,
                        logoSection: buildLogoSection(club.logoUrl),
                        heroTitle: club.heroTitle ?? club.versionName,
                        heroDescriptionSection: buildHeroDescriptionSection(club.heroDescription),
                        clubContactBlock: buildClubContactBlock(club),
                        socialLinksBlock: buildSocialLinksBlock(club.socialMediaLinks),
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
