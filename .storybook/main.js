module.exports = {
  stories: ['../docs/**/*.stories.(js|mdx)', '../src/**/*.stories.(js|mdx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-knobs',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-options',
  ],
}
