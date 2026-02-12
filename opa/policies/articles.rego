package authz

default allow = false

# ============================================
# マルチテナンシー検証
# ============================================

service_id_matches if {
    input.request.serviceId == input.user.serviceId
}

service_id_matches if {
    input.request.serviceId == null
    input.user.serviceId == null
}

# ============================================
# 記事エンドポイントの認可ルール
# ============================================

# GET /articles - 記事一覧取得
allow if {
    service_id_matches
    input.request.method == "GET"
    input.request.path == "/articles"
    "articles:read" in input.user.permissions
}

# GET /articles/:id - 記事詳細取得
allow if {
    service_id_matches
    input.request.method == "GET"
    startswith(input.request.path, "/articles/")
    "articles:read" in input.user.permissions
}

# POST /articles - 記事作成
allow if {
    service_id_matches
    input.request.method == "POST"
    input.request.path == "/articles"
    "articles:create" in input.user.permissions
}

# PUT /articles/:id - 記事更新
allow if {
    service_id_matches
    input.request.method == "PUT"
    startswith(input.request.path, "/articles/")
    "articles:update" in input.user.permissions
}

# DELETE /articles/:id - 記事削除
allow if {
    service_id_matches
    input.request.method == "DELETE"
    startswith(input.request.path, "/articles/")
    "articles:delete" in input.user.permissions
}
