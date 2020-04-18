import React from 'react'
import { addParameters, addDecorator } from '@storybook/react'

import styled from 'styled-components'

const StoryWrapper = styled.div`
  padding: 32px;
`

addDecorator((story) => <StoryWrapper>{story()}</StoryWrapper>)
