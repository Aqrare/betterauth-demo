# OPA (Open Policy Agent) Configuration

このディレクトリにはOPAの設定とポリシーファイルが含まれます。

## ディレクトリ構造

```
opa/
├── policies/          # Regoポリシーファイル
│   └── example.rego   # サンプルポリシー
├── data/             # JSONデータファイル
└── README.md         # このファイル
```

## OPAについて

Open Policy Agent (OPA)は、統一されたポリシー管理を提供するオープンソースのポリシーエンジンです。

### 主な機能
- 宣言的なポリシー言語（Rego）
- REST API経由でのポリシー評価
- リアルタイムでのポリシー更新
- マイクロサービスアーキテクチャとの統合

## 使い方

### 1. OPAサービスの起動

```bash
docker-compose up opa
```

### 2. ポリシーの確認

OPAは自動的に`/policies`ディレクトリ内の`.rego`ファイルを読み込みます。

### 3. ポリシーのテスト

```bash
# ポリシー評価のテスト
curl -X POST http://localhost:8181/v1/data/example/allow \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### 4. ヘルスチェック

```bash
curl http://localhost:8181/health
```

## ポリシー開発

### Regoファイルの作成

`policies/`ディレクトリに`.rego`ファイルを作成します。
OPAは`--watch`オプションで起動しているため、ファイルの変更を自動的に検知します。

### データファイル

静的なデータは`data/`ディレクトリにJSONファイルとして配置できます。

## 参考リンク

- [OPA Documentation](https://www.openpolicyagent.org/docs/latest/)
- [Rego Language](https://www.openpolicyagent.org/docs/latest/policy-language/)
- [OPA REST API](https://www.openpolicyagent.org/docs/latest/rest-api/)
