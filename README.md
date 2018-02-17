# gitconfig

githubの設定をする

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

```
git config --local --list
```
