module.exports = {
  lintOnSave: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: false,
      preload: {
        preload: './src/preload.js',
        preload2: './src/work.js'
      },
      builderOptions: {
        win: {
          icon: 'public/favicon.ico',
          target: [
            // {
            //   target: 'nsis',
            //   arch: [
            //     'x64',
            //     'ia32'
            //   ]
            // },
            {
              target: 'portable',
              arch: [
                'x64'//,
                // 'ia32'
              ]
            }
          ]
        },
        files: [
          '**/*'
        ],
        extends: null
      },
      nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true
      }
    }
  }
}
