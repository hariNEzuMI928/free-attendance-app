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
4. [ ] 自分のアイコンで投稿される
5. [ ] freeeの打刻APIを実行する
