window.GAME_CONFIG = {
  globalTotalNumbers: 70,
  excludedRange: { min: 1, max: 17 },
  defaultGame: "Game1",
  games: [
    {
      key: "Game1",
      label: "赶马",
      winnersPerRound: 2,   // 每回合抽取人数
      rounds: 5,            // 抽取回合数
      scrollDurationSeconds: 70,
      rowDirections: ["left", "right", "left"],
      randomizeRows: true,
      randomRefreshMs: 500
    },
    {
      key: "Game2",
      label: "番茄接力大作战",
      winnersPerRound: 5,
      rounds: 2,
      scrollDurationSeconds: 70,
      rowDirections: ["left", "right", "left"],
      randomizeRows: true,
      randomRefreshMs: 1200
    }
  ]
};
