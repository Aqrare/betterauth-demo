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
	const [useBackupCode, setUseBackupCode] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setError("");
		setLoading(true);

		try {
			if (useBackupCode) {
				// バックアップコードで検証
				const { error } = await authClient.twoFactor.verifyBackupCode({
					code,
				});

				if (error) {
					setError(error.message || "バックアップコードの検証に失敗しました");
				} else {
					// ログイン成功、ダッシュボードへ
					navigate("/dashboard");
				}
			} else {
				// TOTPコードで検証
				const { error } = await authClient.twoFactor.verifyTotp({
					code,
				});

				if (error) {
					setError(error.message || "コードの検証に失敗しました");
				} else {
					// ログイン成功、ダッシュボードへ
					navigate("/dashboard");
				}
			}
		} catch (err) {
			setError("エラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthCard title="2要素認証">
			{!useBackupCode ? (
				// TOTPコード入力
				<>
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

					<div className="mt-6 text-center">
						<button
							type="button"
							onClick={() => {
								setUseBackupCode(true);
								setCode("");
								setError("");
							}}
							className="text-sm text-cyan-800 hover:text-cyan-900 hover:underline"
						>
							デバイスにアクセスできませんか？バックアップコードを使用
						</button>
					</div>
				</>
			) : (
				// バックアップコード入力
				<>
					<p className="text-cyan-800 mb-6 text-sm">
						バックアップコードを入力してください。各コードは一度のみ使用できます。
					</p>

					<ErrorMessage message={error} />

					<form onSubmit={handleSubmit} className="space-y-4">
						<AuthInput
							id="backupCode"
							label="バックアップコード"
							type="text"
							value={code}
							onChange={setCode}
							placeholder="xxxxxxxx"
							required
						/>

						<SubmitButton loading={loading}>
							{loading ? "検証中..." : "確認"}
						</SubmitButton>
					</form>

					<div className="mt-6 text-center">
						<button
							type="button"
							onClick={() => {
								setUseBackupCode(false);
								setCode("");
								setError("");
							}}
							className="text-sm text-cyan-800 hover:text-cyan-900 hover:underline"
						>
							← 認証アプリに戻る
						</button>
					</div>
				</>
			)}
		</AuthCard>
	);
}
