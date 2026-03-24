import { Resend } from 'resend'
import { prisma } from './prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

async function getEmailConfig() {
  const configs = await prisma.configuration.findMany({
    where: { key: { in: ['email_from_name', 'email_from_address', 'app_name', 'service_name', 'hospital_name'] } },
  })
  const map: Record<string, string> = {}
  for (const c of configs) map[c.key] = c.value
  return {
    fromEmail: `${map.email_from_name || 'PlanningAPHP'} <${map.email_from_address || 'noreply@ghtyvelinesnord.fr'}>`,
    appName: map.app_name || 'PlanningAPHP',
    serviceName: map.service_name || 'Réanimation Néonatale',
    hospitalName: map.hospital_name || 'CHIPS — Hôpital de Poissy',
  }
}

type EmailTemplate = {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailTemplate) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_xxxxxxxxxxxxxxxxxxxxxxxxxxxx') {
    console.log(`[Email] Simulated send to ${to}: ${subject}`)
    return { success: true, simulated: true }
  }

  const cfg = await getEmailConfig()

  try {
    const result = await resend.emails.send({
      from: cfg.fromEmail,
      to,
      subject,
      html,
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

export async function newAssignmentEmail(agentName: string, shiftName: string, date: string) {
  const cfg = await getEmailConfig()
  return {
    subject: `Nouvelle affectation — ${shiftName} le ${date}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #2563EB; color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 20px;">${cfg.appName}</h1>
          <p style="margin: 5px 0 0; opacity: 0.8; font-size: 14px;">${cfg.serviceName} — ${cfg.hospitalName}</p>
        </div>
        <div style="background: white; padding: 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #374151; font-size: 16px;">Bonjour ${agentName},</p>
          <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
            Vous avez été affecté(e) au <strong>shift ${shiftName}</strong> le <strong>${date}</strong>.
          </p>
          <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
            Connectez-vous à ${cfg.appName} pour consulter votre planning complet.
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${process.env.NEXTAUTH_URL}/planning" style="background: #2563EB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">Voir mon planning</a>
          </div>
        </div>
      </div>`,
  }
}

export async function leaveReviewEmail(agentName: string, status: string, startDate: string, endDate: string) {
  const cfg = await getEmailConfig()
  const isApproved = status === 'APPROUVE'
  return {
    subject: `Congé ${isApproved ? 'approuvé' : 'refusé'} — du ${startDate} au ${endDate}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: ${isApproved ? '#10B981' : '#EF4444'}; color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 20px;">${cfg.appName}</h1>
        </div>
        <div style="background: white; padding: 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #374151; font-size: 16px;">Bonjour ${agentName},</p>
          <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
            Votre demande de congé du <strong>${startDate}</strong> au <strong>${endDate}</strong>
            a été <strong style="color: ${isApproved ? '#10B981' : '#EF4444'};">${isApproved ? 'approuvée' : 'refusée'}</strong>.
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${process.env.NEXTAUTH_URL}/conges" style="background: #2563EB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">Voir mes congés</a>
          </div>
        </div>
      </div>`,
  }
}

export async function welcomeEmail(agentName: string, email: string) {
  const cfg = await getEmailConfig()
  return {
    subject: `Bienvenue sur ${cfg.appName}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #2563EB; color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 20px;">Bienvenue sur ${cfg.appName}</h1>
        </div>
        <div style="background: white; padding: 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #374151; font-size: 16px;">Bonjour ${agentName},</p>
          <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
            Votre compte a été créé sur ${cfg.appName}, l'application de gestion des plannings du ${cfg.serviceName} — ${cfg.hospitalName}.
          </p>
          <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">Votre identifiant : <strong>${email}</strong></p>
          <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
            Nous vous invitons à vous connecter et à modifier votre mot de passe lors de votre première connexion.
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${process.env.NEXTAUTH_URL}/login" style="background: #2563EB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">Se connecter</a>
          </div>
        </div>
      </div>`,
  }
}
