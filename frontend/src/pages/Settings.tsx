import Layout from "../components/Layout";
import { Section, InputField, Button, ErrorMessage, SuccessMessage } from "../components/FormComponents";
import { authClient } from "../lib/auth";
import { useState } from "react";
import QRCode from "react-qr-code";

export default function Settings() {
	const { data: session } = authClient.useSession();
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [passwordSuccess, setPasswordSuccess] = useState("");
	const [passwordLoading, setPasswordLoading] = useState(false);

	// 2FA関連の状態
	const [twoFactorEnabled, setTwoFactorEnabled] = useState(session?.user.twoFactorEnabled || false);
	const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
	const [showDisableForm, setShowDisableForm] = useState(false);
	const [twoFactorPassword, setTwoFactorPassword] = useState("");
	const [disablePassword, setDisablePassword] = useState("");
	const [qrCode, setQrCode] = useState("");
	const [backupCodes, setBackupCodes] = useState<string[]>([]);
	const [verificationCode, setVerificationCode] = useState("");
	const [twoFactorError, setTwoFactorError] = useState("");
	const [twoFactorSuccess, setTwoFactorSuccess] = useState("");
	const [twoFactorLoading, setTwoFactorLoading] = useState(false);

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
			const { error } = await authClient.changePassword({
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

	// 2FA有効化の開始 - enableでTOTP URIを取得
	const handleEnableTwoFactor = async (e: React.FormEvent) => {
		e.preventDefault();
		setTwoFactorError("");
		setTwoFactorLoading(true);

		try {
			const { data, error } = await authClient.twoFactor.enable({
				password: twoFactorPassword,
			});

			if (error) {
				setTwoFactorError(error.message || "2FAの有効化に失敗しました");
			} else if (data) {
				// TOTP URIを保存（QRコードの生成に使用）
				setQrCode(data.totpURI);
				setTwoFactorPassword("");
			}
		} catch (error) {
			setTwoFactorError("2FAの有効化中にエラーが発生しました");
		} finally {
			setTwoFactorLoading(false);
		}
	};

	// 検証コード確認
	const handleVerifyTwoFactor = async (e: React.FormEvent) => {
		e.preventDefault();
		setTwoFactorError("");
		setTwoFactorLoading(true);

		try {
			const { error } = await authClient.twoFactor.verifyTotp({
				code: verificationCode,
			});

			if (error) {
				setTwoFactorError(error.message || "コードの検証に失敗しました");
			} else {
				setTwoFactorSuccess("2要素認証が有効になりました");
				setTwoFactorEnabled(true);
				setShowTwoFactorSetup(false);
				setQrCode("");
				setBackupCodes([]);
				setVerificationCode("");
				setTimeout(() => setTwoFactorSuccess(""), 5000);
			}
		} catch (error) {
			setTwoFactorError("コードの検証中にエラーが発生しました");
		} finally {
			setTwoFactorLoading(false);
		}
	};

	// 2FA無効化
	const handleDisableTwoFactor = async (e: React.FormEvent) => {
		e.preventDefault();
		setTwoFactorError("");
		setTwoFactorLoading(true);

		try {
			const { error } = await authClient.twoFactor.disable({
				password: disablePassword,
			});

			if (error) {
				setTwoFactorError(error.message || "2FAの無効化に失敗しました");
			} else {
				setTwoFactorSuccess("2要素認証が無効になりました");
				setTwoFactorEnabled(false);
				setShowDisableForm(false);
				setDisablePassword("");
				setTimeout(() => setTwoFactorSuccess(""), 5000);
			}
		} catch (error) {
			setTwoFactorError("2FAの無効化中にエラーが発生しました");
		} finally {
			setTwoFactorLoading(false);
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

        {/* Two-Factor Authentication */}
        <Section title="Two-Factor Authentication">
          <div className="space-y-4">
            {twoFactorError && <ErrorMessage message={twoFactorError} />}
            {twoFactorSuccess && <SuccessMessage>{twoFactorSuccess}</SuccessMessage>}

            {/* 2FAが無効の場合 */}
            {!twoFactorEnabled && !qrCode && (
              <div className="space-y-4">
                <div className="p-4 bg-white/30 rounded-xl">
                  <p className="text-sm text-cyan-900 mb-4">
                    2要素認証を有効にすると、ログイン時にAuthenticatorアプリで生成されたコードの入力が必要になります。
                  </p>
                  {!showTwoFactorSetup ? (
                    <Button onClick={() => setShowTwoFactorSetup(true)}>
                      2要素認証を有効にする
                    </Button>
                  ) : (
                    <form onSubmit={handleEnableTwoFactor} className="space-y-4">
                      <InputField
                        label="パスワードを入力してください"
                        type="password"
                        value={twoFactorPassword}
                        onChange={setTwoFactorPassword}
                        required
                      />
                      <div className="flex gap-2">
                        <Button type="submit" disabled={twoFactorLoading}>
                          {twoFactorLoading ? "処理中..." : "次へ"}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setShowTwoFactorSetup(false);
                            setTwoFactorPassword("");
                            setTwoFactorError("");
                          }}
                        >
                          キャンセル
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* QRコード表示 */}
            {qrCode && !twoFactorEnabled && (
              <div className="space-y-4">
                <div className="p-4 bg-white/30 rounded-xl">
                  <p className="font-medium text-cyan-900 mb-2">ステップ1: QRコードをスキャン</p>
                  <p className="text-sm text-cyan-800 mb-4">
                    Google AuthenticatorやAuthyなどのAuthenticatorアプリで以下のQRコードをスキャンしてください。
                  </p>
                  <div className="flex justify-center mb-4 p-4 bg-white rounded-xl">
                    <QRCode value={qrCode} size={200} />
                  </div>
                </div>

                {/* バックアップコード */}
                {backupCodes.length > 0 && (
                  <div className="p-4 bg-white/30 rounded-xl">
                    <p className="font-medium text-cyan-900 mb-2">ステップ2: バックアップコードを保存</p>
                    <p className="text-sm text-cyan-800 mb-4">
                      以下のバックアップコードを安全な場所に保存してください。デバイスを紛失した場合、これらのコードでログインできます。
                    </p>
                    <div className="grid grid-cols-2 gap-2 p-4 bg-cyan-900/10 rounded-lg font-mono text-sm">
                      {backupCodes.map((code, index) => (
                        <div key={index} className="text-cyan-900">
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 検証コード入力 */}
                <div className="p-4 bg-white/30 rounded-xl">
                  <p className="font-medium text-cyan-900 mb-2">ステップ{backupCodes.length > 0 ? '3' : '2'}: 認証コードを入力</p>
                  <p className="text-sm text-cyan-800 mb-4">
                    Authenticatorアプリに表示されている6桁のコードを入力してください。
                  </p>
                  <form onSubmit={handleVerifyTwoFactor} className="space-y-4">
                    <InputField
                      label="6桁の認証コード"
                      type="text"
                      value={verificationCode}
                      onChange={setVerificationCode}
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                    <Button type="submit" disabled={twoFactorLoading}>
                      {twoFactorLoading ? "検証中..." : "確認して有効化"}
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* 2FAが有効の場合 */}
            {twoFactorEnabled && (
              <div className="space-y-4">
                <div className="p-4 bg-white/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-cyan-900 mb-1">2要素認証が有効です</p>
                      <p className="text-sm text-cyan-800">
                        アカウントは2要素認証で保護されています
                      </p>
                    </div>
                    {!showDisableForm && (
                      <Button
                        variant="danger"
                        onClick={() => setShowDisableForm(true)}
                        disabled={twoFactorLoading}
                      >
                        無効にする
                      </Button>
                    )}
                  </div>
                </div>

                {/* 無効化フォーム */}
                {showDisableForm && (
                  <div className="p-4 bg-red-50/40 rounded-xl border border-red-200">
                    <p className="font-medium text-red-900 mb-2">2要素認証を無効化</p>
                    <p className="text-sm text-red-800 mb-4">
                      警告: 2要素認証を無効にすると、アカウントのセキュリティが低下します。
                      続行するにはパスワードを入力してください。
                    </p>
                    <form onSubmit={handleDisableTwoFactor} className="space-y-4">
                      <InputField
                        label="パスワード"
                        type="password"
                        value={disablePassword}
                        onChange={setDisablePassword}
                        required
                      />
                      <div className="flex gap-2">
                        <Button type="submit" variant="danger" disabled={twoFactorLoading}>
                          {twoFactorLoading ? "無効化中..." : "2FAを無効化"}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setShowDisableForm(false);
                            setDisablePassword("");
                            setTwoFactorError("");
                          }}
                        >
                          キャンセル
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
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
