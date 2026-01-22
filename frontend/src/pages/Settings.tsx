import Layout from "../components/Layout";
import { Section, InputField, Button, ErrorMessage, SuccessMessage } from "../components/FormComponents";
import { authClient } from "../lib/auth";
import { useState, useEffect } from "react";
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
	const [showRegenerateForm, setShowRegenerateForm] = useState(false);
	const [twoFactorPassword, setTwoFactorPassword] = useState("");
	const [disablePassword, setDisablePassword] = useState("");
	const [regeneratePassword, setRegeneratePassword] = useState("");
	const [qrCode, setQrCode] = useState("");
	const [backupCodes, setBackupCodes] = useState<string[]>([]);
	const [verificationCode, setVerificationCode] = useState("");
	const [twoFactorError, setTwoFactorError] = useState("");
	const [twoFactorSuccess, setTwoFactorSuccess] = useState("");
	const [twoFactorLoading, setTwoFactorLoading] = useState(false);
	const [backupCodesCopied, setBackupCodesCopied] = useState(false);

	// Passkey関連の状態
	const [showAddPasskeyForm, setShowAddPasskeyForm] = useState(false);
	const [passkeyName, setPasskeyName] = useState("");
	const [passkeyTwoFactorCode, setPasskeyTwoFactorCode] = useState("");
	const [passkeyError, setPasskeyError] = useState("");
	const [passkeySuccess, setPasskeySuccess] = useState("");
	const [passkeyLoading, setPasskeyLoading] = useState(false);
	const [passkeys, setPasskeys] = useState<any[]>([]);
	const [passkeyListLoading, setPasskeyListLoading] = useState(false);
	const [editingPasskeyId, setEditingPasskeyId] = useState<string | null>(null);
	const [editingPasskeyName, setEditingPasskeyName] = useState("");
	const [deletingPasskeyId, setDeletingPasskeyId] = useState<string | null>(null);
	const [deleteTwoFactorCode, setDeleteTwoFactorCode] = useState("");

	// パスキー一覧を取得
	const fetchPasskeys = async () => {
		setPasskeyListLoading(true);
		try {
			const { data, error } = await authClient.passkey.listUserPasskeys();
			if (data) {
				setPasskeys(data);
			}
		} catch (error) {
			console.error("Failed to fetch passkeys:", error);
		} finally {
			setPasskeyListLoading(false);
		}
	};

	// パスワード設定用の状態（OAuthユーザー向け）
	const [passwordEmailSent, setPasswordEmailSent] = useState(false);
	const [passwordSetupError, setPasswordSetupError] = useState("");
	const [passwordSetupLoading, setPasswordSetupLoading] = useState(false);

	// アカウント情報の状態
	const [hasCredential, setHasCredential] = useState<boolean>(false);
	const [hasGoogleLinked, setHasGoogleLinked] = useState<boolean>(false);
	const [accountsLoading, setAccountsLoading] = useState<boolean>(true);

	// バックエンドからアカウント情報を取得
	useEffect(() => {
		const fetchAccounts = async () => {
			if (!session?.user) {
				setAccountsLoading(false);
				return;
			}

			try {
				const response = await fetch('http://localhost:3000/api/user/accounts', {
					credentials: 'include',
				});

				if (response.ok) {
					const data = await response.json();
					const accounts = data.accounts || [];

					setHasCredential(accounts.some((account: any) => account.providerId === 'credential'));
					setHasGoogleLinked(accounts.some((account: any) => account.providerId === 'google'));
				}
			} catch (error) {
				console.error('Failed to fetch accounts:', error);
			} finally {
				setAccountsLoading(false);
			}
		};

		fetchAccounts();
	}, [session]);

	// アカウントリンク関連の状態
	const [accountLinkError, setAccountLinkError] = useState("");
	const [accountLinkSuccess, setAccountLinkSuccess] = useState("");
	const [accountLinkLoading, setAccountLinkLoading] = useState(false);
	const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false);

	useEffect(() => {
		fetchPasskeys();
	}, []);

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
				// バックアップコードを保存
				if (data.backupCodes) {
					setBackupCodes(data.backupCodes);
				}
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

	// バックアップコードをコピー
	const handleCopyBackupCodes = () => {
		const codesText = backupCodes.join("\n");
		navigator.clipboard.writeText(codesText).then(() => {
			setBackupCodesCopied(true);
			setTimeout(() => setBackupCodesCopied(false), 3000);
		});
	};

	// バックアップコードをダウンロード
	const handleDownloadBackupCodes = () => {
		const codesText = backupCodes.join("\n");
		const blob = new Blob([codesText], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "backup-codes.txt";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	// バックアップコードを再生成
	const handleRegenerateBackupCodes = async (e: React.FormEvent) => {
		e.preventDefault();
		setTwoFactorError("");
		setTwoFactorLoading(true);

		try {
			const { data, error } = await authClient.twoFactor.generateBackupCodes({
				password: regeneratePassword,
			});

			if (error) {
				setTwoFactorError(error.message || "バックアップコードの生成に失敗しました");
			} else if (data) {
				setBackupCodes(data.backupCodes);
				setTwoFactorSuccess("新しいバックアップコードを生成しました。古いコードは無効になりました。");
				setRegeneratePassword("");
				setShowRegenerateForm(false);
				setTimeout(() => setTwoFactorSuccess(""), 5000);
			}
		} catch (error) {
			setTwoFactorError("バックアップコードの生成中にエラーが発生しました");
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

	// パスキー名を更新
	const handleUpdatePasskey = async (passkeyId: string) => {
		if (!editingPasskeyName.trim()) {
			setPasskeyError("パスキー名を入力してください");
			return;
		}

		setPasskeyError("");
		setPasskeyLoading(true);

		try {
			const { error } = await authClient.passkey.updatePasskey({
				id: passkeyId,
				name: editingPasskeyName,
			});

			if (error) {
				setPasskeyError(error.message || "パスキー名の更新に失敗しました");
			} else {
				setPasskeySuccess("パスキー名を更新しました");
				setEditingPasskeyId(null);
				setEditingPasskeyName("");
				await fetchPasskeys(); // パスキー一覧を再取得
				setTimeout(() => setPasskeySuccess(""), 5000);
			}
		} catch (error) {
			setPasskeyError("パスキー名の更新中にエラーが発生しました");
		} finally {
			setPasskeyLoading(false);
		}
	};

	// パスキー削除の確認
	const handleDeletePasskeyClick = (passkeyId: string) => {
		setDeletingPasskeyId(passkeyId);
		setDeleteTwoFactorCode("");
		setPasskeyError("");
	};

	// パスキーを削除
	const handleDeletePasskey = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!deletingPasskeyId) {
			return;
		}

		setPasskeyError("");
		setPasskeyLoading(true);

		try {
			// 2FAが有効な場合は先に検証
			if (twoFactorEnabled) {
				if (!deleteTwoFactorCode) {
					setPasskeyError("2FAコードを入力してください");
					setPasskeyLoading(false);
					return;
				}

				const { error: verifyError } = await authClient.twoFactor.verifyTotp({
					code: deleteTwoFactorCode,
				});

				if (verifyError) {
					setPasskeyError(verifyError.message || "2FAコードの検証に失敗しました");
					setPasskeyLoading(false);
					return;
				}
			}

			// パスキーを削除
			const { error } = await authClient.passkey.deletePasskey({
				id: deletingPasskeyId,
			});

			if (error) {
				setPasskeyError(error.message || "パスキーの削除に失敗しました");
			} else {
				setPasskeySuccess("パスキーを削除しました");
				setDeletingPasskeyId(null);
				setDeleteTwoFactorCode("");
				await fetchPasskeys(); // パスキー一覧を再取得
				setTimeout(() => setPasskeySuccess(""), 5000);
			}
		} catch (error) {
			setPasskeyError("パスキーの削除中にエラーが発生しました");
		} finally {
			setPasskeyLoading(false);
		}
	};

	// パスキーを追加
	const handleAddPasskey = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasskeyError("");
		setPasskeyLoading(true);

		try {
			// 2FAが有効な場合は先に検証
			if (twoFactorEnabled) {
				if (!passkeyTwoFactorCode) {
					setPasskeyError("2FAコードを入力してください");
					setPasskeyLoading(false);
					return;
				}

				const { error: verifyError } = await authClient.twoFactor.verifyTotp({
					code: passkeyTwoFactorCode,
				});

				if (verifyError) {
					setPasskeyError(verifyError.message || "2FAコードの検証に失敗しました");
					setPasskeyLoading(false);
					return;
				}
			}

			// パスキーを登録
			const { error } = await authClient.passkey.addPasskey({
				name: passkeyName || undefined,
			});

			if (error) {
				setPasskeyError(error.message || "パスキーの登録に失敗しました");
			} else {
				setPasskeySuccess("パスキーを登録しました");
				setShowAddPasskeyForm(false);
				setPasskeyName("");
				setPasskeyTwoFactorCode("");
				await fetchPasskeys(); // パスキー一覧を再取得
				setTimeout(() => setPasskeySuccess(""), 5000);
			}
		} catch (error) {
			setPasskeyError("パスキーの登録中にエラーが発生しました");
		} finally {
			setPasskeyLoading(false);
		}
	};

	// パスワード設定用メールを送信（OAuthユーザー向け）
	const handleRequestSetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordSetupError("");
		setPasswordSetupLoading(true);

		try {
			// forgetPassword APIを使用してパスワード設定用メールを送信
			const { error } = await authClient.requestPasswordReset({
        email: session?.user.email || "",
        redirectTo: `${window.location.origin}/set-password`,
      });

			if (error) {
				setPasswordSetupError(error.message || "メールの送信に失敗しました");
			} else {
				setPasswordEmailSent(true);
				setTimeout(() => setPasswordEmailSent(false), 30000); // 30秒後にメッセージを消す
			}
		} catch (error) {
			setPasswordSetupError("エラーが発生しました");
		} finally {
			setPasswordSetupLoading(false);
		}
	};

	// Googleアカウントを連携
	const handleLinkGoogle = async () => {
		setAccountLinkError("");
		setAccountLinkLoading(true);

		try {
			await authClient.linkSocial({
				provider: "google",
				callbackURL: window.location.href, // 現在のページに戻る
			});
		} catch (error) {
			console.error("Link Google error:", error);
			setAccountLinkError("Google連携中にエラーが発生しました");
			setAccountLinkLoading(false);
		}
	};

	// Googleアカウントの連携を解除
	const handleUnlinkGoogle = async () => {
		setAccountLinkError("");
		setAccountLinkLoading(true);

		try {
			const { error } = await authClient.unlinkAccount({
				providerId: "google",
			});

			if (error) {
				setAccountLinkError(error.message || "連携解除に失敗しました");
			} else {
				setAccountLinkSuccess("Googleアカウントの連携を解除しました");
				setShowUnlinkConfirm(false);
				// ページをリロードしてセッション情報を更新
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			}
		} catch (error) {
			console.error("Unlink Google error:", error);
			setAccountLinkError("連携解除中にエラーが発生しました");
		} finally {
			setAccountLinkLoading(false);
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

        {/* Password Settings - OAuthユーザー向けパスワード設定 */}
        {!hasCredential ? (
          <Section title="パスワードの設定">
            <div className="space-y-4">
              {passwordEmailSent ? (
                <div className="p-4 bg-green-50/60 rounded-xl border border-green-300">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium text-green-900 mb-1">メールを送信しました</p>
                      <p className="text-sm text-green-800">
                        パスワード設定用のリンクをメールで送信しました。
                        メール内のリンクをクリックして、パスワードを設定してください。
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-amber-50/60 rounded-xl border-2 border-amber-300">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-bold text-amber-900 mb-1">パスワードが設定されていません</p>
                        <p className="text-sm text-amber-800 mb-2">
                          現在、OAuth（Google）でログインしています。
                          2要素認証やパスキーを利用するには、パスワードの設定が必要です。
                        </p>
                      </div>
                    </div>
                  </div>

                  {passwordSetupError && <ErrorMessage message={passwordSetupError} />}

                  <form onSubmit={handleRequestSetPassword} className="space-y-4">
                    <div className="p-4 bg-white/30 rounded-xl">
                      <p className="text-sm text-cyan-900 mb-3">
                        パスワード設定用のリンクを以下のメールアドレスに送信します。
                      </p>
                      <InputField
                        label="メールアドレス"
                        type="email"
                        value={session?.user.email || ""}
                        disabled
                        monospace
                      />
                    </div>
                    <Button type="submit" disabled={passwordSetupLoading}>
                      {passwordSetupLoading ? "送信中..." : "パスワード設定用メールを送信"}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </Section>
        ) : (
          // 既存のPassword Settingsセクション（Credentialアカウントがある場合のみ表示）
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
        )}

        {/* Two-Factor Authentication */}
        <Section title="Two-Factor Authentication">
          <div className="space-y-4">
            {twoFactorError && <ErrorMessage message={twoFactorError} />}
            {twoFactorSuccess && <SuccessMessage>{twoFactorSuccess}</SuccessMessage>}

            {/* Credentialアカウントがない場合の警告 */}
            {!hasCredential && (
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-300">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-amber-900 mb-1">パスワードの設定が必要です</p>
                    <p className="text-sm text-amber-800">
                      2要素認証を有効にするには、先にパスワードを設定してください。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2FAが無効の場合 */}
            {!twoFactorEnabled && !qrCode && (
              <div className="space-y-4">
                <div className="p-4 bg-white/30 rounded-xl">
                  <p className="text-sm text-cyan-900 mb-4">
                    2要素認証を有効にすると、ログイン時にAuthenticatorアプリで生成されたコードの入力が必要になります。
                  </p>
                  {!showTwoFactorSetup ? (
                    <Button onClick={() => setShowTwoFactorSetup(true)} disabled={!hasCredential}>
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
                  <div className="p-4 bg-amber-50/60 rounded-xl border-2 border-amber-300">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="mt-0.5">
                        <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-amber-900 mb-1">重要: バックアップコードを保存してください</p>
                        <p className="text-sm text-amber-800 mb-3">
                          これらのコードは一度しか表示されません。デバイスを紛失した場合、これらのコードでログインできます。
                          安全な場所に保管してください。
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-4 bg-white/80 rounded-lg font-mono text-sm mb-4 border border-amber-200">
                      {backupCodes.map((code, index) => (
                        <div key={index} className="text-cyan-900 py-1">
                          {code}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleCopyBackupCodes} variant="primary">
                        {backupCodesCopied ? "コピーしました ✓" : "コピー"}
                      </Button>
                      <Button onClick={handleDownloadBackupCodes} variant="secondary">
                        ダウンロード
                      </Button>
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

                {/* バックアップコード表示・再生成 */}
                {!showDisableForm && !showRegenerateForm && backupCodes.length === 0 && (
                  <div className="p-4 bg-white/30 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-cyan-900 mb-1">バックアップコード</p>
                        <p className="text-sm text-cyan-800">
                          デバイスにアクセスできない場合に使用できるバックアップコードを生成
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowRegenerateForm(true)}
                        disabled={twoFactorLoading}
                      >
                        生成
                      </Button>
                    </div>
                  </div>
                )}

                {/* バックアップコードが既に存在する場合 */}
                {!showDisableForm && !showRegenerateForm && backupCodes.length > 0 && (
                  <div className="p-4 bg-white/30 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium text-cyan-900 mb-1">バックアップコード</p>
                        <p className="text-sm text-cyan-800">
                          新しいコードを生成すると、古いコードは無効になります
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowRegenerateForm(true)}
                        disabled={twoFactorLoading}
                      >
                        再生成
                      </Button>
                    </div>

                    {/* 生成されたバックアップコードを表示 */}
                    <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-300">
                      <p className="font-medium text-amber-900 mb-2 text-sm">
                        現在のバックアップコード
                      </p>
                      <div className="grid grid-cols-2 gap-2 p-3 bg-white/80 rounded-lg font-mono text-xs mb-3 border border-amber-200">
                        {backupCodes.map((code, index) => (
                          <div key={index} className="text-cyan-900 py-0.5">
                            {code}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleCopyBackupCodes} variant="secondary">
                          {backupCodesCopied ? "コピーしました ✓" : "コピー"}
                        </Button>
                        <Button onClick={handleDownloadBackupCodes} variant="secondary">
                          ダウンロード
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* バックアップコード再生成フォーム */}
                {showRegenerateForm && (
                  <div className="p-4 bg-white/30 rounded-xl">
                    <p className="font-medium text-cyan-900 mb-2">バックアップコードを生成</p>
                    <p className="text-sm text-cyan-800 mb-4">
                      {backupCodes.length > 0
                        ? "新しいバックアップコードを生成します。古いコードは無効になります。"
                        : "デバイスにアクセスできない場合に使用できるバックアップコードを生成します。"}
                      パスワードを入力してください。
                    </p>
                    <form onSubmit={handleRegenerateBackupCodes} className="space-y-4">
                      <InputField
                        label="パスワード"
                        type="password"
                        value={regeneratePassword}
                        onChange={setRegeneratePassword}
                        required
                      />
                      <div className="flex gap-2">
                        <Button type="submit" disabled={twoFactorLoading}>
                          {twoFactorLoading ? "生成中..." : "バックアップコードを生成"}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setShowRegenerateForm(false);
                            setRegeneratePassword("");
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

        {/* Passkey Section */}
        <Section title="Passkey">
          <div className="space-y-4">
            {passkeyError && <ErrorMessage message={passkeyError} />}
            {passkeySuccess && <SuccessMessage>{passkeySuccess}</SuccessMessage>}

            <div className="p-4 bg-white/30 rounded-xl">
              <div className="mb-4">
                <p className="text-sm text-cyan-900 mb-2">
                  パスキーは、パスワードの代わりに使用できる安全な認証方法です。
                  生体認証やPIN、セキュリティキーを使用してログインできます。
                </p>
              </div>

              {!showAddPasskeyForm ? (
                <Button onClick={() => setShowAddPasskeyForm(true)}>
                  パスキーを追加
                </Button>
              ) : (
                <form onSubmit={handleAddPasskey} className="space-y-4">
                  <InputField
                    label="パスキー名（オプション）"
                    type="text"
                    value={passkeyName}
                    onChange={setPasskeyName}
                    placeholder="例: MacBook Pro, iPhone"
                  />
                  {twoFactorEnabled && (
                    <InputField
                      label="2FA認証コード"
                      type="text"
                      value={passkeyTwoFactorCode}
                      onChange={setPasskeyTwoFactorCode}
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  )}
                  <div className="flex gap-2">
                    <Button type="submit" disabled={passkeyLoading}>
                      {passkeyLoading ? "登録中..." : "パスキーを登録"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowAddPasskeyForm(false);
                        setPasskeyName("");
                        setPasskeyTwoFactorCode("");
                        setPasskeyError("");
                      }}
                    >
                      キャンセル
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* 登録済みパスキー一覧 */}
            {passkeyListLoading ? (
              <div className="p-4 bg-white/30 rounded-xl text-center text-cyan-800">
                読み込み中...
              </div>
            ) : passkeys.length > 0 ? (
              <div className="p-4 bg-white/30 rounded-xl">
                <p className="font-medium text-cyan-900 mb-3">登録済みパスキー</p>
                <div className="space-y-2">
                  {passkeys.map((passkey) => (
                    <div
                      key={passkey.id}
                      className="p-3 bg-white/40 rounded-lg"
                    >
                      {editingPasskeyId === passkey.id ? (
                        // 編集モード
                        <div className="space-y-3">
                          <InputField
                            label="パスキー名"
                            type="text"
                            value={editingPasskeyName}
                            onChange={setEditingPasskeyName}
                            placeholder="例: MacBook Pro, iPhone"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleUpdatePasskey(passkey.id)}
                              disabled={passkeyLoading}
                            >
                              {passkeyLoading ? "更新中..." : "保存"}
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => {
                                setEditingPasskeyId(null);
                                setEditingPasskeyName("");
                                setPasskeyError("");
                              }}
                            >
                              キャンセル
                            </Button>
                          </div>
                        </div>
                      ) : deletingPasskeyId === passkey.id ? (
                        // 削除確認モード
                        <div className="space-y-3">
                          <div className="p-3 bg-red-50/60 rounded-lg border border-red-200">
                            <p className="font-medium text-red-900 mb-2">パスキーの削除</p>
                            <p className="text-sm text-red-800 mb-3">
                              「{passkey.name || "名前なし"}」を削除してもよろしいですか？
                            </p>
                            <form onSubmit={handleDeletePasskey} className="space-y-3">
                              {twoFactorEnabled && (
                                <InputField
                                  label="2FA認証コード"
                                  type="text"
                                  value={deleteTwoFactorCode}
                                  onChange={setDeleteTwoFactorCode}
                                  placeholder="000000"
                                  maxLength={6}
                                  required
                                />
                              )}
                              <div className="flex gap-2">
                                <Button type="submit" variant="danger" disabled={passkeyLoading}>
                                  {passkeyLoading ? "削除中..." : "削除"}
                                </Button>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  onClick={() => {
                                    setDeletingPasskeyId(null);
                                    setDeleteTwoFactorCode("");
                                    setPasskeyError("");
                                  }}
                                >
                                  キャンセル
                                </Button>
                              </div>
                            </form>
                          </div>
                        </div>
                      ) : (
                        // 通常表示モード
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-cyan-900">{passkey.name || "名前なし"}</p>
                            <p className="text-xs text-cyan-700">
                              作成日: {new Date(passkey.createdAt).toLocaleDateString('ja-JP')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-800 rounded">
                              {passkey.deviceType}
                            </span>
                            <button
                              onClick={() => {
                                setEditingPasskeyId(passkey.id);
                                setEditingPasskeyName(passkey.name || "");
                                setPasskeyError("");
                              }}
                              disabled={passkeyLoading}
                              className="text-cyan-600 hover:text-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                              title="編集"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeletePasskeyClick(passkey.id)}
                              disabled={passkeyLoading}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                              title="削除"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              !showAddPasskeyForm && (
                <div className="p-4 bg-white/30 rounded-xl text-center text-cyan-800 text-sm">
                  登録済みのパスキーはありません
                </div>
              )
            )}
          </div>
        </Section>

        {/* Account Linking - Google連携 */}
        <Section title="Account Linking">
          <div className="space-y-4">
            {accountLinkError && <ErrorMessage message={accountLinkError} />}
            {accountLinkSuccess && <SuccessMessage>{accountLinkSuccess}</SuccessMessage>}

            <div className="p-4 bg-white/30 rounded-xl">
              <div className="mb-4">
                <p className="text-sm text-cyan-900 mb-2">
                  外部アカウント（Google）を連携すると、複数の方法でログインできるようになります。
                </p>
              </div>

              {hasGoogleLinked ? (
                // Google連携済みの場合
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/40 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-cyan-900">Google</p>
                        <p className="text-xs text-cyan-700">連携済み</p>
                      </div>
                    </div>
                    {!showUnlinkConfirm && (
                      <Button
                        variant="secondary"
                        onClick={() => setShowUnlinkConfirm(true)}
                        disabled={accountLinkLoading}
                      >
                        連携解除
                      </Button>
                    )}
                  </div>

                  {/* 連携解除確認 */}
                  {showUnlinkConfirm && (
                    <div className="p-4 bg-red-50/40 rounded-xl border border-red-200">
                      <p className="font-medium text-red-900 mb-2">Google連携を解除</p>
                      <p className="text-sm text-red-800 mb-4">
                        Googleアカウントの連携を解除してもよろしいですか？
                        {!hasCredential && " 解除後、パスワードでのログインが必要になります。"}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="danger"
                          onClick={handleUnlinkGoogle}
                          disabled={accountLinkLoading || !hasCredential}
                        >
                          {accountLinkLoading ? "解除中..." : "連携を解除"}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setShowUnlinkConfirm(false);
                            setAccountLinkError("");
                          }}
                          disabled={accountLinkLoading}
                        >
                          キャンセル
                        </Button>
                      </div>
                      {!hasCredential && (
                        <p className="text-xs text-red-700 mt-3">
                          ※ パスワードが設定されていないため、連携解除できません。先にパスワードを設定してください。
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                // Google未連携の場合
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/40 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-cyan-900">Google</p>
                        <p className="text-xs text-cyan-700">未連携</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleLinkGoogle}
                      disabled={accountLinkLoading}
                    >
                      {accountLinkLoading ? "連携中..." : "連携する"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
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
