import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authClient } from "../lib/auth";
import {
	AuthCard,
	AuthInput,
	ErrorMessage,
	SuccessMessage,
	SubmitButton,
} from "../components/FormComponents";

export default function ResetPassword() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const tokenParam = searchParams.get("token");
		const errorParam = searchParams.get("error");

		if (errorParam === "INVALID_TOKEN") {
			setError("無効または期限切れのリセットリンクです。再度パスワードリセットをリクエストしてください。");
		} else if (tokenParam) {
			setToken(tokenParam);
		} else {
			setError("トークンが見つかりません");
		}
	}, [searchParams]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!token) {
			setError("トークンが見つかりません");
			return;
		}

		// バリデーション
		if (newPassword !== confirmPassword) {
			setError("パスワードが一致しません");
			return;
		}

		if (newPassword.length < 8) {
			setError("パスワードは8文字以上である必要があります");
			return;
		}

		setError("");
		setLoading(true);

		try {
			const { error } = await authClient.resetPassword({
				newPassword,
				token,
			});

			if (error) {
				setError(error.message || "パスワードのリセットに失敗しました");
			} else {
				setSuccess(true);
				// 3秒後にログインページへ
				setTimeout(() => {
					navigate("/login");
				}, 3000);
			}
		} catch (error) {
			setError("パスワードのリセット中にエラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<AuthCard title="パスワードをリセットしました">
				<SuccessMessage>
					パスワードが正常にリセットされました。
					まもなくログインページにリダイレクトされます...
				</SuccessMessage>

				<div className="mt-6">
					<SubmitButton onClick={() => navigate("/login")}>
						今すぐログイン
					</SubmitButton>
				</div>
			</AuthCard>
		);
	}

	return (
		<AuthCard title="新しいパスワードを設定">
			<p className="text-cyan-800 mb-6 text-sm">
				新しいパスワードを入力してください。
			</p>

			<ErrorMessage message={error} />

			<form onSubmit={handleSubmit} className="space-y-4">
				<AuthInput
					id="newPassword"
					label="新しいパスワード"
					type="password"
					value={newPassword}
					onChange={setNewPassword}
					required
				/>

				<AuthInput
					id="confirmPassword"
					label="パスワードを確認"
					type="password"
					value={confirmPassword}
					onChange={setConfirmPassword}
					required
				/>

				<SubmitButton loading={loading}>
					{loading ? "リセット中..." : "パスワードをリセット"}
				</SubmitButton>
			</form>
		</AuthCard>
	);
}
