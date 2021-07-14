const { App } = require("@slack/bolt");
const { LogLevel } = require("@slack/logger");
require("dotenv").config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// 作業場所
const locations = ["自宅", "会社", "布団の中", "その他の場所"];
let locationOptions = [];
locations.forEach((location, index) => {
  locationOptions.push({
    text: {
      type: "plain_text",
      text: location,
      emoji: true,
    },
    value: index.toString(),
  });
});

// 勤怠打刻開始モーダル
app.shortcut("kintai_start_shortcut", async ({ shortcut, ack, context }) => {
  ack();

  try {
    await app.client.views.open({
      token: context.botToken,
      trigger_id: shortcut.trigger_id,
      view: {
        title: {
          type: "plain_text",
          text: "勤怠打刻",
        },
        callback_id: "kintai_start_modal",
        submit: {
          type: "plain_text",
          text: "Submit",
        },
        type: "modal",
        close: {
          type: "plain_text",
          text: "Close",
        },
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "今日も一日頑張りましょう:relaxed:",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "どこで作業開始しますか？",
            },
            accessory: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Select",
                emoji: true,
              },
              options: locationOptions,
              action_id: "select_location_action",
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);
  }
});

// 勤怠打刻開始モーダルでのセレクトボックス選択イベント
app.action("select_location_action", async ({ body, ack, say }) => {
  await ack();
});

// 勤怠打刻開始モーダルでのデータ送信イベントを処理
app.view("kintai_start_modal", async ({ ack, body, view, client }) => {
  // モーダルでのデータ送信イベントを確認
  await ack();

  const selected_option =
    view.state.values[Object.keys(view.state.values)[0]].select_location_action
      .selected_option.value;
  const msg = `${locations[selected_option]} で作業開始します！`;
  const user = body.user.id;

  try {
    await client.chat.postMessage({
      channel: user, // TODO: チャンネルにする、アプリが投稿ではなく自分のアカウントで投稿させる
      text: msg,
    });
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3030);

  console.log("⚡️ Bolt app is running!");
})();
