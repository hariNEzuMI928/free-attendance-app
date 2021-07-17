const FREEE_API_ENDPOINT = "https://api.freee.co.jp/hr/api/v1";
const headers = {
  Accept: "application/json",
  Authorization: "Bearer " + process.env.FREEE_API_ACCESS_TOKEN,
  "Content-Type": "application/json",
};

module.exports = {
  postTimeClocks: async (slackUserId) => {
    const freeeEmpId = getFreeeIdBySlackId(slackUserId);
    const uri = "/employees/" + freeeEmpId + "/time_clocks";
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
      // 成功可否
      responseData.employee_time_clock && responseData.employee_time_clock.id
    );
  },
};

const getFreeeIdBySlackId = (slackId) => {
  // TODO:  slackUserIdからFreeeIDを取得
  slackId;
  return 1208451;
};
