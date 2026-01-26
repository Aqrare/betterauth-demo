import { Resend } from "resend"
import dotenv from "dotenv"

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendVerificationEmailParams {
	to: string
	url: string
	userName: string
}

interface SendPasswordResetEmailParams {
	to: string
	url: string
	userName: string
}

export async function sendVerificationEmail({
	to,
	url,
	userName,
}: SendVerificationEmailParams) {
	try {
		await resend.emails.send({
			from: "Auth Demo <onboarding@resend.dev>",
			to,
			subject: "メールアドレスを確認してください",
			tags: [
				{
					name: "category",
					value: "email_verification",
				},
			],
			headers: {
				"X-Entity-Ref-ID": "email-verification",
			},
			html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f0f9ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: rgba(255, 255, 255, 0.6); backdrop-filter: blur(10px); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); padding: 40px;">
          <tr>
            <td style="text-align: center; padding-bottom: 30px;">
              <h1 style="color: #164e63; font-size: 28px; margin: 0; font-weight: bold;">Auth Demo</h1>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 20px;">
              <h2 style="color: #164e63; font-size: 24px; margin: 0 0 16px 0;">こんにちは、${userName}さん</h2>
              <p style="color: #155e75; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                アカウント登録ありがとうございます。<br>
                以下のボタンをクリックしてメールアドレスを確認してください。
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 30px 0;">
              <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.4) 100%); backdrop-filter: blur(10px); color: #164e63; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; border: 1px solid rgba(6, 182, 212, 0.3); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                メールアドレスを確認する
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 30px; border-top: 1px solid rgba(6, 182, 212, 0.2);">
              <p style="color: #155e75; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">
                ボタンが機能しない場合は、以下のURLをコピーしてブラウザに貼り付けてください：
              </p>
              <p style="color: #0e7490; font-size: 13px; word-break: break-all; margin: 0 0 16px 0;">
                ${url}
              </p>
              <p style="color: #6b7280; font-size: 13px; margin: 0;">
                このリンクは24時間有効です。<br>
                このメールに心当たりがない場合は、無視してください。
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
		})
	} catch (error) {
		console.error("Failed to send verification email:", error)
		throw error
	}
}

export async function sendPasswordResetEmail({
	to,
	url,
	userName,
}: SendPasswordResetEmailParams) {
	try {
		await resend.emails.send({
			from: "Auth Demo <onboarding@resend.dev>",
			to,
			subject: "パスワードをリセットしてください",
			tags: [
				{
					name: "category",
					value: "password_reset",
				},
			],
			headers: {
				"X-Entity-Ref-ID": "password-reset",
			},
			html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f0f9ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: rgba(255, 255, 255, 0.6); backdrop-filter: blur(10px); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); padding: 40px;">
          <tr>
            <td style="text-align: center; padding-bottom: 30px;">
              <h1 style="color: #164e63; font-size: 28px; margin: 0; font-weight: bold;">Auth Demo</h1>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 20px;">
              <h2 style="color: #164e63; font-size: 24px; margin: 0 0 16px 0;">こんにちは、${userName}さん</h2>
              <p style="color: #155e75; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                パスワードのリセットがリクエストされました。<br>
                以下のボタンをクリックして新しいパスワードを設定してください。
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 30px 0;">
              <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.4) 100%); backdrop-filter: blur(10px); color: #164e63; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; border: 1px solid rgba(6, 182, 212, 0.3); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                パスワードをリセットする
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 30px; border-top: 1px solid rgba(6, 182, 212, 0.2);">
              <p style="color: #155e75; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">
                ボタンが機能しない場合は、以下のURLをコピーしてブラウザに貼り付けてください：
              </p>
              <p style="color: #0e7490; font-size: 13px; word-break: break-all; margin: 0 0 16px 0;">
                ${url}
              </p>
              <p style="color: #6b7280; font-size: 13px; margin: 0;">
                このリンクは1時間有効です。<br>
                このメールに心当たりがない場合は、無視してください。
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
		})
	} catch (error) {
		console.error("Failed to send password reset email:", error)
		throw error
	}
}
