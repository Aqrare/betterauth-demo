import Layout from "../components/Layout";
import { authClient } from "../lib/auth";

export default function Dashboard() {
	const { data: session } = authClient.useSession();

	return (
		<Layout title="Dashboard" subtitle={`Welcome back, ${session?.user.name}`}>
			<div className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/50 max-w-2xl">
				<h2 className="text-xl font-bold text-cyan-900 mb-4">Welcome to Your Dashboard</h2>
				<p className="text-cyan-700 mb-6">
					This is your personal dashboard. Navigate using the sidebar to access different features.
				</p>
				<div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/50">
					<p className="text-sm text-cyan-800">
						<span className="font-medium">Account Status:</span> Active
					</p>
				</div>
			</div>
		</Layout>
	);
}
