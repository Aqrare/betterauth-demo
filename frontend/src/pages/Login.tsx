import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authClient } from "../lib/auth";

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

	return (
		<div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-cyan-200 flex items-center justify-center p-4">
			<div className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/50 max-w-md w-full">
				<h1 className="text-2xl font-bold text-cyan-900 mb-6">Login</h1>

				{error && (
					<div className="bg-red-100/60 backdrop-blur-sm text-red-700 p-3 rounded-xl mb-4 text-sm border border-red-200">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
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
							className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 text-cyan-900 placeholder-cyan-400"
						/>
					</div>

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

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-white/50 backdrop-blur-sm text-cyan-900 py-3 px-4 rounded-xl border border-cyan-200 hover:bg-white/60 disabled:bg-white/20 disabled:cursor-not-allowed transition-all duration-300 font-medium"
					>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>

				<p className="mt-4 text-center text-sm text-cyan-800">
					Don't have an account?{" "}
					<Link to="/signup" className="text-cyan-900 font-medium hover:underline">
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
}
