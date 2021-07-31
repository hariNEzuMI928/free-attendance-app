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

  TIME_CLOCK_TYPE: {
    clock_in: { value: "clock_in", text: "業務開始", emoji: ":sunny:" },
    break_begin: { value: "break_begin", text: "休憩開始", emoji: ":sushi:" },
    break_end: { value: "break_end", text: "休憩終了", emoji: ":sunny:" },
    clock_out: { value: "clock_out", text: "退勤", emoji: ":crescent_moon:" },
  },

  // YYYY-MM-DD HH:MM:SS
  formatDate: (includeTime) => {
    const d = new Date();
    // const d = new Date('2020-05-13 ' + new Date().toLocaleTimeString("en-GB")); // dev

    const date = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);

    return includeTime ? date + " " + d.toLocaleTimeString("en-GB") : date;
  },
};
