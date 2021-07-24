# free-attendance-app



# Development

```
$ export SLACK_SIGNING_SECRET=xxxxxxxxxxxx
$ export SLACK_BOT_TOKEN=xoxb-xxxxxxxxxxxx
$ ngrok http 3030
$ node_modules/.bin/nodemon app.js # develop
$ node app.js
```

http://xxxxxxxxxxxx.ngrok.io/slack/events

# reference

https://slack.dev/bolt-js/ja-jp/tutorial/getting-started


# TODO

1. [x] グローバルショートカットから起動
2. [x] モーダル表示
3. [X] 選択肢を選んで実行
3. [X] チャンネルに投稿
4. [x] 自身のアカウントで投稿する (検索出来ない。。)
5. [x] freeeの打刻APIを実行する
6. [x] Freeeに勤怠を登録する
7. [x] そのアプリとの会話DMに、ボタンとメッセージを送る
8. [x] ボタンは、開始→休憩開始|退勤、休憩開始→休憩終了、休憩終了→休憩開始|退勤
9. [x] ボタンを押したらチャンネルにも投稿
10. [x] Slackのステータスを変更する
11. [ ] SlackIDからFreeeIDを取得するいい感じの方法を用意する（GAS？）
    1. [ ] アプリからGASにアクセスする、 {"message":"アクセス権限がありません。"}を回避する
    2. [ ] Fetch APIで情報を取得する
12. [ ] 他のユーザーの勤怠を登録できるトークンを取得
13. [ ] FaasSデプロイ
