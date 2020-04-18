import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { lighten, luminosityFn, contrast } from '../color-utils'
import { applyLaw, reverseLaw } from '../maps.js'

const Root = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;

  ${(props) =>
    props.size === 'small' &&
    `
  font-size: 8px;
  `}
`

const Wrapper = styled.div`
  cursor: ns-resize;
  font-size: 10px;
  position: relative;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: solid 2px #000000;
  background: linear-gradient(
    180deg,
    ${(props) => lighten(props.color, 0.1)} 0%,
    ${(props) => props.color} 100%
  );

  // Hard hightlight
  box-shadow: inset 0 1px 1px 1px
      rgba(255, 255, 255, ${(props) => luminosityFn(props.color, 0.85, 0.15)}),
    // Hard shadow
      inset 0 -1px 1px 1px rgba(
        0,
        0,
        0,
        ${(props) => luminosityFn(props.color, -0.2, 0.5)}
      ),
    // Knob shadow
      0 6px 10px
      rgba(0, 0, 0, ${(props) => luminosityFn(props.color, -0.3, 0.4)}),
    // Bumb shadow
      0px 3px 5px 3px
      rgba(0, 0, 0, ${(props) => luminosityFn(props.color, -0.2, 0.5) * 0.5}),
    // Bump highligh
      0 -3px 12px 1px rgba(
        255,
        255,
        255,
        ${(props) => luminosityFn(props.color, 0.85, 0.15)}
      ),
    // Bump ring hightlight
      rgba(255, 255, 255, ${(props) => luminosityFn(props.color, 0.4, 0.6)}) 0 0
      3px 0;

  //box-shadow: inset 0 1px 1px 1px rgba(255, 255, 255, 0.76),
  //inset 0 -1px 1px 1px rgba(0, 0, 0, 0.32), 0 6px 10px rgba(0, 0, 0, 0.15),
  //0px 3px 5px 3px rgba(0, 0, 0, 0.15), 0 -3px 12px rgb(255, 255, 255);

  ${(props) =>
    props.size === 'small' &&
    `
    font-size: 8px;
    width: 22px;
    height: 22px;
  `}

  ${(props) =>
    props.size === 'big' &&
    `
      width: 65px;
      height: 65px;
  `}
`

const KnobHandle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transform: rotate(0deg);
  z-index: 10;

  ${(props) =>
    props.animated &&
    `
  transition: 0.5s ease all;
  `}

  cursor: ns-resize;

  &:before {
    content: '';
    position: absolute;
    bottom: ${(props) =>
      props.size === 'big' ? 6 : props.size === 'medium' ? 4 : 3}px;
    left: calc(50% - 1px);
    width: 2px;
    height: 6px;
    background-color: ${(props) => props.color};
    border-radius: 1px;
  }
`

const Label = styled.span`
  margin-top: 8px;

  font-family: sans-serif;
  color: ${(props) => props.color};
  font-weight: normal;
  font-size: 12px;
  text-shadow: #000000a6 0px 1px 1px;
`

class Knob extends React.Component {
  handleChange = (value) => {
    if (value > 1) {
      value = 1
    }
    if (value < 0) {
      value = 0
    }

    this.props.onChange(this.applyLaw(value))
  }

  applyLaw = (v) => {
    return applyLaw(v, this.props.min, this.props.max, this.props.law)
  }

  reverseLaw = (v) => {
    return reverseLaw(v, this.props.min, this.props.max, this.props.law)
  }

  valueToDeg = (value) => {
    return Math.round(value * 270)
  }

  onMouseDown = (e) => {
    this.setState({
      dragPoint: [e.screenX, e.screenY],
      dragging: true,
      dragStartValue: this.reverseLaw(this.props.value),
    })
  }

  handleMoveAll = (e) => {
    if (this.state.dragging) {
      let value = this.state.dragPoint[1] - e.screenY
      value *= 0.003 // scale
      this.handleChange(this.state.dragStartValue + value)
    }
  }

  handleMouseUp = () => {
    this.setState({ dragging: false })
  }

  state = {
    dragging: false,
    dragPoint: [0.0, 0.0],
    dragStartValue: 0,
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMoveAll)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  render() {
    const { value, size, label, color, textColor } = this.props
    let rdeg = 45 + this.valueToDeg(this.reverseLaw(value))

    return (
      <Root size={size}>
        <Wrapper size={size} color={color} onMouseDown={this.onMouseDown}>
          <KnobHandle
            color={contrast(color)}
            size={size}
            animated={!this.state.dragging}
            style={{
              transform: `rotate(${rdeg}deg)`,
            }}
          />
        </Wrapper>
        <Label color={textColor}>{label}</Label>
      </Root>
    )
  }
}

Knob.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  law: PropTypes.string,
  label: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onChange: PropTypes.func,
  color: PropTypes.string,
  textColor: PropTypes.string,
}

Knob.defaultProps = {
  onChange: () => {},
  law: 'linear',
  label: '',
  size: 'medium',
  max: 1,
  min: 0,
}

export default Knob
