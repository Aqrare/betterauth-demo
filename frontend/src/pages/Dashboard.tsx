import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth";

export default function Dashboard() {
	const navigate = useNavigate();
	const {
		data: session,
		isPending,
		error,
	} = authClient.useSession();

	// ローディング中
	if (isPending) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-cyan-200 flex items-center justify-center">
				<div className="text-cyan-900 text-lg font-medium">Loading...</div>
			</div>
		);
	}

	// エラーまたは未ログインの場合
	if (error || !session) {
		navigate("/login");
		return null;
	}

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					navigate("/login");
				},
			},
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-cyan-200 flex items-center justify-center p-4">
			<div className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/50 max-w-md w-full">
				<h1 className="text-2xl font-bold text-cyan-900 mb-6">Dashboard</h1>

				<div className="space-y-4">
					<div className="border-b border-cyan-200 pb-4">
						<h2 className="text-sm font-medium text-cyan-800 mb-2">
							User Information
						</h2>
						<div className="space-y-2">
							<p className="text-cyan-900">
								<span className="font-medium">Name:</span> {session.user.name}
							</p>
							<p className="text-cyan-900">
								<span className="font-medium">Email:</span> {session.user.email}
							</p>
						</div>
					</div>

					<button
						type="button"
						onClick={handleSignOut}
						className="w-full bg-red-100/60 backdrop-blur-sm text-red-700 py-3 px-4 rounded-xl border border-red-200 hover:bg-red-100/80 transition-all duration-300 font-medium"
					>
						Sign Out
					</button>
				</div>
			</div>
		</div>
	);
}
