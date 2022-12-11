# playing-cards

## 開発環境

- Docker

### 準備

#### 環境変数

```sh
cp .env.default .env
vi .env #環境変数を設定する，.envファイルはdocker-compose.ymlに読み込まれる
```

https://github.com/Jumpaku/playing-cards/blob/main/.env.default

#### 初期化

```sh
docker compose up -d
docker compose exec dev bash -c 'make init'
```

### ビルド

```sh
docker compose up -d
docker compose exec dev bash -c 'make build'
```

### 起動

```sh
docker compose up -d
docker compose exec dev bash -c 'make start'
```
