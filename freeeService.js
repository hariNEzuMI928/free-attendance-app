const commonService = require("./commonService");
const FREEE_API_ENDPOINT = "https://api.freee.co.jp/hr/api/v1";
const headers = {
  Accept: "application/json",
  Authorization: "Bearer " + process.env.FREEE_API_ACCESS_TOKEN,
  "Content-Type": "application/json",
};

module.exports = {
  TIME_CLOCK_TYPE: {
    clock_in: { value: "clock_in", text: "業務開始" },
    break_begin: { value: "break_begin", text: "休憩開始 " + commonService.slackEmojiStatus.during_break },
    break_end: { value: "break_end", text: "休憩終了 " + commonService.slackEmojiStatus.during_work },
    clock_out: { value: "clock_out", text: "退勤 " + commonService.slackEmojiStatus.after_work },
  },

  postTimeClocks: async (slackUserId, type) => {
    const freeeEmpId = await getFreeeIdBySlackId(slackUserId);
    const uri = "/employees/" + freeeEmpId + "/time_clocks";
    const payload = {
      company_id: process.env.FREEEE_CAMPANY_ID,
      type: type,
      datetime: commonService.formatDate(true)
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

const getFreeeIdBySlackId = async (slackId) => {
  const url = process.env.GET_FREEE_EMP_ID_BY_SLACK_ID
    + `?token=${process.env.GAS_TOKEN}&slack_id=${slackId}`;
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    const responseData = await response.json();

    if (responseData?.ok === false) {
      return Promise.reject("FreeeのIDが取得できません。");
    }
    return responseData?.freee_emp_id;

  } catch (err) {
    return Promise.reject(err);
  }
};
