import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authClient } from "../lib/auth";
import {
	StatusMessage,
	InfoBox,
	SuccessMessage,
	SubmitButton,
	LinkButton,
} from "../components/FormComponents";

export default function CheckEmail() {
	const location = useLocation();
	const navigate = useNavigate();
	const email = location.state?.email || "";
	const [resending, setResending] = useState(false);
	const [resent, setResent] = useState(false);

	const handleResend = async () => {
		if (!email) return;

		setResending(true);
		try {
			await authClient.sendVerificationEmail({
				email,
				callbackURL: "/dashboard",
			});
			setResent(true);
			setTimeout(() => setResent(false), 5000);
		} catch (error) {
			console.error("Failed to resend email:", error);
		} finally {
			setResending(false);
		}
	};

	if (!email) {
		navigate("/signup");
		return null;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-cyan-200 flex items-center justify-center p-4">
			<div className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/50 max-w-md w-full">
				<StatusMessage
					type="info"
					title="メールを確認してください"
				/>

				<div className="space-y-4">
					<p className="text-cyan-800 text-center">
						<span className="font-medium">{email}</span> に認証リンクを送信しました。
					</p>

					<InfoBox>
						メール内のリンクをクリックしてアカウントを有効化してください。
						<br />
						<br />
						リンクをクリックすると、自動的にログインしてダッシュボードにリダイレクトされます。
					</InfoBox>

					{resent && (
						<SuccessMessage>
							認証メールを再送信しました
						</SuccessMessage>
					)}

					<SubmitButton loading={resending} onClick={handleResend}>
						{resending ? "送信中..." : "メールを再送信"}
					</SubmitButton>

					<p className="text-cyan-700 text-sm text-center">
						メールが届かない場合は、迷惑メールフォルダをご確認ください。
					</p>

					<LinkButton to="/login" variant="text">
						ログインページに戻る
					</LinkButton>
				</div>
			</div>
		</div>
	);
}
