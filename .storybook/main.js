module.exports = {
  stories: ['../docs/**/*.stories.(js|mdx)', '../src/**/*.stories.(js|mdx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-knobs/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-options/register',
    '@storybook/addon-links/register',
  ],
}
