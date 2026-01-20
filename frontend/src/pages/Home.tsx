import { Link } from "react-router-dom";
import { authClient } from "../lib/auth";

export default function Home() {
	const handleGoogleLogin = async () => {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "http://localhost:5173/dashboard",
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-cyan-200 flex items-center justify-center p-4">
			<div className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/50 max-w-md w-full">
				<h1 className="text-3xl font-bold text-cyan-900 mb-4">Auth Demo</h1>
				<p className="text-cyan-800 mb-6">
					BetterAuth demonstration with React and Hono
				</p>
				<div className="space-y-3">
					<button
						type="button"
						onClick={handleGoogleLogin}
						className="w-full bg-white/60 backdrop-blur-sm text-cyan-900 py-3 px-4 rounded-xl border border-cyan-200 hover:bg-white/70 transition-all duration-300 font-medium flex items-center justify-center gap-3"
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

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-cyan-200" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white/40 text-cyan-800">Or</span>
						</div>
					</div>

					<Link
						to="/login"
						className="block w-full bg-white/50 backdrop-blur-sm text-cyan-900 text-center py-3 px-4 rounded-xl border border-cyan-200 hover:bg-white/60 transition-all duration-300 font-medium"
					>
						Login with Email
					</Link>
					<Link
						to="/signup"
						className="block w-full bg-white/40 backdrop-blur-sm text-cyan-900 text-center py-3 px-4 rounded-xl border border-cyan-200 hover:bg-white/50 transition-all duration-300 font-medium"
					>
						Sign Up with Email
					</Link>
				</div>
			</div>
		</div>
	);
}
