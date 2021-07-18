const FREEE_API_ENDPOINT = "https://api.freee.co.jp/hr/api/v1";
const headers = {
  Accept: "application/json",
  Authorization: "Bearer " + process.env.FREEE_API_ACCESS_TOKEN,
  "Content-Type": "application/json",
};

module.exports = {
  TIME_CLOCK_TYPE: {
    clock_in: { value: "clock_in", text: "業務開始" },
    break_begin: { value: "break_begin", text: "休憩開始" },
    break_end: { value: "break_end", text: "休憩終了" },
    clock_out: { value: "clock_out", text: "退勤" },
  },

  postTimeClocks: async (slackUserId, type) => {
    const freeeEmpId = getFreeeIdBySlackId(slackUserId);
    const uri = "/employees/" + freeeEmpId + "/time_clocks";
    const payload = {
      company_id: process.env.FREEEE_CAMPANY_ID,
      type: type,
      datetime: "2020-04-14 " + new Date().toLocaleTimeString("en-GB"), // 打刻日時 YYYY-MM-DD HH:MM:SS
    };
    // payload.base_date = "2020/04/04"; // 退勤が翌日の場合はここに出勤日の日付を入れる // TODO: base_date を設定する条件を用意

    try {
      const response = await fetch(FREEE_API_ENDPOINT + uri, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();

      if (
        !responseData.employee_time_clock ||
        !responseData.employee_time_clock.id
      ) {
        return Promise.reject(
          "postTimeClocks fail : " + JSON.stringify(responseData)
        );
      }
    } catch (err) {
      return Promise.reject(err);
    }
      return Promise.resolve();
  },
};

const getFreeeIdBySlackId = (slackId) => {
  // TODO:  slackUserIdからFreeeIDを取得
  slackId;
  return 1208451;
};
