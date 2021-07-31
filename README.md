# free-attendance-app

# Development

```
$ export SLACK_SIGNING_SECRET=xxxxxxxxxxxx
$ export SLACK_BOT_TOKEN=xoxb-xxxxxxxxxxxx
$ ngrok http 3030
$ node_modules/.bin/nodemon app.js # develop
$ node app.js

$ npx serverless offline --noPrependStageInUrl # serverless
```

http://xxxxxxxxxxxx.ngrok.io/slack/events

# reference

https://slack.dev/bolt-js/ja-jp/tutorial/getting-started

# TODO

1. [x] グローバルショートカットから起動
2. [x] モーダル表示
3. [x] 選択肢を選んで実行
4. [x] チャンネルに投稿
5. [x] 自身のアカウントで投稿する (検索出来ない。。)
6. [x] freee の打刻 API を実行する
7. [x] freee に勤怠を登録する
8. [x] そのアプリとの会話 DM に、ボタンとメッセージを送る
9. [x] ボタンは、開始 → 休憩開始|退勤、休憩開始 → 休憩終了、休憩終了 → 休憩開始|退勤
10. [x] ボタンを押したらチャンネルにも投稿
11. [x] Slack のステータスを変更する
12. [x] SlackID から freeeID を取得するいい感じの方法を用意する（GAS？）
    1. [x] アプリから GAS にアクセスする、 {"message":"アクセス権限がありません。"}を回避する
    2. [x] Fetch API で情報を取得する
13. [ ] 他のユーザーの勤怠を登録できるトークンを取得
14. [ ] FaasS デプロイ
    1. [ ] `aws configure` , IAM を決める
15. [x] ローカルで勤怠モーダルを送信したときにエラーが起こる
16. [ ] handle 切り出し
17. [ ] kibela 書く
18. [ ] Jest
19. [ ] Import
20. [ ] TypeScript
21. [ ] Github Actions で deploy
22. [ ] DB を Dynamo などに変更
    1. [ ] SlAckID を登録していなかったときのエラー
    2. [ ] 登録できるようにしたら、解除フローも用意しておかないと面倒
23. [ ] どうやっても他の人の勤怠を登録・編集できないようにする
24. [x] デプロイするときに runtime を指定
