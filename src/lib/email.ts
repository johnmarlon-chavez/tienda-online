import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const REMITENTE = process.env.RESEND_FROM_EMAIL ?? "ANDES <onboarding@resend.dev>";
const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

export async function enviarCorreoVerificacion(
  email: string,
  nombre: string,
  token: string
): Promise<{ error?: string }> {
  const link = `${APP_URL}/verificar-email?token=${token}`;

  const { error } = await resend.emails.send({
    from: REMITENTE,
    to: [email],
    subject: "Verifica tu correo — ANDES",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #18181b;">
        <h1 style="font-size: 20px;">Hola ${nombre},</h1>
        <p>Gracias por crear tu cuenta en ANDES. Confirma tu correo para poder completar compras:</p>
        <p style="margin: 24px 0;">
          <a
            href="${link}"
            style="display: inline-block; background: #18181b; color: #ffffff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600;"
          >
            Verificar correo
          </a>
        </p>
        <p style="color: #71717a; font-size: 13px;">
          Este enlace vence en 24 horas. Si no creaste esta cuenta, ignora este correo.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Error al enviar correo de verificación:", error);
    return { error: error.message };
  }
  return {};
}
