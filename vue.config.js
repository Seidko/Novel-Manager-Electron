const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: false,
      preload: {
        main: './src/preload/main.ts'
      },
      builderOptions: {
        win: {
          icon: 'public/favicon.ico',
          target: [
            {
              target: 'nsis',
              arch: [
                'x64'
              ]
            }
          ]
        },
        asar: false,
        files: [
          '**/*'
        ],
        extends: null,
        nsis: {
          oneClick: false,
          perMachine: false,
          allowToChangeInstallationDirectory: true,
          license: 'LICENSE'
        }
      }
    }
  }
})
