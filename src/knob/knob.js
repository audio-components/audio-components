import React, { useState, useEffect, useCallback } from 'react'
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
      rgba(
        0,
        0,
        0,
        ${(props) => luminosityFn(props.contextBackgroundColor, -0.3, 0.4)}
      ),
    // Bumb shadow
      0px 3px 5px 3px
      rgba(
        0,
        0,
        0,
        ${(props) =>
          luminosityFn(props.contextBackgroundColor, -0.2, 0.5) * 0.25}
      ),
    // Bump highligh
      0 -3px 12px 1px rgba(
        255,
        255,
        255,
        ${(props) =>
          luminosityFn(props.contextBackgroundColor, 0.85, 0.15) * 0.5}
      ),
    // Bump ring hightlight
      rgba(
        255,
        255,
        255,
        ${(props) => luminosityFn(props.contextBackgroundColor, 0.4, 0.6)}
      )
      0 0 3px 0;

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
  user-select: none;
`

const Knob = ({
  value,
  min,
  max,
  law,
  onChange,
  size,
  label,
  color,
  textColor,
  contextBackgroundColor,
}) => {
  const [dragging, setDragging] = useState(false)
  const [dragPoint, setDragPoint] = useState([0, 0])
  const [dragStartValue, setDragStartValue] = useState(0)

  const handleMoveAll = useCallback(
    (e) => {
      if (dragging) {
        let v = dragPoint[1] - e.screenY
        v *= 0.003 // scale
        handleChange(dragStartValue + v)
      }
    },
    [dragging, dragStartValue, dragPoint, handleChange]
  )

  const handleMouseUp = useCallback(() => {
    setDragging(false)
  }, [setDragging])

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMoveAll)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMoveAll)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, handleMoveAll, handleMouseUp])

  const handleChange = useCallback(
    (v) => {
      if (v > 1) {
        v = 1
      }
      if (v < 0) {
        v = 0
      }

      onChange(applyLaw(v, min, max, law))
    },
    [onChange, min, max, law]
  )

  const valueToDeg = (v) => {
    return Math.round(v * 270)
  }

  const onMouseDown = (e) => {
    setDragPoint([e.screenX, e.screenY])
    setDragging(true)
    setDragStartValue(reverseLaw(value, min, max, law))
  }

  let rdeg = 45 + valueToDeg(reverseLaw(value, min, max, law))

  return (
    <Root size={size}>
      <Wrapper
        size={size}
        color={color}
        contextBackgroundColor={contextBackgroundColor}
        onMouseDown={onMouseDown}
      >
        <KnobHandle
          color={contrast(color)}
          size={size}
          animated={!dragging}
          style={{
            transform: `rotate(${rdeg}deg)`,
          }}
        />
      </Wrapper>
      <Label color={textColor}>{label}</Label>
    </Root>
  )
}

Knob.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  law: PropTypes.string,
  label: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'big']),
  onChange: PropTypes.func,
  color: PropTypes.string,
  contextBackgroundColor: PropTypes.string,
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
