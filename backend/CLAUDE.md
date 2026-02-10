# Auth Demo - Backend

バックエンドAPIサーバーのドキュメント

---

## 📁 フォルダ構成

```
backend/
├── src/
│   ├── controllers/       # リクエストハンドラー
│   │   └── apikey.controller.ts
│   ├── db/               # データベース関連
│   │   ├── index.ts      # DB接続設定
│   │   ├── migrate.ts    # マイグレーション実行
│   │   ├── types.ts      # 型定義
│   │   ├── migrations/   # マイグレーションファイル
│   │   └── repositories/ # データアクセス層
│   │       └── memberRepository.ts
│   ├── dtos/             # データ転送オブジェクト
│   │   ├── apikey.dto.ts
│   │   └── verify-apikey.dto.ts
│   ├── lib/              # ライブラリ・ユーティリティ
│   │   ├── auth.ts       # Better Auth設定
│   │   ├── auth-schemas.ts # スキーマ定義
│   │   └── email.ts      # メール送信
│   ├── repositories/     # リポジトリ層
│   │   └── apikey.repository.ts
│   ├── routes/           # ルーティング定義
│   │   └── apikey.routes.ts
│   ├── services/         # ビジネスロジック層
│   │   └── apikey.service.ts
│   └── index.ts          # エントリーポイント
├── .env                  # 環境変数（ローカル）
├── .env.example          # 環境変数テンプレート
├── Dockerfile            # Dockerイメージ定義
├── package.json          # パッケージ管理
└── tsconfig.json         # TypeScript設定
```

---

## 🛠️ 技術スタック

### ランタイム・言語
- **Bun** - 高速なJavaScriptランタイム
- **TypeScript** (v5.8.3) - 型安全な開発

### フレームワーク・ライブラリ
- **Hono** (v4.11.4) - 高速軽量なWebフレームワーク
- **@hono/zod-openapi** (v1.2.1) - OpenAPIスキーマ生成
- **Zod** (v4.3.6) - スキーマバリデーション

### 認証
- **Better Auth** (v1.4.15) - モダンな認証ライブラリ
- **@better-auth/passkey** (v1.4.16) - パスキー認証プラグイン

### データベース
- **PostgreSQL** - メインデータベース
- **Kysely** (v0.28.10) - 型安全なSQLクエリビルダー
- **pg** (v8.17.1) - PostgreSQLドライバー

### その他
- **Resend** (v6.8.0) - メール送信サービス

---

## 🏗️ アーキテクチャパターン

### レイヤー構造
```
Controller → Service → Repository → Database
     ↓          ↓          ↓
   DTO      Business    Data Access
          Logic Layer    Layer
```

### 責務分離
- **Controllers**: HTTPリクエスト/レスポンスの処理
- **Services**: ビジネスロジックの実装
- **Repositories**: データアクセスの抽象化
- **DTOs**: データ転送とバリデーション

---

## 📝 開発ガイドライン

### コーディング規約

- snake_case: データベースカラム名
- camelCase: TypeScript変数・関数名
- PascalCase: 型・インターフェース名

### TypeScript 実装ルール

#### 1. 型安全とコード品質

- **`any` の原則禁止**:
  - **例外**: `Kysely<any>` はマイグレーションファイルで許可
- **厳格な Null チェック**: `?.` と `??` を活用し、null/undefined エラーを防ぐ
- **Enum より Union Type**: `type Status = "pending" | "success"` を優先
- **Readonly の活用**: 変更不要なオブジェクト・配列には `readonly` を付与

#### 2. 非同期処理とエラーハンドリング

- **Floating Promises の禁止**: `await` 忘れを防ぐ。意図的な場合は `.catch()` で明示
- **Error オブジェクトの統一**: 文字列 throw を禁止。必ず `Error` クラスを使用
- **Try-Catch の境界定義**: コントローラー等の境界で一括キャッチし、適切なレスポンスに変換

#### 3. バリデーションとセキュリティ

- **Zod による型と値の同時保証**: 外部データは必ず Zod でバリデーション
- **環境変数の型定義**: `process.env` を直接参照せず、バリデーション済み config 経由でアクセス
- **秘密情報の隠蔽**: ログ出力時にパスワード、トークン、PII をマスク

#### 4. 設計・アーキテクチャ

- **レイヤードアーキテクチャ**: Controller → Service → Repository の関心分離
- **依存性の注入 (DI)**: 外部モジュールは引数/コンストラクタ経由で受け取る
- **副作用の分離**: DB操作・外部API呼び出しと純粋ロジックを明確に分ける

#### 5. ロギングと保守性

- **構造化ログの出力**: `console.log` を禁止。
- **JSDoc による意図の記述**: 複雑なロジックには「なぜ」を JSDoc で記述

#### 6. 関数型プログラミング（FP）の原則

- **Immutability の徹底**: `let` 禁止、`const` のみ使用。オブジェクト・配列は `...` で新規生成
- **Expressions 優先**: `if-else` より三項演算子・論理演算子（`const status = isAdmin ? "full" : "restricted"`）
- **宣言的なデータ操作**: `for/while` 禁止。`map`, `filter`, `reduce` 等の高階関数を使用
- **副作用の分離**: ビジネスロジックは純粋関数に。DB・API呼び出しは外側の層へ
- **Early Return**: 例外ケースは関数冒頭で `return`/`throw` し、メインロジックをフラットに
- **関数合成**: 複雑な処理は小さな単機能関数を組み合わせて構築
- **1行条件文の簡潔化**: 単一文の条件は中括弧を省略（`if (!session) throw new Error()`）

### ファイル命名規則

- Controllers: `*.controller.ts`
- Services: `*.service.ts`
- Repositories: `*.repository.ts`
- DTOs: `*.dto.ts`
- Routes: `*.routes.ts`

---

## 🔧 スクリプト

```bash
# 開発サーバー起動
bun run dev

# プロダクションビルド
bun run build

# プロダクション実行
bun run start

# Better Authマイグレーション
bun run migrate

# Kyselyマイグレーション
bun run migrate:kysely
```

---

## 🗄️ データベース

### スキーマ管理
- Better Authによる自動マイグレーション
- Kyselyによるカスタムマイグレーション

### 命名規則
- すべてのテーブル・カラムは snake_case
- `auth-schemas.ts` で camelCase → snake_case マッピングを定義

---

## 📚 参考リンク

- [Better Auth Documentation](https://better-auth.com)
- [Hono Documentation](https://hono.dev)
- [Kysely Documentation](https://kysely.dev)
