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
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-gray-600">Loading...</div>
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
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
				<h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

				<div className="space-y-4">
					<div className="border-b pb-4">
						<h2 className="text-sm font-medium text-gray-500 mb-2">
							User Information
						</h2>
						<div className="space-y-2">
							<p className="text-gray-900">
								<span className="font-medium">Name:</span> {session.user.name}
							</p>
							<p className="text-gray-900">
								<span className="font-medium">Email:</span> {session.user.email}
							</p>
						</div>
					</div>

					<button
						type="button"
						onClick={handleSignOut}
						className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
					>
						Sign Out
					</button>
				</div>
			</div>
		</div>
	);
}
