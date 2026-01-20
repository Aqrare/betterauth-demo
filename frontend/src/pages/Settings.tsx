import Layout from "../components/Layout";
import { Section, InputField, Toggle, Button, ErrorMessage, SuccessMessage } from "../components/FormComponents";
import { authClient } from "../lib/auth";
import { useState } from "react";

export default function Settings() {
	const { data: session } = authClient.useSession();
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [passwordSuccess, setPasswordSuccess] = useState("");
	const [passwordLoading, setPasswordLoading] = useState(false);

	const handlePasswordChange = async (e: React.FormEvent) => {
		e.preventDefault();

		// バリデーション
		if (newPassword !== confirmPassword) {
			setPasswordError("新しいパスワードが一致しません");
			return;
		}

		if (newPassword.length < 8) {
			setPasswordError("パスワードは8文字以上である必要があります");
			return;
		}

		setPasswordError("");
		setPasswordSuccess("");
		setPasswordLoading(true);

		try {
			const { data, error } = await authClient.changePassword({
				newPassword,
				currentPassword,
				revokeOtherSessions: true,
			});

			if (error) {
				setPasswordError(error.message || "パスワードの変更に失敗しました");
			} else {
				setPasswordSuccess("パスワードを変更しました");
				// フォームをクリア
				setCurrentPassword("");
				setNewPassword("");
				setConfirmPassword("");
				// 5秒後にサクセスメッセージを消す
				setTimeout(() => setPasswordSuccess(""), 5000);
			}
		} catch (error) {
			setPasswordError("パスワードの変更中にエラーが発生しました");
		} finally {
			setPasswordLoading(false);
		}
	};

	return (
    <Layout title="Settings" subtitle="Manage your account settings">
      <div className="max-w-4xl space-y-6">
        {/* Profile Settings */}
        <Section title="Profile Information">
          <div className="space-y-4">
            <InputField
              label="User ID"
              value={session?.user.id}
              disabled
              monospace
            />
            <InputField label="Name" value={session?.user.name} disabled />
            <InputField
              label="Email"
              type="email"
              value={session?.user.email}
              disabled
            />
          </div>
        </Section>

        {/* Password Settings */}
        <Section title="Password">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordError && <ErrorMessage message={passwordError} />}
            {passwordSuccess && <SuccessMessage>{passwordSuccess}</SuccessMessage>}

            <InputField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <InputField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
            />
            <InputField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Section>

        {/* Account Settings */}
        <Section title="Account">
          <div className="space-y-4">
            <Toggle
              label="Two-Factor Authentication"
              description="Add an extra layer of security"
            />
          </div>
        </Section>

        {/* Danger Zone */}
        <Section title="Danger Zone" variant="danger">
          <div className="space-y-4">
            <div className="p-4 bg-white/30 rounded-xl">
              <p className="font-medium text-red-900 mb-2">Delete Account</p>
              <p className="text-sm text-red-800 mb-4">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <Button variant="danger">Delete Account</Button>
            </div>
          </div>
        </Section>
      </div>
    </Layout>
  );
}
