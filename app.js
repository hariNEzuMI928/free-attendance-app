const { App } = require("@slack/bolt");
require("dotenv").config();
fetch = require("node-fetch");

const commonService = require("./services/commonService");
const handleStartAttendanceModal = require("./handlers/handleStartAttendanceModal");
const handleStartAttendanceShortcut = require("./handlers/handleStartAttendanceShortcut");
const handlePostTimeClockAction = require("./handlers/handlePostTimeClockAction");

const app = new App({
  socketMode: true,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
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

(async () => {
  await app.start();
  console.log("⚡️ Bolt app is running!");
})();
