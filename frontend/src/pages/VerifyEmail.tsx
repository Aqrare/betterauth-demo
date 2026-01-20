import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authClient } from "../lib/auth";
import { StatusMessage, ErrorMessage, SubmitButton } from "../components/FormComponents";

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
					<StatusMessage
						type="loading"
						title="メールアドレスを確認中..."
						message="しばらくお待ちください"
					/>
				)}

				{status === "success" && (
					<StatusMessage
						type="success"
						title="認証完了！"
						message="メールアドレスの認証が完了しました"
					>
						<p className="text-cyan-700 text-sm mt-4">
							まもなくダッシュボードにリダイレクトします...
						</p>
					</StatusMessage>
				)}

				{status === "error" && (
					<>
						<StatusMessage
							type="error"
							title="認証に失敗しました"
						/>
						<ErrorMessage message={errorMessage} />
						<SubmitButton onClick={() => navigate("/login")}>
							ログインページへ戻る
						</SubmitButton>
					</>
				)}
			</div>
		</div>
	);
}
