const freeeService = require("../services/freeeService");
const commonService = require("../services/commonService");

const handleStartAttendanceModal = async ({ ack, body, view, client }) => {
  await ack();

  // Slack側でタイムアウトにならないように別関数に切り出す
  startKintaiModal(body, view, client);
};

const startKintaiModal = async (body, view, client) => {
  const slackUserId = body.user.id;
  try {
    const channelId = body.response_urls[0].channel_id;
    const selectedOption =
      view.state.values[
        Object.keys(view.state.values).filter(
          (value) =>
            view.state.values[value].select_location_action !== undefined
        )[0]
      ].select_location_action.selected_option.value;
    const msg = `${commonService.locations[selectedOption]} で${freeeService.TIME_CLOCK_TYPE.clock_in.text}します！${commonService.slackEmojiStatus.during_work}`;

    const { profile: profile } = await client.users.profile.get({
      user: slackUserId,
    });

    await freeeService.postTimeClocks(
      slackUserId,
      freeeService.TIME_CLOCK_TYPE.clock_in.value
    );

    await client.chat.postMessage({
      username: profile.real_name_normalized,
      icon_url: profile.image_48,
      channel: channelId,
      text: msg,
    });

    await client.chat.postMessage({
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
              commonService.slackEmojiStatus.during_work,
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
                text: freeeService.TIME_CLOCK_TYPE.break_begin.text,
              },
              style: "primary",
              value: freeeService.TIME_CLOCK_TYPE.break_begin.value,
              action_id: freeeService.TIME_CLOCK_TYPE.break_begin.value,
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                emoji: true,
                text: freeeService.TIME_CLOCK_TYPE.break_end.text,
              },
              value: freeeService.TIME_CLOCK_TYPE.break_end.value,
              action_id: freeeService.TIME_CLOCK_TYPE.break_end.value,
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                emoji: true,
                text: freeeService.TIME_CLOCK_TYPE.clock_out.text,
              },
              style: "danger",
              value: freeeService.TIME_CLOCK_TYPE.clock_out.value,
              action_id: freeeService.TIME_CLOCK_TYPE.clock_out.value,
            },
          ],
        },
      ],
    });

    await client.users.profile.set({
      token: process.env.SLACK_USER_TOKEN,
      profile: { status_emoji: commonService.slackEmojiStatus.during_work },
    });
  } catch (err) {
    console.error(err);
    client.chat.postMessage({ channel: slackUserId, text: "[ERR] 打刻に失敗しました:cry:" });
  }
}

module.exports = handleStartAttendanceModal;
