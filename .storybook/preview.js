import React from 'react'
import { addParameters, addDecorator } from '@storybook/react'

import styled from 'styled-components'

const StoryWrapper = styled.div`
  padding: 32px;
`
addParameters({
  options: {
    storySort: (a, b) => {
      if (b[1].kind.includes('Docs')) {
        return 1
      }

      return a[1].kind !== b[1].kind
        ? a[1].id.localeCompare(b[1].id, { numeric: true })
        : 0
    },
  },
})
addDecorator((story) => <StoryWrapper>{story()}</StoryWrapper>)
