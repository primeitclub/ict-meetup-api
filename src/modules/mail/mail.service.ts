import nodemailer from "nodemailer";
import mjml2html from "mjml";
import fs from "fs";
import path from "path";
import { envConfig } from "../../shared/config/env";

export interface ClubInfo {
      versionName: string;
      logoUrl?: string | null;
      logoPath?: string | null;
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
      trackingId: string;
      club: ClubInfo;
}

interface RegistrationStatusOptions {
      to: string;
      username: string;
      eventTitle: string;
      trackingId: string;
      club: ClubInfo;
      rejectionReason?: string;
}


const SOCIAL_ICON_DIR = path.join(__dirname, "assets", "social-icons");
const PLATFORM_ICON_FILE: Record<string, string> = {
      facebook:  "facebook.png",
      instagram: "instagram.png",
      linkedin:  "linkedin.png",
      x:         "x.png",
      twitter:   "x.png",
      tiktok:    "tiktok.png",
      website:   "globe.png",
      portfolio: "globe.png",
      globe:     "globe.png",
};

function escapeHtml(str: string): string {
      return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

const LOGO_CID = "club-logo";


function resolveLogoAttachment(logoPath?: string | null): { filename: string; path: string; cid: string; contentDisposition: "inline" } | null {
      if (!logoPath) return null;
      const resolvedPath = path.isAbsolute(logoPath) ? logoPath : path.join(process.cwd(), logoPath);
      if (!fs.existsSync(resolvedPath)) return null;
      return { filename: path.basename(resolvedPath), path: resolvedPath, cid: LOGO_CID, contentDisposition: "inline" };
}

function buildLogoSection(club: ClubInfo): { html: string; attachment: { filename: string; path: string; cid: string; contentDisposition: "inline" } | null } {
      const attachment = resolveLogoAttachment(club.logoPath);
      const src = attachment ? `cid:${LOGO_CID}` : club.logoUrl;
      if (!src) return { html: "", attachment: null };
      const html = `<mj-text align="center" padding-bottom="0"><img src="${escapeHtml(src)}" alt="ICT Meetup Logo" style="max-height:48px;max-width:160px;object-fit:contain;display:block;margin:0 auto;" /></mj-text>`;
      return { html, attachment };
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

function buildSocialLinksBlock(
      links?: { platform: string; link: string }[] | null
): { html: string; attachments: { filename: string; path: string; cid: string; contentDisposition: "inline" }[] } {
      if (!links?.length) return { html: "", attachments: [] };

      const attachments: { filename: string; path: string; cid: string; contentDisposition: "inline" }[] = [];
      const seenCids = new Set<string>();
      const icons = links
            .map(({ platform, link }) => {
                  const key = platform.toLowerCase().trim().replace(/\s+/g, "");
                  const iconFile = PLATFORM_ICON_FILE[key];
                  if (!iconFile) return "";

                  const cid = `social-${key}`;
                  if (!seenCids.has(cid)) {
                        seenCids.add(cid);
                        attachments.push({ filename: iconFile, path: path.join(SOCIAL_ICON_DIR, iconFile), cid, contentDisposition: "inline" });
                  }

                  return `<a href="${escapeHtml(link)}" target="_blank" style="display:inline-block;width:30px;height:30px;margin:0 5px;text-decoration:none;"><img src="cid:${cid}" alt="${escapeHtml(platform)}" width="30" height="30" style="display:block;border-radius:50%;" /></a>`;
            })
            .join("");
      if (!icons) return { html: "", attachments: [] };
      return { html: `<mj-text align="center" padding="0 0 8px">${icons}</mj-text>`, attachments };
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

      sendRegistrationReceived({ to, username, eventTitle, trackingId, club }: RegistrationReceivedOptions): void {
            this.enqueue(async () => {
                  const logo = buildLogoSection(club);
                  const social = buildSocialLinksBlock(club.socialMediaLinks);
                  const html = await this.compileTemplate("registration-received", {
                        username,
                        eventTitle,
                        trackingId,
                        versionName: club.versionName,
                        logoSection: logo.html,
                        heroTitle: club.heroTitle ?? club.versionName,
                        heroDescriptionSection: buildHeroDescriptionSection(club.heroDescription),
                        clubContactBlock: buildClubContactBlock(club),
                        socialLinksBlock: social.html,
                  });
                  await this.transporter.sendMail({
                        from: `"ICT Meetup" <${envConfig.MAIL_FROM}>`,
                        to,
                        subject: `Registration Received — ${eventTitle}`,
                        html,
                        attachments: [...(logo.attachment ? [logo.attachment] : []), ...social.attachments],
                  });
            });
      }

      sendRegistrationApproved({ to, username, eventTitle, trackingId, club }: RegistrationStatusOptions): void {
            this.enqueue(async () => {
                  const logo = buildLogoSection(club);
                  const social = buildSocialLinksBlock(club.socialMediaLinks);
                  const html = await this.compileTemplate("registration-approved", {
                        username,
                        eventTitle,
                        trackingId,
                        versionName: club.versionName,
                        logoSection: logo.html,
                        heroTitle: club.heroTitle ?? club.versionName,
                        heroDescriptionSection: buildHeroDescriptionSection(club.heroDescription),
                        clubContactBlock: buildClubContactBlock(club),
                        socialLinksBlock: social.html,
                  });
                  await this.transporter.sendMail({
                        from: `"ICT Meetup" <${envConfig.MAIL_FROM}>`,
                        to,
                        subject: `Registration Confirmed — ${eventTitle}`,
                        html,
                        attachments: [...(logo.attachment ? [logo.attachment] : []), ...social.attachments],
                  });
            });
      }

      sendRegistrationRejected({ to, username, eventTitle, club, rejectionReason }: RegistrationStatusOptions): void {
            this.enqueue(async () => {
                  const rejectionReasonBlock = rejectionReason
                        ? `<mj-text padding="0"><div style="background:#fef2f2;border-left:3px solid #ef4444;padding:14px 18px;border-radius:3px;margin:8px 0 0;font-size:14px;color:#7f1d1d;"><strong>Reason:</strong> ${escapeHtml(rejectionReason)}</div></mj-text>`
                        : "";
                  const logo = buildLogoSection(club);
                  const social = buildSocialLinksBlock(club.socialMediaLinks);
                  const html = await this.compileTemplate("registration-rejected", {
                        username,
                        eventTitle,
                        rejectionReasonBlock,
                        versionName: club.versionName,
                        logoSection: logo.html,
                        heroTitle: club.heroTitle ?? club.versionName,
                        heroDescriptionSection: buildHeroDescriptionSection(club.heroDescription),
                        clubContactBlock: buildClubContactBlock(club),
                        socialLinksBlock: social.html,
                  });
                  await this.transporter.sendMail({
                        from: `"ICT Meetup" <${envConfig.MAIL_FROM}>`,
                        to,
                        subject: `Registration Update — ${eventTitle}`,
                        html,
                        attachments: [...(logo.attachment ? [logo.attachment] : []), ...social.attachments],
                  });
            });
      }
}

export const mailService = new MailService();
