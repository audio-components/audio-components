import React, { useState } from 'react'
import styled from 'styled-components'

import ADSRGraph from '.'
import Knob from '../knob'

const KnobsWrapper = styled.div`
  padding-top: 16px;
  display: flex;
  justify-content: space-around;
`

const ADSRGraphPlayground = (props) => {
  const [a, setA] = useState(0.05)
  const [d, setD] = useState(0.2)
  const [s, setS] = useState(0.95)
  const [r, setR] = useState(1.3)

  return (
    <div>
      <ADSRGraph a={a} d={d} s={s} r={r} {...props} />
      <KnobsWrapper>
        <Knob
          min={0}
          max={5}
          value={a}
          onChange={setA}
          label="a"
          contextBackgroundColor={props.contextBackgroundColor}
        />
        <Knob
          min={0}
          max={5}
          value={d}
          onChange={setD}
          label="d"
          contextBackgroundColor={props.contextBackgroundColor}
        />
        <Knob
          min={0}
          max={1}
          value={s}
          onChange={setS}
          label="s"
          contextBackgroundColor={props.contextBackgroundColor}
        />
        <Knob
          min={0}
          max={5}
          value={r}
          onChange={setR}
          label="r"
          contextBackgroundColor={props.contextBackgroundColor}
        />
      </KnobsWrapper>
    </div>
  )
}

export default ADSRGraphPlayground
