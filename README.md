# playing-cards

## 開発環境

- Docker

### 環境変数

```sh
cp .env.default .env
vi .env #環境変数を設定
export $(sed -e 's/#.*//g' .env)
```

https://github.com/Jumpaku/playing-cards/blob/main/.env.default

### ビルド

```sh
docker compose up -d
docker compose exec dev bash -c 'npm run build'
```

### 起動

```sh
docker compose up -d
docker compose exec dev bash -c 'npm run start'
```
