import { authClient } from "../lib/auth";
import { AuthCard, GoogleButton, Divider, LinkButton } from "../components/FormComponents";

export default function Home() {
	const handleGoogleLogin = async () => {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "http://localhost:5173/dashboard",
		});
	};

	return (
		<AuthCard title="Auth Demo">
			<p className="text-cyan-800 mb-6">
				BetterAuth demonstration with React and Hono
			</p>
			<div className="space-y-3">
				<GoogleButton onClick={handleGoogleLogin} />

				<Divider text="Or" />

				<LinkButton to="/login">Login with Email</LinkButton>
				<LinkButton to="/signup" variant="secondary">Sign Up with Email</LinkButton>
			</div>
		</AuthCard>
	);
}
