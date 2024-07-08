module.exports = {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
  plugins: [
    'transform-decorators-legacy',
    'transform-class-properties',
    [require('@babel/plugin-proposal-decorators').default, { version: '2023-05' }]
  ]
};
