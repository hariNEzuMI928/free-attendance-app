// const freeeService = require("../services/freeeService");
const commonService = require("../services/commonService");

const handleStartAttendanceModal = async ({ ack, body, view, client }) => {
  await ack();

  // Slack側でタイムアウトにならないように別関数に切り出す
  await startKintaiModal(body, view, client);
};

const startKintaiModal = async (body, view, client) => {
  const slackUserId = body.user.id;
  const promise = [];

  try {
    const channelId = body.response_urls[0].channel_id;
    const selectedOption =
      view.state.values[
        Object.keys(view.state.values).filter(
          (value) =>
            view.state.values[value].select_location_action !== undefined
        )[0]
      ].select_location_action.selected_option.value;
    const msg = `${commonService.locations[selectedOption]} で${commonService.TIME_CLOCK_TYPE.clock_in.text}します！${commonService.TIME_CLOCK_TYPE.clock_in.emoji}`;

    const { profile: profile } = await client.users.profile.get({
      user: slackUserId,
    });

    // await freeeService.postTimeClocks(
    //   slackUserId,
    //   commonService.TIME_CLOCK_TYPE.clock_in.value
    // );

    promise.push(client.chat.postMessage({
      username: profile.real_name_normalized,
      icon_url: profile.image_48,
      channel: channelId,
      text: msg,
    }));

    promise.push(client.chat.postMessage({
      channel: slackUserId,
      text: channelId, // ButtonアクションにチャンネルIDを渡す
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "*" +
              commonService.formatDate() +
              "* " +
              commonService.TIME_CLOCK_TYPE.clock_in.emoji,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                emoji: true,
                text: commonService.TIME_CLOCK_TYPE.break_begin.text + commonService.TIME_CLOCK_TYPE.break_begin.emoji,
              },
              style: "primary",
              value: commonService.TIME_CLOCK_TYPE.break_begin.value,
              action_id: commonService.TIME_CLOCK_TYPE.break_begin.value,
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                emoji: true,
                text: commonService.TIME_CLOCK_TYPE.break_end.text + commonService.TIME_CLOCK_TYPE.break_end.emoji,
              },
              value: commonService.TIME_CLOCK_TYPE.break_end.value,
              action_id: commonService.TIME_CLOCK_TYPE.break_end.value,
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                emoji: true,
                text: commonService.TIME_CLOCK_TYPE.clock_out.text + commonService.TIME_CLOCK_TYPE.clock_out.emoji,
              },
              style: "danger",
              value: commonService.TIME_CLOCK_TYPE.clock_out.value,
              action_id: commonService.TIME_CLOCK_TYPE.clock_out.value,
            },
          ],
        },
      ],
    }));

    promise.push(client.users.profile.set({
      token: process.env.SLACK_USER_TOKEN,
      profile: { status_emoji: commonService.TIME_CLOCK_TYPE.clock_in.emoji },
    }));
  } catch (err) {
    console.error(err);
    promise.push(client.chat.postMessage({ channel: slackUserId, text: "[ERR] 打刻に失敗しました:cry:" }));
  }

  await Promise.all(promise);
}

module.exports = handleStartAttendanceModal;
