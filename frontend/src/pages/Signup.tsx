import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authClient } from "../lib/auth";

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
		<div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-cyan-200 flex items-center justify-center p-4">
			<div className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/50 max-w-md w-full">
				<h1 className="text-2xl font-bold text-cyan-900 mb-6">Sign Up</h1>

				{error && (
					<div className="bg-red-100/60 backdrop-blur-sm text-red-700 p-3 rounded-xl mb-4 text-sm border border-red-200">
						{error}
					</div>
				)}

				<button
					type="button"
					onClick={handleGoogleSignup}
					className="w-full bg-white/60 backdrop-blur-sm text-cyan-900 py-3 px-4 rounded-xl border border-cyan-200 hover:bg-white/70 transition-all duration-300 font-medium flex items-center justify-center gap-3 mb-4"
				>
					<svg className="w-5 h-5" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="currentColor"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="currentColor"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							fill="currentColor"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
					Continue with Google
				</button>

				<div className="relative mb-4">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-cyan-200" />
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 bg-white/40 text-cyan-800">Or continue with email</span>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="name" className="block text-sm font-medium text-cyan-900 mb-1">
							Name
						</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 text-cyan-900 placeholder-cyan-400"
						/>
					</div>

					<div>
						<label htmlFor="email" className="block text-sm font-medium text-cyan-900 mb-1">
							Email
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 text-cyan-900 placeholder-cyan-400"
						/>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-cyan-900 mb-1">
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={8}
							className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 text-cyan-900 placeholder-cyan-400"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-white/50 backdrop-blur-sm text-cyan-900 py-3 px-4 rounded-xl border border-cyan-200 hover:bg-white/60 disabled:bg-white/20 disabled:cursor-not-allowed transition-all duration-300 font-medium"
					>
						{loading ? "Creating account..." : "Sign Up"}
					</button>
				</form>

				<p className="mt-4 text-center text-sm text-cyan-800">
					Already have an account?{" "}
					<Link to="/login" className="text-cyan-900 font-medium hover:underline">
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}
