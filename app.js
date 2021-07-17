const { App } = require("@slack/bolt");
require("dotenv").config();
fetch = require("node-fetch");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const FREEE_API_ENDPOINT = "https://api.freee.co.jp/hr/api/v1";
const headers = {
  Accept: "application/json",
  Authorization: "Bearer " + process.env.FREEE_API_ACCESS_TOKEN,
  "Content-Type": "application/json",
};

// 作業場所
const locations = ["自宅", "会社", "布団の中", "その他の場所"];
const locationOptions = locations.map((location, index) => {
  return {
    text: {
      type: "plain_text",
      text: location,
      emoji: true,
    },
    value: index.toString(),
  };
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
            type: "input",
            element: {
              type: "static_select",
              action_id: "select_location_action",
              placeholder: {
                type: "plain_text",
                text: "Select",
                emoji: true,
              },
              options: locationOptions,
            },
            label: {
              type: "plain_text",
              text: "どこで作業開始しますか？",
              emoji: true,
            },
          },
          {
            type: "input",
            element: {
              type: "conversations_select",
              action_id: "input",
              response_url_enabled: true,
              default_to_current_conversation: true,
            },
            label: {
              type: "plain_text",
              text: "投稿するチャンネル",
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

let SLACK_USER_ID;

// 勤怠打刻開始モーダルでのデータ送信イベントを処理
app.view("kintai_start_modal", async ({ ack, body, view, client }) => {
  await ack();

  SLACK_USER_ID = body.user.id;

  const { profile: profile } = await app.client.users.profile.get({
    user: SLACK_USER_ID,
  });
  const channel_id = body.response_urls[0].channel_id;
  const selected_option =
    view.state.values[Object.keys(view.state.values)[0]].select_location_action
      .selected_option.value;
  const msg = `${locations[selected_option]} で業務開始します！`;

  try {
    await client.chat.postMessage({
      username: profile.real_name_normalized,
      icon_url: profile.image_48,
      channel: channel_id,
      text: msg,
    });

    if (postTimeClocks()) {
      console.log("成功！");
    }
  } catch (error) {
    console.error(error);
  }
});

const getFreeeIdBySlackId = (slackId) => {
  // TODO:  SLACK_USER_IDからFreeeIDを取得
  slackId;
  return 1208451;
};

const postTimeClocks = async () => {
  const empId = getFreeeIdBySlackId(SLACK_USER_ID);

  const uri = "/employees/" + empId + "/time_clocks";
  const payload = {
    company_id: process.env.FREEEE_CAMPANY_ID,
    type: "clock_in", // clock_in, break_begin, break_end, clock_out
    datetime: "2020-04-04 11:22:33", // 打刻日時 YYYY-MM-DD HH:MM:SS
  };
  // payload.base_date = "2020/04/04"; // 退勤が翌日の場合はここに出勤日の日付を入れる // TODO: base_date を設定する条件を用意

  const response = await fetch(FREEE_API_ENDPOINT + uri, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });
  const responseData = await response.json();

  return (
    responseData.employee_time_clock && responseData.employee_time_clock.id
  );
};

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3030);

  console.log("⚡️ Bolt app is running!");
})();
