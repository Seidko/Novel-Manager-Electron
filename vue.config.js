module.exports = {
  lintOnSave: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: false,
      preload: {
        preload: './src/preload.js'
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
            // {
            //   target: 'portable',
            //   arch: [
            //     'x64',
            //     'ia32'
            //   ]
            // }
            {
              target: '7z',
              arch: [
                'x64'
              ]
            }
          ]
        },
        asarUnpack: [
          './node_modules/**/*'
        ],
        extraResources: [
          {
            from: './src/work.js',
            to: 'static/worker/work.js'
          }
        ],
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
