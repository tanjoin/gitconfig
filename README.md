# gitconfig

gitの設定をする.

## インストール

```
npm install -g tanjoin/gitconfig
```

## 利用方法

```
gitconfig user xxx
gitconfig email xxx@yyy.zz
gitconfig .
```

## Git の設定確認

`.git` が存在するディレクトリで以下を実行すると、そのディレクトリで適用される設定が表示される.

```sh
git config --local --list
# ユーザー情報だけ取得したいとき
git config --local --list | grep "user.*"
```

## .tjconfig について

ホームディレクトリに隠しファイルとして生成されます.

### 現行バージョン

```
2
```

### データモデル

```json
{
  "users": [
    {
      "hostname": "tanjoin",
      "name": "tanjoin",
      "email": "tanjoin@users.noreply.github.com"
    },
    {
      "hostname": "github.com",
      "name": "tanjoin",
      "email": "tanjoin@users.noreply.github.com"
    },
    ...
  ],
  "version": 2
}
```

- users
  - 登録されたユーザー情報一覧
  - user
    - hostname
      - remote の "origin" の url に設定する hostname
      - SSH形式のみ対応しています.
        - 例) `git@tanjoin:tanjoin/gitconfig.git`
    - name
      - user.name に設定する値
    - email
      - user.email に設定する値
- version
  - データモデルのバージョン番号
