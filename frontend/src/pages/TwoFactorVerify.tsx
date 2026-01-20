import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth";
import {
	AuthCard,
	AuthInput,
	ErrorMessage,
	SubmitButton,
} from "../components/FormComponents";

export default function TwoFactorVerify() {
	const navigate = useNavigate();
	const [code, setCode] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setError("");
		setLoading(true);

		try {
			const { error } = await authClient.twoFactor.verifyTotp({
				code,
			});

			if (error) {
				setError(error.message || "コードの検証に失敗しました");
			} else {
				// ログイン成功、ダッシュボードへ
				navigate("/dashboard");
			}
		} catch (err) {
			setError("エラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthCard title="2要素認証">
			<p className="text-cyan-800 mb-6 text-sm">
				Authenticatorアプリに表示されている6桁のコードを入力してください。
			</p>

			<ErrorMessage message={error} />

			<form onSubmit={handleSubmit} className="space-y-4">
				<AuthInput
					id="code"
					label="認証コード"
					type="text"
					value={code}
					onChange={setCode}
					placeholder="000000"
					required
				/>

				<SubmitButton loading={loading}>
					{loading ? "検証中..." : "確認"}
				</SubmitButton>
			</form>

			<p className="mt-4 text-sm text-cyan-700 text-center">
				デバイスにアクセスできない場合は、バックアップコードを使用してください。
			</p>
		</AuthCard>
	);
}
