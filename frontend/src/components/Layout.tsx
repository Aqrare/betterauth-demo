import { useNavigate, useLocation } from "react-router-dom";
import { authClient } from "../lib/auth";
import { useState, type ReactNode } from "react";

interface LayoutProps {
	children: ReactNode;
	title: string;
	subtitle?: string;
}

export default function Layout({ children, title, subtitle }: LayoutProps) {
	const navigate = useNavigate();
	const location = useLocation();
	const [sidebarOpen, setSidebarOpen] = useState(true);
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

	const isActive = (path: string) => location.pathname === path;

	return (
		<div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-cyan-200">
			{/* Sidebar */}
			<aside
				className={`fixed left-0 top-0 h-full bg-white/40 backdrop-blur-lg border-r border-white/50 transition-all duration-300 ${
					sidebarOpen ? "w-64" : "w-20"
				}`}
			>
				<div className="p-6">
					<h2 className={`font-bold text-cyan-900 text-xl ${sidebarOpen ? "" : "text-center"}`}>
						{sidebarOpen ? "Auth Demo" : "AD"}
					</h2>
				</div>
				<nav className="px-4 space-y-2">
					<button
						type="button"
						onClick={() => navigate("/dashboard")}
						className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
							isActive("/dashboard")
								? "bg-cyan-100/50 backdrop-blur-sm text-cyan-900 border border-cyan-200/50 font-medium"
								: "text-cyan-800 hover:bg-white/30"
						}`}
					>
						{sidebarOpen ? "📊 Dashboard" : "📊"}
					</button>
					<button
						type="button"
						onClick={() => navigate("/settings")}
						className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
							isActive("/settings")
								? "bg-cyan-100/50 backdrop-blur-sm text-cyan-900 border border-cyan-200/50 font-medium"
								: "text-cyan-800 hover:bg-white/30"
						}`}
					>
						{sidebarOpen ? "⚙️ Settings" : "⚙️"}
					</button>
				</nav>
				<button
					type="button"
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-lg text-cyan-800 hover:bg-white/70 transition-all border border-white/50"
				>
					{sidebarOpen ? "◀" : "▶"}
				</button>
			</aside>

			{/* Main Content */}
			<div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
				{/* Header */}
				<header className="bg-white/40 backdrop-blur-lg border-b border-white/50 px-8 py-4 flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-cyan-900">{title}</h1>
						{subtitle && <p className="text-sm text-cyan-700">{subtitle}</p>}
					</div>
					<div className="flex items-center gap-4">
						<div className="text-right">
							<p className="text-sm font-medium text-cyan-900">{session.user.name}</p>
							<p className="text-xs text-cyan-700">{session.user.email}</p>
						</div>
						<button
							type="button"
							onClick={handleSignOut}
							className="px-4 py-2 bg-red-100/60 backdrop-blur-sm text-red-700 rounded-xl border border-red-200 hover:bg-red-100/80 transition-all duration-300 font-medium"
						>
							Sign Out
						</button>
					</div>
				</header>

				{/* Content */}
				<main className="p-8">{children}</main>
			</div>
		</div>
	);
}
