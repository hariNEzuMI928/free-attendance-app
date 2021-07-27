const { App, AwsLambdaReceiver } = require("@slack/bolt");
require("dotenv").config();
fetch = require("node-fetch");

const freeeService = require("./services/freeeService");
const commonService = require("./services/commonService");
const handleStartAttendanceModal = require("./handlers/handleStartAttendanceModal");
const handleStartAttendanceShortcut = require("./handlers/handleStartAttendanceShortcut");

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  receiver: awsLambdaReceiver,
  processBeforeResponse: true,
});

const ERROR_MSG = "[ERR] 打刻に失敗しました:cry:";

// 勤怠打刻開始モーダル
app.shortcut("start_attendance_shortcut", handleStartAttendanceShortcut);

// 勤怠打刻開始モーダルでのセレクトボックス選択イベント
app.action("select_location_action", async ({ ack }) => await ack());

// 勤怠打刻開始モーダルでのデータ送信イベントを処理
app.view("start_attendance_modal", handleStartAttendanceModal);

app.action(
  freeeService.TIME_CLOCK_TYPE.break_begin.value,
  async ({ body, ack, say }) => {
    await ack();

    postSlackTimeClocks(body, say, commonService.slackEmojiStatus.during_break);
  }
);

app.action(
  freeeService.TIME_CLOCK_TYPE.break_end.value,
  async ({ body, ack, say }) => {
    await ack();

    postSlackTimeClocks(body, say, commonService.slackEmojiStatus.during_work);
  }
);

app.action(
  freeeService.TIME_CLOCK_TYPE.clock_out.value,
  async ({ body, ack, say }) => {
    await ack();

    postSlackTimeClocks(body, say, commonService.slackEmojiStatus.after_work);
  }
);

const postSlackTimeClocks = async (body, say, slackEmojiStatus) => {
  const actionId = body.actions[0].action_id;
  const slackUserId = body.user.id;
  const channelId = body.message.text;

  try {
    await freeeService.postTimeClocks(
      slackUserId,
      freeeService.TIME_CLOCK_TYPE[actionId].value
    );
    await say(`[打刻] *${freeeService.TIME_CLOCK_TYPE[actionId].text}*`);

    await postTimeClocksMsg(slackUserId, channelId, actionId);

    await changeSlackEmojiStatus(slackEmojiStatus);

    if (slackEmojiStatus === commonService.slackEmojiStatus.after_work) {
      await say("今日もお疲れ様でした :star2:");
    }
  } catch (err) {
    console.error(err);
    await say(ERROR_MSG);
  }
}

const postTimeClocksMsg = async (slackUserId, channelId, actionId) => {
  try {
    const { profile: profile } = await app.client.users.profile.get({
      user: slackUserId,
    });
    const msg = `${freeeService.TIME_CLOCK_TYPE[actionId].text}`;

    await app.client.chat.postMessage({
      username: profile.real_name_normalized,
      icon_url: profile.image_48,
      channel: channelId,
      text: msg,
    });

    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

const changeSlackEmojiStatus = async (status_emoji) => {
  try {
    await app.client.users.profile.set({
      token: process.env.SLACK_USER_TOKEN,
      profile: { status_emoji: status_emoji },
    });

    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.handler = async (event, context, callback) => {
  const handler = await app.start();
  return handler(event, context, callback);
}

// (async () => {
//   await app.start(process.env.PORT || 3030);

//   console.log("⚡️ Bolt app is running!");
// })();
