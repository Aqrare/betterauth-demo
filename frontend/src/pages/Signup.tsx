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

export default function Signup() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		await authClient.signUp.email(
			{
				email,
				password,
				name,
				callbackURL: "/dashboard",
			},
			{
				onRequest: () => {
					setError("");
					setLoading(true);
				},
				onSuccess: () => {
					// メール認証が必要なのでCheckEmailページへ
					navigate("/check-email", { state: { email } });
				},
				onError: (ctx) => {
					setError(ctx.error.message);
					setLoading(false);
				},
			},
		);
	};

	const handleGoogleSignup = async () => {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "http://localhost:5173/dashboard",
		});
	};

	return (
		<AuthCard title="Sign Up">
			<ErrorMessage message={error} />

			<GoogleButton onClick={handleGoogleSignup} />

			<Divider text="Or continue with email" />

			<form onSubmit={handleSubmit} className="space-y-4">
				<AuthInput
					id="name"
					label="Name"
					type="text"
					value={name}
					onChange={setName}
					required
				/>

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

				<SubmitButton loading={loading}>
					{loading ? "Creating account..." : "Sign Up"}
				</SubmitButton>
			</form>

			<AuthFooter
				text="Already have an account?"
				linkText="Login"
				linkTo="/login"
			/>
		</AuthCard>
	);
}
