import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authClient } from "../lib/auth";
import {
	AuthCard,
	AuthInput,
	ErrorMessage,
	SuccessMessage,
	SubmitButton,
} from "./FormComponents";

interface PasswordResetFormProps {
	mode: "reset" | "setup";
}

export default function PasswordResetForm({ mode }: PasswordResetFormProps) {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState<string | null>(null);

	// モードに応じたテキスト
	const texts = {
		reset: {
			title: "新しいパスワードを設定",
			description: "新しいパスワードを入力してください。",
			submitButton: "パスワードをリセット",
			submittingButton: "リセット中...",
			successTitle: "パスワードをリセットしました",
			successMessage: "パスワードが正常にリセットされました。\nまもなくログインページにリダイレクトされます...",
			errorMessage: "パスワードのリセットに失敗しました",
			processingError: "パスワードのリセット中にエラーが発生しました",
			invalidTokenError: "無効または期限切れのリセットリンクです。再度パスワードリセットをリクエストしてください。",
		},
		setup: {
			title: "パスワードを設定",
			description: "アカウントのパスワードを設定してください。パスワードを設定すると、2要素認証などの高度なセキュリティ機能を利用できます。",
			submitButton: "パスワードを設定",
			submittingButton: "設定中...",
			successTitle: "パスワードを設定しました",
			successMessage: "パスワードが正常に設定されました。\nまもなくダッシュボードにリダイレクトされます...",
			errorMessage: "パスワードの設定に失敗しました",
			processingError: "パスワードの設定中にエラーが発生しました",
			invalidTokenError: "無効または期限切れのリンクです。再度パスワード設定をリクエストしてください。",
		},
	};

	const text = texts[mode];

	useEffect(() => {
		const tokenParam = searchParams.get("token");
		const errorParam = searchParams.get("error");

		if (errorParam === "INVALID_TOKEN") {
			setError(text.invalidTokenError);
		} else if (tokenParam) {
			setToken(tokenParam);
		} else {
			setError("トークンが見つかりません");
		}
	}, [searchParams, text.invalidTokenError]);

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
				setError(error.message || text.errorMessage);
			} else {
				setSuccess(true);
				// 3秒後にリダイレクト
				setTimeout(() => {
					navigate(mode === "reset" ? "/login" : "/dashboard");
				}, 3000);
			}
		} catch (error) {
			setError(text.processingError);
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<AuthCard title={text.successTitle}>
				<SuccessMessage>
					{text.successMessage}
				</SuccessMessage>

				<div className="mt-6">
					<SubmitButton onClick={() => navigate(mode === "reset" ? "/login" : "/dashboard")}>
						{mode === "reset" ? "今すぐログイン" : "ダッシュボードへ"}
					</SubmitButton>
				</div>
			</AuthCard>
		);
	}

	return (
		<AuthCard title={text.title}>
			<p className="text-cyan-800 mb-6 text-sm">
				{text.description}
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
					{loading ? text.submittingButton : text.submitButton}
				</SubmitButton>
			</form>
		</AuthCard>
	);
}
