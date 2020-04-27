import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const getBoxShadow = ({
  color,
  h = 0,
  v = 0,
  blur = 0,
  spread = 0,
  inset = false,
  horizontal = false,
}) => {
  if (horizontal) {
    return `${color} ${h}px ${v}px ${blur}px ${spread}px ${
      inset ? 'inset' : ''
    }`
  }

  return `${color} ${-v}px ${h}px ${blur}px ${spread}px ${inset ? 'inset' : ''}`
}

const thumbStyles = css`
  appearance: none;
  width: 25px;
  height: 20px;
  cursor: pointer;
  border-radius: 2px;
  background: #333333;
  border: unset;

  box-shadow: ${({ horizontal }) =>
    `${getBoxShadow({
      color: 'rgba(255, 255, 255, 0.25)',
      v: 2,
      spread: 0.1,
      inset: true,
      horizontal,
    })},
        ${getBoxShadow({
          color: 'rgba(0, 0, 0, 0.19)',
          v: -2,
          spread: 0.1,
          inset: true,
          horizontal,
        })},
        ${getBoxShadow({
          color: 'rgba(0, 0, 0, 0.24)',
          blur: 10,
          inset: true,
          horizontal,
        })},
        ${getBoxShadow({
          color: 'rgba(0, 0, 0, 1)',
          v: 1,
          blur: 4,
          spread: 1,
          horizontal,
        })}`};
`

const thumb = css`
  &::-moz-range-thumb {
    ${thumbStyles}
  }

  &::-webkit-slider-thumb {
    ${thumbStyles}
  }
`

const railStyles = css`
  background: black;
  height: 4px;
  margin: 10px 5px;
`

const rail = css`
  &::-webkit-slider-runnable-track {
    ${railStyles}
    display: flex;
    align-items: center;
  }

  &::-moz-range-track {
    ${railStyles}
  }
`

const SliderInput = styled.input`
  transform: ${({ horizontal }) =>
    horizontal ? 'rotate(0deg)' : 'rotate(-90deg)'};

  appearance: none;
  padding: 5px;
  height: 20px;

  background: #333333;
  box-shadow: #222 1px 1px 10px inset, #222 -1px -1px 10px inset;
  border-radius: 4px;
  border: 1px solid black;
  outline: none;

  display: flex;
  align-items: center;
  justify-content: center;

  ${thumb};
  ${rail};
`

const Slider = ({ onChange, horizontal }) => (
  <SliderInput
    type="range"
    onChange={(e) => onChange(e.target.value)}
    horizontal={horizontal}
  />
)

Slider.defaultProps = {
  horizontal: false
}

Slider.propTypes = {
  /** Callback for changes in the fader */
  onChange: PropTypes.func.isRequired,
  /** Show an horizontal fader instead of a vertical one */
  horizontal: PropTypes.bool,
}

export default Slider
