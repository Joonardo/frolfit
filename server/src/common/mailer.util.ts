import * as sg from '@sendgrid/mail';

sg.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendLoginMail(email: string, token: string) {
  const response = await sg.send({
    to: email,
    from: 'frolfit@grr.la',
    subject: 'Magic link for Frolfit',
    text: token,
  });
  return response;
}
