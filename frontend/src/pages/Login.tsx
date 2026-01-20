import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authClient } from "../lib/auth";
import {
	AuthCard,
	AuthInput,
	ErrorMessage,
	GoogleButton,
	Divider,
	SubmitButton,
	AuthFooter,
} from "../components/FormComponents";

export default function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(true);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setError("");
		setLoading(true);

		try {
			const result = await authClient.signIn.email({
				email,
				password,
				callbackURL: "/dashboard",
				rememberMe,
			});

			console.log("Login result:", result);

			if (result.error) {
				setError(result.error.message || "ログインに失敗しました");
				setLoading(false);
				return;
			}

			// 2FAリダイレクトが必要かチェック
			// @ts-ignore - twoFactorRedirect may not be in type definition
			if (result.data?.twoFactorRedirect) {
				console.log("2FA redirect needed");
				navigate("/two-factor-verify");
			} else {
				console.log("No 2FA, going to dashboard");
				navigate("/dashboard");
			}
		} catch (err) {
			console.error("Login error:", err);
			setError("ログイン中にエラーが発生しました");
			setLoading(false);
		}
	};

	const handleGoogleLogin = async () => {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "http://localhost:5173/dashboard",
		});
	};

	const handlePasskeyLogin = async () => {
		setError("");
		setLoading(true);

		try {
			const result = await authClient.signIn.passkey();

			if (result.error) {
				setError(result.error.message || "パスキーでのログインに失敗しました");
				setLoading(false);
				return;
			}

			navigate("/dashboard");
		} catch (err) {
			console.error("Passkey login error:", err);
			setError("パスキーログイン中にエラーが発生しました");
			setLoading(false);
		}
	};

	return (
		<AuthCard title="Login">
			<ErrorMessage message={error} />

			<GoogleButton onClick={handleGoogleLogin} />

			<button
				type="button"
				onClick={handlePasskeyLogin}
				disabled={loading}
				className="w-full bg-white/60 backdrop-blur-sm text-cyan-900 py-3 px-4 rounded-xl border border-cyan-200 hover:bg-white/70 transition-all duration-300 font-medium flex items-center justify-center gap-3 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
				</svg>
				Sign in with Passkey
			</button>

			<Divider text="Or continue with email" />

			<form onSubmit={handleSubmit} className="space-y-4">
				<AuthInput
					id="email"
					label="Email"
					type="email"
					value={email}
					onChange={setEmail}
					required
				/>

				<AuthInput
					id="password"
					label="Password"
					type="password"
					value={password}
					onChange={setPassword}
					required
				/>

				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<input
							id="rememberMe"
							type="checkbox"
							checked={rememberMe}
							onChange={(e) => setRememberMe(e.target.checked)}
							className="h-4 w-4 accent-cyan-600 border-cyan-300 rounded"
						/>
						<label htmlFor="rememberMe" className="ml-2 block text-sm text-cyan-900">
							Remember me
						</label>
					</div>
					<Link to="/forgot-password" className="text-sm text-cyan-800 hover:underline">
						パスワードを忘れた場合
					</Link>
				</div>

				<SubmitButton loading={loading}>
					{loading ? "Logging in..." : "Login"}
				</SubmitButton>
			</form>

			<AuthFooter
				text="Don't have an account?"
				linkText="Sign Up"
				linkTo="/signup"
			/>
		</AuthCard>
	);
}
