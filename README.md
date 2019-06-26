# firebase-cloud-functions-sample

## このリポジトリについて
[Firebase Cloud Functions](https://firebase.google.com/docs/functions/?hl=ja)を利用して、サーバーレス環境でREST APIを作成してみます。

GETリクエストを飛ばして、[Cloud Firestore](https://firebase.google.com/docs/firestore?hl=ja)から得たリソースを返すところまでやってみます。

## 手順

1. [Firebaseのコンソールにアクセス](https://console.firebase.google.com/u/0/?hl=ja)し、適当にプロジェクトをつくります。ここでは`sample`プロジェクトを作成しました。
![image](https://user-images.githubusercontent.com/28256336/60176378-0e3a8580-9851-11e9-9bac-19098f7971b4.png)

2. `$ npm install -g firebase-tools`を実行して、FirebaseのCLIを使用可能な状態にします。（`$ firebase --version`してvが確認できたらおk）

3. `$ mkdir xxxx`からの`$ cd xxx`で中にはいって、Firebaseプロジェクトと連携させるために`$ firebase login`をします。実行すると、ログイン認証画面がブラウザで立ち上がるので、1.でプロジェクトを作成したアカウントでログインします。CLIに`$ Success! Logged in as xxxxxxx@gmail.com`と表示されたらログイン成功です。

4. `$ firebase init`をして、プロジェクトの足場作りをします。色々聞かれるので1つずつ答えていきます。
  - `? Which Firebase CLI features do you want to set up for this folder? Press Space to select features, then Enter to confirm your choices.`
    - 今回はCloud Functionsにのみチェックをつけて次へ
  - `? Select a default Firebase project for this directory`
    - 1.で作成したプロジェクト名を選択
  - `? What language would you like to use to write Cloud Functions?`
    - 今回はJavaScriptで
  - `? Do you want to use ESLint to catch probable bugs and enforce style?`
    - Lintツールの恩恵に授かりましょう yで
  - `? Do you want to install dependencies with npm now?`
    - Enterを押すと色々とインストールしてくれて足場作りが終わります
  
5. `functions/index.js`にREST APIのためのエンドポイントを追加して、簡単なREST APIを作成してみます。（元々記述されていたコードのコメントアウト取っただけ）
  ```javascript
     const functions = require('firebase-functions');
     
     exports.helloWorld = functions.https.onRequest((request, response) => {
       response.send("Hello from Firebase!");
     });
  ```
  
  `functions`ディレクトリ内まで移動して、`$ npm run serve`を実行すると、localhost上にデプロイされ、`/helloWorld`のエンドポイントにアクセスすると、ブラウザ上で`Hello from Firebase!`が確認できますね。

   ![image](https://user-images.githubusercontent.com/28256336/60177714-8e161f00-9854-11e9-8f21-6a69cf216b5f.png)
   
   また、`$ npm run deploy`を実行すると、Firebaseプロジェクト上にFunctionsが展開され、発行されたURLにアクセスすればlocalhost上へのデプロイと同様の結果が得られると思います。

6. もう少しREST API感を出していきましょう。あるあるなURI設計は`hogehoge.com/api/hellos`や`hogehoge.com/api/hellos/:helloId`といったように`api`を起点として、その後に続くURIでCRUD操作をしています。そうなると`exports.エンドポイント名`という書き方の5.のコードはそのまま使うことができません。

そこで、`express`を使ってこんな感じに書きます。（その前に `$ npm install express --save`でライブラリをインストールし、`functions/api/index.js`を作成しておきます。）

`functions/index.js`
```javascript
  const functions = require('firebase-functions');

  const { api } = require('./api');

  exports.api = api;
```

`functions/api/index.js`
``` javascript
  const express = require('express');

  const app = express();

  app.get('/hellos/japan', (req, res) => {
    res.send('こんにちは');
  });

  app.get('/hellos/usa', (req, res) => {
    res.send('hello');
  });
  
  exports.api = functions.https.onRequest(app);
```

以上を書き終えたら、`$ npm run serve`を実行してみると、`http://localhost:5000/sample-1aae6/us-central1/api/hellos/japan`や`http://localhost:5000/sample-1aae6/us-central1/api/hellos/usa`で関数が実行されていることが確認でき、`api/`を起点としたREST APIちっくなものができましたね。
