import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

		await authClient.signIn.email(
			{
				email,
				password,
				callbackURL: "/dashboard",
				rememberMe,
			},
			{
				onRequest: () => {
					setError("");
					setLoading(true);
				},
				onSuccess: () => {
					navigate("/dashboard");
				},
				onError: (ctx) => {
					setError(ctx.error.message);
					setLoading(false);
				},
			},
		);
	};

	const handleGoogleLogin = async () => {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "http://localhost:5173/dashboard",
		});
	};

	return (
		<AuthCard title="Login">
			<ErrorMessage message={error} />

			<GoogleButton onClick={handleGoogleLogin} />

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
