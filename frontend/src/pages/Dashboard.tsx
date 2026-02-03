import { useState } from "react";
import Layout from "../components/Layout";
import { authClient } from "../lib/auth";
import { getJWTToken, testJWTAuth, testAdminAuth } from "../lib/resourceApi";

// JWTをデコードする関数
function decodeJWT(token: string) {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) {
			throw new Error('Invalid JWT format');
		}

		const payload = JSON.parse(atob(parts[1]));
		const header = JSON.parse(atob(parts[0]));

		return { header, payload };
	} catch (error) {
		console.error('Failed to decode JWT:', error);
		return null;
	}
}

export default function Dashboard() {
	const { data: session } = authClient.useSession();
	const [testResult, setTestResult] = useState<{
		type: "success" | "error";
		message: string;
		details?: any;
	} | null>(null);
	const [jwtInfo, setJwtInfo] = useState<{
		token: string;
		decoded: any;
	} | null>(null);
	const [cachedToken, setCachedToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [showCreateOrg, setShowCreateOrg] = useState(false);
	const [orgName, setOrgName] = useState("");

	// JWTトークンを取得または再利用
	const getOrFetchToken = async (): Promise<string> => {
		// 既にキャッシュされたトークンがあれば再利用
		if (cachedToken) {
			console.log('Using cached JWT token');
			return cachedToken;
		}

		// トークンを新規取得
		console.log('Fetching new JWT token');
		const token = await getJWTToken();
		if (!token) {
			throw new Error("JWTトークンを取得できませんでした");
		}

		// キャッシュに保存
		setCachedToken(token);
		return token;
	};

	// JWTを取得してデコード表示（常に最新を取得）
	const handleShowJWT = async () => {
		setLoading(true);
		setJwtInfo(null);

		try {
			// 常に最新のトークンを取得
			console.log('Fetching fresh JWT token');
			const token = await getJWTToken();
			if (!token) {
				throw new Error("JWTトークンを取得できませんでした");
			}

			// キャッシュに保存
			setCachedToken(token);

			const decoded = decodeJWT(token);
			if (!decoded) {
				throw new Error("JWTのデコードに失敗しました");
			}

			setJwtInfo({ token, decoded });
			console.log('JWT Token:', token);
			console.log('Decoded JWT:', decoded);
		} catch (error: any) {
			alert(error.message || "JWTの取得に失敗しました");
		} finally {
			setLoading(false);
		}
	};

	// JWT認証テスト（一般ユーザーでもアクセス可能）
	const handleJWTTest = async () => {
		setLoading(true);
		setTestResult(null);

		try {
			const token = await getOrFetchToken();
			const result = await testJWTAuth(token);
			setTestResult({
				type: "success",
				message: result.message,
				details: result,
			});
		} catch (error: any) {
			setTestResult({
				type: "error",
				message: error.message || "JWT認証に失敗しました",
			});
		} finally {
			setLoading(false);
		}
	};

	// 組織を作成（authClientを使用）
	const handleCreateOrganization = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!orgName.trim()) {
			alert("組織名を入力してください");
			return;
		}

		setLoading(true);
		try {
			// authClientのorganization.createメソッドを使用
			const { data, error } = await authClient.organization.create({
				name: orgName,
				slug: orgName.toLowerCase().replace(/\s+/g, "-"),
			});

			if (error) {
				throw new Error(error.message || "組織の作成に失敗しました");
			}

			alert("組織を作成しました！ページをリロードしてください。");
			setShowCreateOrg(false);
			setOrgName("");

			// セッションを再取得
			window.location.reload();
		} catch (error: any) {
			alert(error.message || "組織の作成に失敗しました");
		} finally {
			setLoading(false);
		}
	};

	// 管理者権限テスト（管理者のみアクセス可能）
	const handleAdminTest = async () => {
		setLoading(true);
		setTestResult(null);

		try {
			const token = await getOrFetchToken();
			const result = await testAdminAuth(token);
			setTestResult({
				type: "success",
				message: result.message,
				details: result,
			});
		} catch (error: any) {
			setTestResult({
				type: "error",
				message: error.message || "管理者権限テストに失敗しました",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Layout title="Dashboard" subtitle={`Welcome back, ${session?.user.name}`}>
			<div className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/50 max-w-2xl">
				<h2 className="text-xl font-bold text-cyan-900 mb-4">
					JWT & 権限テスト
				</h2>
				<p className="text-cyan-700 mb-6">
					Resource MSに対してJWT認証と権限チェックをテストします。
				</p>

				{/* ユーザー情報 */}
				<div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/50 mb-6">
					<h3 className="font-semibold text-cyan-900 mb-2">ユーザー情報</h3>
					<p className="text-sm text-cyan-800">
						<span className="font-medium">Email:</span> {session?.user.email}
					</p>
					<p className="text-sm text-cyan-800 mt-1">
						<span className="font-medium">Role:</span>{" "}
						{(session?.user as any)?.role || "user"}
					</p>
				</div>

				{/* 組織情報 */}
				<div className="bg-purple-50/50 backdrop-blur-sm p-4 rounded-xl border border-purple-200/50 mb-6">
					<h3 className="font-semibold text-purple-900 mb-2">組織情報</h3>
					{(session as any)?.activeOrganization ? (
						<>
							<p className="text-sm text-purple-800">
								<span className="font-medium">組織名:</span>{" "}
								{(session as any).activeOrganization.name}
							</p>
							<p className="text-sm text-purple-800 mt-1">
								<span className="font-medium">組織ID:</span>{" "}
								{(session as any).activeOrganization.id}
							</p>
							<p className="text-sm text-purple-800 mt-1">
								<span className="font-medium">組織ロール:</span>{" "}
								{(session as any).activeOrganization.role || "member"}
							</p>
						</>
					) : (
						<>
							<p className="text-sm text-purple-700 italic mb-3">
								組織に所属していません
							</p>

							{!showCreateOrg ? (
								<button
									onClick={() => setShowCreateOrg(true)}
									className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
								>
									組織を作成
								</button>
							) : (
								<form onSubmit={handleCreateOrganization} className="space-y-3">
									<input
										type="text"
										value={orgName}
										onChange={(e) => setOrgName(e.target.value)}
										placeholder="組織名を入力"
										className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
										disabled={loading}
									/>
									<div className="flex gap-2">
										<button
											type="submit"
											disabled={loading}
											className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
										>
											{loading ? "作成中..." : "作成"}
										</button>
										<button
											type="button"
											onClick={() => {
												setShowCreateOrg(false);
												setOrgName("");
											}}
											disabled={loading}
											className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
										>
											キャンセル
										</button>
									</div>
								</form>
							)}
						</>
					)}
				</div>

				{/* JWTトークン表示ボタン */}
				<div className="mb-4">
					<button
						onClick={handleShowJWT}
						disabled={loading}
						className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
					>
						{loading ? "取得中..." : "JWTトークンを取得・表示"}
					</button>
				</div>

				{/* JWT表示エリア */}
				{jwtInfo && (
					<div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
						<h3 className="font-semibold text-gray-800 mb-2">JWT Token:</h3>
						<div className="bg-white p-2 rounded border border-gray-200 mb-3">
							<p className="text-xs font-mono break-all text-gray-600">
								{jwtInfo.token}
							</p>
						</div>

						<h3 className="font-semibold text-gray-800 mb-2">Decoded Header:</h3>
						<pre className="bg-white p-2 rounded border border-gray-200 text-xs overflow-auto mb-3">
							{JSON.stringify(jwtInfo.decoded.header, null, 2)}
						</pre>

						<h3 className="font-semibold text-gray-800 mb-2">Decoded Payload:</h3>
						<pre className="bg-white p-2 rounded border border-gray-200 text-xs overflow-auto">
							{JSON.stringify(jwtInfo.decoded.payload, null, 2)}
						</pre>

						<p className="text-xs text-gray-500 mt-2">
							※ コンソールにも出力されています
						</p>
					</div>
				)}

				{/* テストボタン */}
				<div className="flex gap-4 mb-6">
					<button
						onClick={handleJWTTest}
						disabled={loading}
						className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
					>
						{loading ? "テスト中..." : "JWT認証テスト"}
					</button>
					<button
						onClick={handleAdminTest}
						disabled={loading}
						className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
					>
						{loading ? "テスト中..." : "管理者権限テスト"}
					</button>
				</div>

				{/* 結果表示 */}
				{testResult && (
					<div
						className={`p-4 rounded-xl border ${
							testResult.type === "success"
								? "bg-green-50 border-green-200"
								: "bg-red-50 border-red-200"
						}`}
					>
						<div className="flex items-start gap-3">
							<span className="text-2xl">
								{testResult.type === "success" ? "✅" : "❌"}
							</span>
							<div className="flex-1">
								<p
									className={`font-semibold ${
										testResult.type === "success"
											? "text-green-800"
											: "text-red-800"
									}`}
								>
									{testResult.message}
								</p>
								{testResult.details && (
									<details className="mt-2">
										<summary className="cursor-pointer text-sm text-gray-600">
											詳細を表示
										</summary>
										<pre className="mt-2 text-xs bg-white/50 p-2 rounded overflow-auto">
											{JSON.stringify(testResult.details, null, 2)}
										</pre>
									</details>
								)}
							</div>
						</div>
					</div>
				)}

				{/* 説明 */}
				<div className="mt-6 text-sm text-cyan-700 bg-cyan-50/50 p-4 rounded-lg">
					<p className="font-semibold mb-2">テストの説明:</p>
					<ul className="list-disc list-inside space-y-1">
						<li>
							<strong>JWT認証テスト</strong>: すべてのユーザーがアクセス可能
						</li>
						<li>
							<strong>管理者権限テスト</strong>: 管理者ユーザーのみアクセス可能
						</li>
					</ul>
				</div>
			</div>
		</Layout>
	);
}
