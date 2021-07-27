const { App, AwsLambdaReceiver } = require("@slack/bolt");
require("dotenv").config();
fetch = require("node-fetch");

const freeeService = require("./services/freeeService");
const commonService = require("./services/commonService");
const handleStartAttendanceModal = require("./handlers/handleStartAttendanceModal");
const handleStartAttendanceShortcut = require("./handlers/handleStartAttendanceShortcut");
const handlePostTimeClockAction = require("./handlers/handlePostTimeClockAction");

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  receiver: awsLambdaReceiver,
  processBeforeResponse: true,
});

// 勤怠打刻開始モーダル
app.shortcut("start_attendance_shortcut", handleStartAttendanceShortcut);

// 勤怠打刻開始モーダルでのセレクトボックス選択イベント
app.action("select_location_action", async ({ ack }) => await ack());

// 勤怠打刻開始モーダルでのデータ送信イベント
app.view("start_attendance_modal", handleStartAttendanceModal);

// Buttonアクション
app.action(commonService.TIME_CLOCK_TYPE.break_begin.value, handlePostTimeClockAction);
app.action(commonService.TIME_CLOCK_TYPE.break_end.value, handlePostTimeClockAction);
app.action(commonService.TIME_CLOCK_TYPE.clock_out.value, handlePostTimeClockAction);

module.exports.handler = async (event, context, callback) => {
  const handler = await app.start();
  return handler(event, context, callback);
}

// (async () => {
//   await app.start(process.env.PORT || 3030);

//   console.log("⚡️ Bolt app is running!");
// })();
