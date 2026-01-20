import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authClient } from "../lib/auth";

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
				<div className="text-center mb-6">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100/60 rounded-full mb-4">
						<svg
							className="w-8 h-8 text-cyan-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<h1 className="text-2xl font-bold text-cyan-900 mb-2">
						メールを確認してください
					</h1>
				</div>

				<div className="space-y-4">
					<p className="text-cyan-800 text-center">
						<span className="font-medium">{email}</span> に認証リンクを送信しました。
					</p>

					<div className="bg-white/30 backdrop-blur-sm p-4 rounded-xl border border-cyan-200">
						<p className="text-cyan-900 text-sm leading-relaxed">
							メール内のリンクをクリックしてアカウントを有効化してください。
							<br />
							<br />
							リンクをクリックすると、自動的にログインしてダッシュボードにリダイレクトされます。
						</p>
					</div>

					{resent && (
						<div className="bg-green-100/60 backdrop-blur-sm text-green-700 p-3 rounded-xl text-sm border border-green-200 text-center">
							認証メールを再送信しました
						</div>
					)}

					<button
						type="button"
						onClick={handleResend}
						disabled={resending}
						className="w-full bg-white/50 backdrop-blur-sm text-cyan-900 py-3 px-4 rounded-xl border border-cyan-200 hover:bg-white/60 disabled:bg-white/20 disabled:cursor-not-allowed transition-all duration-300 font-medium"
					>
						{resending ? "送信中..." : "メールを再送信"}
					</button>

					<p className="text-cyan-700 text-sm text-center">
						メールが届かない場合は、迷惑メールフォルダをご確認ください。
					</p>

					<button
						type="button"
						onClick={() => navigate("/login")}
						className="w-full text-cyan-800 text-sm hover:underline"
					>
						ログインページに戻る
					</button>
				</div>
			</div>
		</div>
	);
}
