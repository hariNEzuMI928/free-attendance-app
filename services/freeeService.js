const commonService = require("./commonService");
const FREEE_API_ENDPOINT = "https://api.freee.co.jp/hr/api/v1";
const headers = {
  Accept: "application/json",
  Authorization: "Bearer " + process.env.FREEE_API_ACCESS_TOKEN,
  "Content-Type": "application/json",
};

module.exports = {
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
      const response = await (await fetch(FREEE_API_ENDPOINT + uri, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      })).json();

      if (
        !response.employee_time_clock ||
        !response.employee_time_clock.id
      ) {
        const errMsg = await createErrMsg(response?.message, freeeEmpId);
        return Promise.reject(errMsg);
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

const createErrMsg = async (message, freeeEmpId) => {
  if (!message) return "";

  let errMsg = "[ERR] ";

  if (message !== "打刻の種類が正しくありません。") {
    errMsg += "開発者に連絡してください。\nエラーメッセージ：「" + message + "」";
    return errMsg
  }

  const availableTypes = await getAvailableTypes(freeeEmpId);
  if (availableTypes.available_types.length === 1 && availableTypes.available_types[0] === commonService.TIME_CLOCK_TYPE.clock_in.value) {
    errMsg += "今日の業務は終了しました！";
    errMsg += "再度出勤する場合は、勤怠チャンネルのショートカットから投稿してください。";
  } else {
    errMsg += "選択可能なアクションは、";
    availableTypes.available_types.forEach(type => {
      errMsg += "「" + commonService.TIME_CLOCK_TYPE[type].text + "」";
    });
    errMsg += "です！";
  }
  errMsg += "修正する場合はFreeeから編集してください。";

  return errMsg;
}

const getAvailableTypes = async (freeeEmpId) => {
  const uri = "/employees/" + freeeEmpId + "/time_clocks/available_types"
    + `?company_id=${process.env.FREEEE_CAMPANY_ID}&emp_id=${freeeEmpId}&date=${commonService.formatDate()}`;
  const response = await (await fetch(FREEE_API_ENDPOINT + uri, {
    method: "GET",
    headers: headers,
  })).json();

  return response;
}
