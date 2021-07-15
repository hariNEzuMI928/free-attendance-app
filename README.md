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
4. [x] 自身のアカウントで投稿する
5. [ ] freeeの打刻APIを実行する
6. [ ] そのアプリとの会話DMに、ボタンとメッセージを送る
7. [ ] ボタンは、開始→休憩開始|退勤、休憩開始→休憩終了、休憩終了→休憩開始|退勤
8. [ ] ボタンを押したらチャンネルにも投稿
9. [ ] そのアプリとの会話DMからも開始できるようにする
