# Auth Demo OPA - アーキテクチャ概要

Better Auth と Open Policy Agent による、マルチテナント対応 RBAC デモアプリケーション

---

## システム構成

4つのコンポーネントで構成：

1. **Frontend** (`/frontend`) - React管理画面、ポート 5173
2. **Auth MS** (`/backend`) - 認証サービス、ポート 3000
3. **Resource MS** (`/resource-ms`) - リソースAPI、ポート 4001
4. **OPA** (`/opa`) - ポリシーエンジン、ポート 8181

---

## 認証・認可ライブラリ

- **Better Auth** を使用
- **Admin プラグイン**: グローバルロール管理（`admin`, `user`）
- **Organization プラグイン**: 組織ロール管理（`owner`, `admin`, `member`）

---

## ロールの種類

### グローバルロール
- `admin`: サービス全体の管理者
- `user`: 一般ユーザー

### オーガナイゼーションロール
- `owner`: 組織オーナー
- `admin`: 組織管理者
- `member`: 組織メンバー

---

## 責務分離（RBAC）

各コンポーネントの役割：

| コンポーネント | 管理対象 | 役割 |
|--------------|---------|------|
| **Auth MS** | **User ↔ Role** | ユーザーとロールの紐付け、トークン発行 |
| **Resource MS** | **Role ↔ Permission** | ロールからパーミッション変換、OPA連携 |
| **OPA** | **Permission ↔ Endpoint** | エンドポイントに必要な権限の定義と判定 |

### アクセストークンの内容

```json
{
  "userId": "user-id",
  "globalRole": "admin | user",
  "organizationId": "org-id",
  "organizationRole": "owner | admin | member"
}
```

**重要**: トークンには**ロール情報のみ**が含まれ、パーミッション一覧は含まれない

---

## 認可フロー

```
1. Frontend → Resource MS: リクエスト + アクセストークン
2. Resource MS: トークン検証（Auth MSに問い合わせ）
3. Resource MS: ロール → パーミッション変換（permissions.tsで管理）
4. Resource MS → OPA: { permissions, method, path }
5. OPA → Resource MS: { allow: true/false }
6. Resource MS: 判定結果に基づきレスポンス
```

---

## マルチテナンシー

- `organizationId` によるデータ分離
- 全てのクエリに組織IDフィルタを適用
- OPAでクロステナントアクセスをブロック

---

## コーディング規約

### Backend (Auth MS) / Resource MS

**詳細は `backend/CLAUDE.md` を参照**。主要ルール：

- **Immutability**: `const` のみ使用、`let` 禁止
- **関数型プログラミング**: `map`, `filter`, `reduce` を使用、`for/while` 禁止
- **レイヤー構造**: Controller → Service → Repository
- **`any` 禁止**: マイグレーションファイルの `Kysely<any>` のみ例外
- **Early Return**: 例外ケースは関数冒頭で処理
- **副作用の分離**: ビジネスロジックは純粋関数に

---

## 重要ファイル

- `backend/src/lib/auth.ts` - Better Auth設定
- `resource-ms/src/lib/permissions.ts` - ロール→パーミッション変換
- `resource-ms/src/lib/opaClient.ts` - OPA連携クライアント
- `opa/policies/*.rego` - 認可ポリシー定義
