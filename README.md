# freee-attendance-app

<a href="https://slack.com/oauth/v2/authorize?scope=chat:write,chat:write.public,chat:write.customize&user_scope=users.profile:read,users.profile:write&client_id=1788434032663.2276845659921">
  <img alt=""Add to Slack"" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
</a>

# Development

```
$ # develop
$ yarn run ng
$ yarn run local
$ node app.js

$ npx serverless offline --noPrependStageInUrl # serverless
```

http://xxxxxxxxxxxx.ngrok.io/slack/events

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
13. [ ] 他のユーザーの勤怠を登録できるトークンを取得
14. [x] FaasS デプロイ
    1. [x] `aws configure` , IAM を決める
15. [x] ローカルで勤怠モーダルを送信したときにエラーが起こる
16. [x] handle 切り出し
17. [ ] kibela 書く
18. [ ] Jest
19. [x] Import
20. [x] TypeScript
21. [ ] Github Actions で deploy
22. [ ] どうやっても他の人の勤怠を登録・編集できないようにする
23. [x] デプロイするときに runtime を指定
24. [ ] envファイルを分ける
25. [x] エラー処理共通化
26. [x] Slack OAuth
27. [ ] freee OAuth
28. [ ] store
    1.  [x] Slack User Id
    2.  [x] Slack Auth Token
    3.  [ ] freee Emp Id
29. [ ] EC2かLight sailでデプロイ
30. [ ] AWS 側でDynamodbの設定 **＿<----これ！！！！！＿**
31. [x] テーブルがなかったときに新規作成 (https://www.wakuwakubank.com/posts/670-nodejs-dynamodb/)  **＿<----これ！！！！！＿**
32. [ ] 全てTypeScriptに書き換え、boltで定義されている型を仕様
33. [ ] TSで＠でpath
34. [ ] ts use strict
