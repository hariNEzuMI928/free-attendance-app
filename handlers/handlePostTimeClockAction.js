const freeeService = require("../services/freeeService");
const commonService = require("../services/commonService");

const handlePostTimeClockAction = async ({ body, ack, say, client }) => {
    await ack();

    // Slack側でタイムアウトにならないように別関数に切り出す
    postTimeClockAction(body, say, client);
};

const postTimeClockAction = async (body, say, client) => {
    const actionId = body.actions[0].action_id;
    const slackUserId = body.user.id;
    const channelId = body.message.text;
    const clockTypeObject = commonService.TIME_CLOCK_TYPE[actionId];

    try {
        await freeeService.postTimeClocks(slackUserId, clockTypeObject.value);

        await say(`[打刻] *${clockTypeObject.text}* ${clockTypeObject.emoji}`);

        const { profile: profile } = await client.users.profile.get({
            user: slackUserId,
        });

        await client.chat.postMessage({
            username: profile.real_name_normalized,
            icon_url: profile.image_48,
            channel: channelId,
            text: `${clockTypeObject.text} ! ${clockTypeObject.emoji}`,
        });

        await client.users.profile.set({
            token: process.env.SLACK_USER_TOKEN,
            profile: { status_emoji: clockTypeObject.emoji },
        });

        if (actionId === commonService.TIME_CLOCK_TYPE.clock_out.value) {
            await say("今日もお疲れ様でした :star2:");
        }
    } catch (err) {
        console.error(err);
        await say("[ERR] 打刻に失敗しました:cry:");
    }
}

module.exports = handlePostTimeClockAction;
