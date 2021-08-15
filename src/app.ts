import dotenv from "dotenv";
dotenv.config();

import app from "./services/slackService";
import handlers from "./handlers";
import { TIME_CLOCK_TYPE } from "./services/commonService";

// 勤怠打刻開始モーダル
app.shortcut("start_attendance_shortcut", handlers.handleStartAttendanceShortcut);

// 勤怠打刻開始モーダルでのセレクトボックス選択イベント
app.action("select_location_action", async ({ ack }: { ack: any }) => await ack());

// 勤怠打刻開始モーダルでのデータ送信イベント
app.view("start_attendance_modal", handlers.handleStartAttendanceModal);

// Buttonアクション
app.action(TIME_CLOCK_TYPE.break_begin.value, handlers.handlePostTimeClockAction);
app.action(TIME_CLOCK_TYPE.break_end.value, handlers.handlePostTimeClockAction);
app.action(TIME_CLOCK_TYPE.clock_out.value, handlers.handlePostTimeClockAction);

app.error(async (error: Error) => {console.error(error)});

(async () => {
  process.env.PORT
    ? await app.start(Number(process.env.PORT))
    : await app.start();

  console.log("⚡️ Bolt app is running!");
})();
