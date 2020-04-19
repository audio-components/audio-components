import React, { useState } from 'react'

import Knob from '.'

const KnobPlayground = (props) => {
  const [value, onChange] = useState(0)
  return <Knob value={value} onChange={onChange} {...props} />
}

export default KnobPlayground
