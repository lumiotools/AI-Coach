module.exports = {
    // Existing configuration...
    module: {
      rules: [
        // ... other rules
        {
          test: /\.(mp4)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'videos/', // Directory within the output path to put the videos
              },
            },
          ],
        },
      ],
    },
    // Other configuration...
  };