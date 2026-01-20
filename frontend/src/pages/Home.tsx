import { Link } from "react-router-dom";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-cyan-200 flex items-center justify-center p-4">
			<div className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/50 max-w-md w-full">
				<h1 className="text-3xl font-bold text-cyan-900 mb-4">Auth Demo</h1>
				<p className="text-cyan-800 mb-6">
					BetterAuth demonstration with React and Hono
				</p>
				<div className="space-y-3">
					<Link
						to="/login"
						className="block w-full bg-white/50 backdrop-blur-sm text-cyan-900 text-center py-3 px-4 rounded-xl border border-cyan-200 hover:bg-white/60 transition-all duration-300 font-medium"
					>
						Login
					</Link>
					<Link
						to="/signup"
						className="block w-full bg-white/40 backdrop-blur-sm text-cyan-900 text-center py-3 px-4 rounded-xl border border-cyan-200 hover:bg-white/50 transition-all duration-300 font-medium"
					>
						Sign Up
					</Link>
				</div>
			</div>
		</div>
	);
}
