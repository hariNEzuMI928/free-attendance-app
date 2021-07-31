const commonService = require("./commonService");
const FREEE_API_ENDPOINT = "https://api.freee.co.jp/hr/api/v1/";
const headers = {
  Accept: "application/json",
  Authorization: "Bearer " + process.env.FREEE_API_ACCESS_TOKEN,
  "Content-Type": "application/json",
};

const postTimeClocks = async (email, type) => {
  try {
    const freeeEmpId = await getFreeeIdByEmail(email);
    const uri = "employees/" + freeeEmpId + "/time_clocks";
    const payload = {
      company_id: process.env.FREEEE_CAMPANY_ID,
      type: type,
      datetime: commonService.formatDate(true)
    };
    // payload.base_date = "2020/04/04"; // 退勤が翌日の場合はここに出勤日の日付を入れる // TODO:

    const response = await (await fetch(FREEE_API_ENDPOINT + uri, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    })).json();

    if (
      !response.employee_time_clock ||
      !response.employee_time_clock.id
    ) {
      const errMsg = await createErrMsg(response, freeeEmpId);
      throw new Error(errMsg)
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

const getAllEmployees = async () => {
  const uri = `companies/${process.env.FREEEE_CAMPANY_ID}/employees`;
  const response = await (await fetch(FREEE_API_ENDPOINT + uri, {
    method: "GET",
    headers: headers,
  })).json();

  return response;
}

const getFreeeIdByEmail = async (email) => {
  try {
    const allEmployees = await getAllEmployees();
    const employees = allEmployees.find(employee => employee.email === email);

    if (!employees?.id) {
      throw new Error("freeeのアカウントを取得できませんでした。Slackとfreeeは同じメールアドレスを使用してください。解決しない場合は開発者に連絡をしてください。")
    }
    return employees.id;
  } catch (err) {
    return Promise.reject(err);
  }
}

const createErrMsg = async (response, freeeEmpId) => {
  const message = response?.message;
  if (!message) return "";

  let errMsg = "";
  if (message !== "打刻の種類が正しくありません。") {
    errMsg += "時間を置いて再度実行して、それでも解決しない場合は開発者に連絡をしてください。\nエラーメッセージ：「" + JSON.stringify(response) + "」";
    return errMsg
  }

  const availableTypes = await getAvailableTypes(freeeEmpId);
  if (availableTypes.available_types.length === 1
    && availableTypes.available_types[0] === commonService.TIME_CLOCK_TYPE.clock_in.value) {
    errMsg += "本日の業務は終了しました！\n";
    errMsg += "再度出勤する場合は、勤怠アプリから勤怠を登録してください。\n";
  } else {
    errMsg += "選択可能なアクションは、";
    availableTypes.available_types.forEach(type => {
      errMsg += "「" + commonService.TIME_CLOCK_TYPE[type].text + "」";
    });
    errMsg += "です！\n";
  }
  errMsg += "勤怠を修正する場合はfreeeから編集してください。";

  return errMsg;
}

const getAvailableTypes = async (freeeEmpId) => {
  const uri = "employees/" + freeeEmpId + "/time_clocks/available_types"
    + `?company_id=${process.env.FREEEE_CAMPANY_ID}&emp_id=${freeeEmpId}&date=${commonService.formatDate()}`;

  const response = await (await fetch(FREEE_API_ENDPOINT + uri, {
    method: "GET",
    headers: headers,
  })).json();

  return response;
}

module.exports = { postTimeClocks: postTimeClocks };
