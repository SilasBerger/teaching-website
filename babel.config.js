module.exports = {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
  plugins: [
    'transform-decorators-legacy',
    'transform-class-properties'
  ]
};
