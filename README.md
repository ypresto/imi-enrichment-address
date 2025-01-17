# imi-enrichment-address

<https://github.com/IMI-Tool-Project/imi-enrichment-address> で公開されていた、住所の正規化を行うライブラリのforkです。

<https://imi-enrichment-address.vercel.app> で実際にお試しいただけます。

`npm i https://github.com/ypresto/imi-enrichment-address` で、ライブラリとしてインストールできます。

## 利用例

入力となる JSON-LD に含まれる `住所>表記 をもつ 場所型` または `表記をもつ住所型` に対して各種のプロパティを補完して返します。

入力が `住所>表記 をもつ 場所型` の場合には地理座標と住所型の各プロパティが補完されます。

**input1.json**

```input.json
{
  "@type": "場所型",
  "住所" : {
    "@type": "住所型",
    "表記" : "霞が関2-1-10"
  }
}
```

**output1.json**

```
{
  "@type": "場所型",
  "住所": {
    "@type": "住所型",
    "表記": "霞が関2-1-10",
    "都道府県": "東京都",
    "都道府県コード": "http://data.e-stat.go.jp/lod/sac/C13000",
    "市区町村": "千代田区",
    "市区町村コード": "http://data.e-stat.go.jp/lod/sac/C13101",
    "町名": "霞が関",
    "丁目": "2",
    "番地": "1",
    "号": "10"
  },
  "地理座標": {
    "@type": "座標型",
    "緯度": "35.675551",
    "経度": "139.750413"
  }
}
```

入力が `表記をもつ住所型` の場合には住所型のプロパティだけが補完されます。

**input2.json**

```input.json
{
  "@type": "住所型",
  "表記" : "霞が関2-1-10"
}
```

**output2.json**

```
{
  "@type": "住所型",
  "表記": "霞が関2-1-10",
  "都道府県": "東京都",
  "都道府県コード": "http://data.e-stat.go.jp/lod/sac/C13000",
  "市区町村": "千代田区",
  "市区町村コード": "http://data.e-stat.go.jp/lod/sac/C13101",
  "町名": "霞が関",
  "丁目": "2",
  "番地": "1",
  "号": "10"
}
```



