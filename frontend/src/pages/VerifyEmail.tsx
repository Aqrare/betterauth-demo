import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authClient } from "../lib/auth";

export default function VerifyEmail() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		const token = searchParams.get("token");

		if (!token) {
			setStatus("error");
			setErrorMessage("認証トークンが見つかりません");
			return;
		}

		// メール認証を実行
		authClient.verifyEmail({
			query: { token },
		}).then((response) => {
			if (response.error) {
				setStatus("error");
				setErrorMessage(response.error.message || "認証に失敗しました");
			} else {
				setStatus("success");
				// 3秒後にダッシュボードへ
				setTimeout(() => {
					navigate("/dashboard");
				}, 3000);
			}
		}).catch((error) => {
			setStatus("error");
			setErrorMessage(error.message || "認証中にエラーが発生しました");
		});
	}, [searchParams, navigate]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-cyan-200 flex items-center justify-center p-4">
			<div className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/50 max-w-md w-full text-center">
				{status === "verifying" && (
					<>
						<div className="mb-6">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100/60 rounded-full mb-4">
								<svg
									className="w-8 h-8 text-cyan-600 animate-spin"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
							</div>
							<h1 className="text-2xl font-bold text-cyan-900 mb-2">
								メールアドレスを確認中...
							</h1>
							<p className="text-cyan-800">
								しばらくお待ちください
							</p>
						</div>
					</>
				)}

				{status === "success" && (
					<>
						<div className="mb-6">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-green-100/60 rounded-full mb-4">
								<svg
									className="w-8 h-8 text-green-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<h1 className="text-2xl font-bold text-cyan-900 mb-2">
								認証完了！
							</h1>
							<p className="text-cyan-800 mb-4">
								メールアドレスの認証が完了しました
							</p>
							<p className="text-cyan-700 text-sm">
								まもなくダッシュボードにリダイレクトします...
							</p>
						</div>
					</>
				)}

				{status === "error" && (
					<>
						<div className="mb-6">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-red-100/60 rounded-full mb-4">
								<svg
									className="w-8 h-8 text-red-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</div>
							<h1 className="text-2xl font-bold text-cyan-900 mb-2">
								認証に失敗しました
							</h1>
							<p className="text-red-700 mb-6">
								{errorMessage}
							</p>
							<button
								type="button"
								onClick={() => navigate("/login")}
								className="w-full bg-white/50 backdrop-blur-sm text-cyan-900 py-3 px-4 rounded-xl border border-cyan-200 hover:bg-white/60 transition-all duration-300 font-medium"
							>
								ログインページへ戻る
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
