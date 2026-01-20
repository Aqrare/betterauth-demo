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
				<h1 className="text-2xl font-bold text-cyan-900 mb-6">Sign Up</h1>

				{error && (
					<div className="bg-red-100/60 backdrop-blur-sm text-red-700 p-3 rounded-xl mb-4 text-sm border border-red-200">
						{error}
					</div>
				)}

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