- [総務省統計局 e-Stat 統計LOD:地域に関するデータ:統計に用いる標準地域コード](http://data.e-stat.go.jp/lodw/provdata/lodRegion#3-2-1) および [国土交通省 国土政策局 国土情報課:位置参照情報ダウンロードサービス:大字・町丁目レベル位置参照情報](http://nlftp.mlit.go.jp/isj/index.html) のデータをもとに各種情報が補完されます
- 付与される地理座標は大字・町丁目レベル位置参照情報のデータによるもので、大字・町丁目の代表点に相当します (番地・号レベルの緯度経度ではありません)
- それぞれのデータをダウンロードして加工したものが本パッケージにバンドルされています
- 町名・丁目レベルまでの地名についてダウンロードデータをもとに実在性が検証されます
- 町名・丁目が実在した場合、それ以下の番地・号は表記をもとに正規化が行われます
- 所与の住所文字列に合致するような地名がない場合にはエラーが返されます


**output_with_error.json**

```
{
  "@context": "https://imi.go.jp/ns/core/context.jsonld",
  "@type": "場所型",
  "住所": {
    "@type": "住所型",
    "表記": "霞が関99",
    "都道府県": "東京都",
    "都道府県コード": "http://data.e-stat.go.jp/lod/sac/C13000",
    "市区町村": "千代田区",
    "市区町村コード": "http://data.e-stat.go.jp/lod/sac/C13101",
    "町名": "霞が関"
  },
  "メタデータ": {
    "@type": "文書型",
    "説明": "該当する丁目が見つかりません"
  }
}
```

以下のエラーが検出されます

- 該当する地名が見つからない場合 (海外住所、都道府県名の間違いなど)
- 該当する市区町村名が見つからない場合
- 該当する市区町村が複数存在する場合（「府中市」など）
- 該当する町名が見つからない場合
- 指定された丁目が存在しない場合（「霞が関五丁目」など）



# 利用者向け情報

`imi-enrichment-address` は node.js のモジュールですが、
動作のためには後述の環境構築の手順によってバンドルデータベースを構築する必要があります。

簡便な動作確認のために、バンドルデータベースを同梱したパッケージアーカイブが
[gBizInfo: IMI コンポーネントツール](https://info.gbiz.go.jp/tools/imi_tools/index.html) のページにて公開されています。

以下の手順は同ページで公開されているパッケージアーカイブ `imi-enrichment-address-2.0.0.tgz` を用いて実行します。

## インストール

以下の手順でインストールします。

```
$ npm install https://info.gbiz.go.jp/tools/imi_tools/resource/imi-enrichment-address/imi-enrichment-address-2.0.0.tgz
```

## コマンドラインインターフェイス

`imi-enrichment-address-2.0.0.tgz` にはコマンドラインインターフェイスが同梱されており、
通常はインストールすると `imi-enrichment-address` コマンドが使用できるようになります。

コマンドラインインターフェイスのファイルの実体は `bin/cli.js` です。

```
$ npm install https://info.gbiz.go.jp/tools/imi_tools/resource/imi-enrichment-address/imi-enrichment-address-2.0.0.tgz

# ヘルプの表示
$ imi-enrichment-address -h

# JSON ファイルの変換
$ imi-enrichment-address input.json > output.json

# 標準入力からの変換
$ cat input.json | imi-enrichment-address > output.json

# 文字列からの変換
$ imi-enrichment-address -s 霞が関2 > output.json

```

または `npx` を使って以下のようにインストールせずに実行することも可能です。

```
$ npx https://info.gbiz.go.jp/tools/imi_tools/resource/imi-enrichment-address/imi-enrichment-address-2.0.0.tgz -s 霞が関2
```

## Web API

`imi-enrichment-address-2.0.0.tgz` には Web API を提供するサーバプログラムが同梱されています。

### サーバの起動方法

`bin/server.js` がサーバの実体です。
以下のように `bin/server.js` を実行することで起動できます。

```
$ npm install https://info.gbiz.go.jp/tools/imi_tools/resource/imi-enrichment-address/imi-enrichment-address-2.0.0.tgz
$ node node_modules/imi-enrichment-address/bin/server.js
Usage: node server.js [port number]

$ node node_modules/imi-enrichment-address/bin/server.js 8080
imi-enrichment-address-server is running on port 8080
```

なお、実行時にはポート番号の指定が必要です。指定しなかった場合にはエラーが表示されて終了します。
サーバを停止するには `Ctrl-C` を入力してください。

### 利用方法

WebAPI は POST された JSON または テキストを入力として JSON を返します。

```
$ curl -X POST -H 'Content-Type: application/json' -d '{"@type":"住所型","表記":"霞が関2"}' localhost:8080/api
{
  "@type": "住所型",
  "表記": "霞が関2",
  "都道府県": "東京都",
  "都道府県コード": "http://data.e-stat.go.jp/lod/sac/C13000",
  "市区町村": "千代田区",
  "市区町村コード": "http://data.e-stat.go.jp/lod/sac/C13101",
  "町名": "霞が関",
  "丁目": "2"
}
```

```
$ curl -X POST -H 'Content-Type: text/plain' -d '霞が関2' localhost:8080/api
{
  "@type": "住所型",
  "表記": "霞が関2",
  "都道府県": "東京都",
  "都道府県コード": "http://data.e-stat.go.jp/lod/sac/C13000",
  "市区町村": "千代田区",
  "市区町村コード": "http://data.e-stat.go.jp/lod/sac/C13101",
  "町名": "霞が関",
  "丁目": "2"
}
```

- / に GET メソッドでアクセスした場合には HTML ページが表示され、WebAPI の動作を確認することができます
- /api に POST 以外のメソッドでアクセスした場合には `405 Method Not Allowed` エラーが返されます
- `Content-Type: application/json` ヘッダが設定されている場合は、POST Body を JSON として扱い、JSON に対しての変換結果を返します
- `Content-Type: application/json` ヘッダが設定されているが POST Body が JSON としてパースできない場合は `400 Bad Request` エラーが返されます
- `Content-Type: application/json` ヘッダが設定されていない場合は、POST Body を住所文字列として扱い、住所文字列をもとに情報の補完された場所型の JSON を返します

## API (Node.js)

モジュール `imi-enrichment-address` は以下のような API の関数を提供します。

```
module.exports = function(input) {..}
```

- 入力 (input) : 変換対象となる JSON または住所文字列
- 出力 : 変換結果の JSON-LD オブジェクトを返却する Promise ※ 変換は非同期で行うために Promise が返されます

```
const convert = require('imi-enrichment-address');
convert("霞が関2").then(json=>{
  console.log(json);
});
```

# 開発者向け情報

## 準備

本パッケージでは [総務省統計局 e-Stat 統計LOD:地域に関するデータ:統計に用いる標準地域コード](http://data.e-stat.go.jp/lodw/provdata/lodRegion#3-2-1) のデータおよび [国土交通省 国土政策局 国土情報課:位置参照情報ダウンロードサービス:大字・町丁目レベル位置参照情報](http://nlftp.mlit.go.jp/isj/index.html) のデータをダウンロードして使用します。

これらのダウンロードは環境構築手順の `bash tools/download.sh` の中で自動的に実行されます。

## 環境構築

以下の手順で環境を構築します。

```
$ git clone https://github.com/IMI-Tool-Project/imi-enrichment-address.git
$ cd imi-enrichment-address
$ npm install
$ bash tools/download.sh 12.0b
$ npm run tree
$ npm run format
```

## テスト

以下の手順でテストを実行します

```
$ cd imi-enrichment-address
$ npm test
```

## パッケージアーカイブの作成

以下の手順で、バンドルデータを含むパッケージアーカイブを作成できます。

```
$ cd imi-enrichment-address
$ npm pack
imi-enrichment-address-2.0.0.tgz
$
```

## データソースの変更(参考情報)

上記の環境構築手順では位置参照情報 (平成30年度版) がダウンロードされ、環境が構築されます。
また、テストも位置参照情報 (平成30年度版) に含まれるデータを前提としたテストになっています。

一方で、位置参照情報は以下のような URL 構造を持っており、`${バージョン}` に適切な文字列を設定することで、
異なる年度のデータをダウンロードして環境を構築することが可能です。

```
https://nlftp.mlit.go.jp/isj/dls/data/${バージョン}/${地方公共団体コード}-${バージョン}.zip
```

バージョン文字列は、たとえば平成30年度版であれば `12.0b` , 令和元年度版であれば `13.0b` といったものです。

ダウンロード処理の実体は `tools/download.sh` に記述されており、
このシェルスクリプトは以下のように、位置参照情報のバージョン文字列を引数にとります。

```
$ bash tools/download.sh
usage: bash tools/download.sh [位置参照情報のバージョン (例:12.0b)]
$
```

仮に令和元年度版データをもとに環境を構築する場合は、以下のように `12.0b` を `13.0b` に書き換えることで対応できます。

```
$ git clone https://github.com/IMI-Tool-Project/imi-enrichment-address.git
$ cd imi-enrichment-address
$ npm install
$ bash tools/download.sh 13.0b
$ npm run tree
$ npm run format
```

なお、位置参照情報の URL 仕様変更・ファイル仕様変更・CSV レイアウトの変更・特定年度のデータエラーなどにより、
必ずしも動作を保証するものではありません。

また、テストコードは位置参照情報 (平成30年度版) を前提としたもので、
当該年度以外のデータで構築された環境でのテストについてはサポートされていないことに注意してください。


## ブラウザビルド(参考情報)

`imi-enrichment-address` はブラウザ上での直接動作をサポートしていません。
WebAPI を使用してください。
