const locations = ["自宅", "会社", "布団の中", "その他の場所"];

module.exports = {
  // 作業開始場所
  locations: locations,
  locationOptions: locations.map((location, index) => {
    return {
      text: {
        type: "plain_text",
        text: location,
        emoji: true,
      },
      value: index.toString(),
    };
  }),

  // YYYY-MM-DD HH:MM:SS
  formatDate: (includeTime) => {
    const d = new Date();
    // const d = new Date('2021-05-09 ' + new Date().toLocaleTimeString("en-GB")); // dev

    const date = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);

    return includeTime ? date + " " + d.toLocaleTimeString("en-GB") : date;
  },

  // Slackステータス絵文字
  slackEmojiStatus : {
    during_work: ":sunny:",
    during_break: ":sushi:",
    after_work: ":crescent_moon:",
  },
};
