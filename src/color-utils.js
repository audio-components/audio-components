import Color from 'color'

Color.prototype.tint = function (ratio) {
  return this.mix(Color('white'), ratio)
}

Color.prototype.shade = function (ratio) {
  return this.mix(Color('black'), ratio)
}

export const lighten = (color, amount) => {
  const c = Color(color)
  const a = (1 - c.luminosity()) * amount
  return c.mix(Color('white'), a).hex()
}

// Calculate value based on luminosity linear interpolation (a*x+b where x is the color luminosity)
export const luminosityFn = (color, a, b) => {
  const c = Color(color)
  return c.luminosity() * a + b
}

export const contrast = (
  color,
  contrastLuminance = 0.24,
  contrastDark = 0.8,
  contrastDarkSaturate = 1,
  contrastLight = 0.8
) => {
  const c = Color(color)
  return c.luminosity() > contrastLuminance
    ? c.shade(contrastDark).saturate(contrastDarkSaturate).rgb().toString()
    : c.tint(contrastLight).rgb().toString()
}

export const setAlpha = (color, alpha) => {
  return Color(color).alpha(alpha).rgb().toString()
}
