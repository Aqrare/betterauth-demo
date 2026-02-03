import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { authClient } from "../lib/auth";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  banned: boolean;
}

export default function UserManagement() {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin権限チェック
  useEffect(() => {
    if (session && session.user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  // ユーザー一覧を取得
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authClient.admin.listUsers({
        limit: 100,
      });
      if (result.error) {
        setError(result.error.message || "Failed to fetch users");
      } else if (result.data) {
        setUsers(result.data.users);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ユーザーをBan
  const handleBanUser = async (userId: string) => {
    if (!confirm("このユーザーをBANしますか？")) return;

    try {
      const result = await authClient.admin.banUser({
        userId,
      });
      if (result.error) {
        alert(`Error: ${result.error.message}`);
      } else {
        alert("ユーザーをBANしました");
        fetchUsers();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    }
  };

  // ユーザーのBanを解除
  const handleUnbanUser = async (userId: string) => {
    if (!confirm("このユーザーのBANを解除しますか？")) return;

    try {
      const result = await authClient.admin.unbanUser({
        userId,
      });
      if (result.error) {
        alert(`Error: ${result.error.message}`);
      } else {
        alert("BANを解除しました");
        fetchUsers();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    }
  };

  // ユーザー削除
  const handleRemoveUser = async (userId: string, email: string) => {
    if (
      !confirm(
        `ユーザー ${email} を完全に削除しますか？この操作は取り消せません。`,
      )
    )
      return;

    try {
      const result = await authClient.admin.removeUser({
        userId,
      });
      if (result.error) {
        alert(`Error: ${result.error.message}`);
      } else {
        alert("ユーザーを削除しました");
        fetchUsers();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    }
  };

  if (session?.user.role !== "admin") {
    return null;
  }

  return (
    <Layout title="ユーザー管理" subtitle="Admin専用 - すべてのユーザーを管理">
      <div className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-cyan-900">ユーザー一覧</h2>
          <button
            onClick={fetchUsers}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            更新
          </button>
        </div>

        {loading && <p className="text-cyan-700">読み込み中...</p>}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-200">
                  <th className="text-left py-3 px-4 text-cyan-900 font-semibold">
                    名前
                  </th>
                  <th className="text-left py-3 px-4 text-cyan-900 font-semibold">
                    メール
                  </th>
                  <th className="text-left py-3 px-4 text-cyan-900 font-semibold">
                    ロール
                  </th>
                  <th className="text-left py-3 px-4 text-cyan-900 font-semibold">
                    登録日
                  </th>
                  <th className="text-left py-3 px-4 text-cyan-900 font-semibold">
                    ステータス
                  </th>
                  <th className="text-left py-3 px-4 text-cyan-900 font-semibold">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-cyan-100 hover:bg-white/30"
                  >
                    <td className="py-3 px-4 text-cyan-800">{user.name}</td>
                    <td className="py-3 px-4 text-cyan-800">{user.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-cyan-800">
                      {new Date(user.createdAt).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.banned
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.banned ? "BAN" : "アクティブ"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {user.banned ? (
                          <button
                            onClick={() => handleUnbanUser(user.id)}
                            className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                          >
                            BAN解除
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBanUser(user.id)}
                            className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
                          >
                            BAN
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveUser(user.id, user.email)}
                          className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                        >
                          削除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="text-center text-cyan-600 py-8">
                ユーザーが見つかりません
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
