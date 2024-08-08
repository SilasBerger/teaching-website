module.exports = {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
  plugins: [
    [require('@babel/plugin-proposal-decorators').default, { version: '2023-05' }]
  ]
};
