import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth";
import {
	AuthCard,
	AuthInput,
	ErrorMessage,
	SuccessMessage,
	SubmitButton,
	AuthFooter,
} from "../components/FormComponents";

export default function ForgotPassword() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setError("");
		setLoading(true);

		try {
			const { data, error } = await authClient.requestPasswordReset({
				email,
				redirectTo: `${window.location.origin}/reset-password`,
			});

			if (error) {
				setError(error.message || "パスワードリセットメールの送信に失敗しました");
			} else {
				setSuccess(true);
			}
		} catch (err) {
			setError("エラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<AuthCard title="メールを確認してください">
				<SuccessMessage>
					パスワードリセット用のリンクを {email} に送信しました。
					メールを確認してパスワードをリセットしてください。
				</SuccessMessage>

				<p className="mt-4 text-sm text-cyan-700 text-center">
					メールが届かない場合は、迷惑メールフォルダをご確認ください。
				</p>

				<div className="mt-6">
					<SubmitButton onClick={() => navigate("/login")}>
						ログインページに戻る
					</SubmitButton>
				</div>
			</AuthCard>
		);
	}

	return (
		<AuthCard title="パスワードを忘れた場合">
			<p className="text-cyan-800 mb-6 text-sm">
				登録したメールアドレスを入力してください。
				パスワードリセット用のリンクをお送りします。
			</p>

			<ErrorMessage message={error} />

			<form onSubmit={handleSubmit} className="space-y-4">
				<AuthInput
					id="email"
					label="Email"
					type="email"
					value={email}
					onChange={setEmail}
					required
				/>

				<SubmitButton loading={loading}>
					{loading ? "送信中..." : "パスワードリセットメールを送信"}
				</SubmitButton>
			</form>

			<AuthFooter
				text="ログインに戻る"
				linkText="こちら"
				linkTo="/login"
			/>
		</AuthCard>
	);
}
