require("dotenv").config();
fetch = require("node-fetch");

const { app } = require("./services/slackService");
const handlers = require("./handlers");
const { TIME_CLOCK_TYPE} = require("./services/commonService");

// 勤怠打刻開始モーダル
app.shortcut("start_attendance_shortcut", handlers.handleStartAttendanceShortcut);

// 勤怠打刻開始モーダルでのセレクトボックス選択イベント
app.action("select_location_action", async ({ ack }) => await ack());

// 勤怠打刻開始モーダルでのデータ送信イベント
app.view("start_attendance_modal", handlers.handleStartAttendanceModal);

// Buttonアクション
app.action(TIME_CLOCK_TYPE.break_begin.value, handlers.handlePostTimeClockAction);
app.action(TIME_CLOCK_TYPE.break_end.value, handlers.handlePostTimeClockAction);
app.action(TIME_CLOCK_TYPE.clock_out.value, handlers.handlePostTimeClockAction);

(async () => {
  await app.start();
  console.log("⚡️ Bolt app is running!");
})();
