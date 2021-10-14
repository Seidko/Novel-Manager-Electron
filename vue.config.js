module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: false,
      preload: { preload: 'src/preload.js' },
      builderOptions: {
        win: {
          icon: "public/favicon.ico",
          target: [
            "portable"
          ]
        }
      },
    }
  }
}
