import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Color from 'color'

import { luminosityFn } from '../color-utils'

const Wrapper = styled.div`
  overflow: hidden;
  border-radius: 5px;
  height: ${(props) => props.height}px;
  border: 3px solid black;
  box-shadow: rgba(
        255,
        255,
        255,
        ${(props) => luminosityFn(props.contextBackgroundColor, 0.7, 0.3)}
      )
      0 0 3px,
    rgba(
        255,
        255,
        255,
        ${(props) => luminosityFn(props.contextBackgroundColor, 0.9, 0.1)}
      )
      0 1px 0px;
`

const height = 100
const width = 100

class ADSRGraph extends React.Component {
  /**
   * Returns the width of each phase
   * @return {Array} [attack_width, decay_width, sustain_width, release_width]
   */
  getPhaseLengths() {
    let total_time = this.props.a + this.props.d + this.props.r

    //Percent of total envelope time (not counting sustain)
    let relative_a = this.props.a / total_time
    let relative_d = this.props.d / total_time
    let relative_r = this.props.r / total_time

    //The sustain phase always has the same length
    let sustain_width = 10
    let rem_width = width - sustain_width

    //Distribute remaining width accoring to the relative lengths of each phase
    let absolute_a = relative_a * rem_width
    let absolute_d = relative_d * rem_width
    let absolute_r = relative_r * rem_width

    return [absolute_a, absolute_d, sustain_width, absolute_r]
  }

  /**
   * Returns a string to be used as 'd' attribute on an svg path that resembles an envelope shape given its parameters
   * @return {String}
   */
  generatePath() {
    let [
      attack_width,
      decay_width,
      sustain_width,
      release_width,
    ] = this.getPhaseLengths()

    //Generate the svg path
    let strokes = []
    strokes.push('M 0 ' + height) //Start at the bottom

    strokes.push(this.linearStrokeTo(attack_width, -height))
    strokes.push(
      this.exponentialStrokeTo(decay_width, height * (1 - this.props.s))
    )
    strokes.push(this.linearStrokeTo(sustain_width, 0))
    strokes.push(this.exponentialStrokeTo(release_width, height * this.props.s))

    return strokes.join(' ')
  }

  /**
   * Constructs a command for an svg path that resembles an exponential curve
   * @param {Number} dx
   * @param {Number} dy
   * @return {String} command
   */
  exponentialStrokeTo(dx, dy) {
    return ['c', dx / 5, dy / 2, dx / 2, dy, dx, dy].join(' ')
  }

  /**
   * Constructs a line command for an svg path
   * @param {Number} dx
   * @param {Number} dy
   * @return {String} command
   */
  linearStrokeTo(dx, dy) {
    return 'l ' + dx + ' ' + dy
  }

  render() {
    return (
      <Wrapper
        height={this.props.height}
        contextBackgroundColor={this.props.contextBackgroundColor}
      >
        <svg
          width="100%"
          height="100%"
          style={this.props.style}
          viewBox={'0 0 100 100'}
          preserveAspectRatio="none"
        >
          <rect
            width={width}
            height={height}
            style={{ fill: this.props.backgroundColor }}
          />
          {this.renderTimeLines()}
          <path
            d={this.generatePath()}
            style={{
              fill: 'none',
              stroke: this.props.lineColor,
              strokeWidth: '2',
            }}
            vectorEffect="non-scaling-stroke"
          />
          {this.renderPhaseLines()}
        </svg>
      </Wrapper>
    )
  }

  /**
   * Renders a series of lines with exponentialy increasing distance between them
   */
  renderTimeLines() {
    var total_time = this.props.a + this.props.d + this.props.r

    let loglines = []
    for (var i = 1e-6; i < 100; i = i * Math.E) {
      if (i > total_time) {
        break
      }
      if (i / total_time > 1e-2) {
        loglines.push(
          <line
            key={i}
            x1={(i / total_time) * width}
            y1="0"
            x2={(i / total_time) * width}
            y2={height}
            style={{
              fill: 'none',
              stroke: Color(this.props.lineColor).alpha(0.2).rgb().toString(),
              strokeWidth: '1',
            }}
            vectorEffect="non-scaling-stroke"
          />
        )
      }
    }

    return loglines
  }

  /**
   * Renders a line between each phase
   */
  renderPhaseLines() {
    let widths = this.getPhaseLengths()

    let plines = []
    let pos = 0
    for (var i = 0; i < widths.length - 1; i++) {
      pos += widths[i]
      plines.push(
        <line
          key={i}
          x1={pos}
          y1="0"
          x2={pos}
          y2={height}
          style={{
            fill: 'none',
            strokeWidth: '1',
            stroke: Color(this.props.lineColor).alpha(0.7).rgb().toString(),
            strokeDasharray: '5,5',
          }}
          vectorEffect="non-scaling-stroke"
        />
      )
    }

    return plines
  }
}

ADSRGraph.propTypes = {
  a: PropTypes.number.isRequired,
  d: PropTypes.number.isRequired,
  s: PropTypes.number.isRequired,
  r: PropTypes.number.isRequired,

  backgroundColor: PropTypes.string,
  contextBackgroundColor: PropTypes.string,
  lineColor: PropTypes.string,
  height: PropTypes.number,
}

ADSRGraph.defaultProps = {
  backgroundColor: 'rgb(40, 56, 68)',
  contextBackgroundColor: 'rgb(30, 30, 30)',
  lineColor: '#DDDDDD',
  height: 150,
}

export default ADSRGraph
