import { Link } from "react-router-dom";

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center">
			<div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
				<h1 className="text-3xl font-bold text-gray-900 mb-4">Auth Demo</h1>
				<p className="text-gray-600 mb-6">
					BetterAuth demonstration with React and Hono
				</p>
				<div className="space-y-3">
					<Link
						to="/login"
						className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700"
					>
						Login
					</Link>
					<Link
						to="/signup"
						className="block w-full bg-gray-200 text-gray-800 text-center py-2 px-4 rounded hover:bg-gray-300"
					>
						Sign Up
					</Link>
				</div>
			</div>
		</div>
	);
}
