import React from 'react'
import { addDecorator, addParameters } from '@storybook/react'
import { setOptions } from '@storybook/addon-options'
import styled from 'styled-components'

const StoryWrapper = styled.div`
  position: relative;
`

const StoryContainer = styled.div`
  padding: 32px;

  .StoryLayout {
    margin: -32px;
  }
`

const Story = ({ story }) => {
  return (
    <StoryWrapper>
      <StoryContainer>{story()}</StoryContainer>
    </StoryWrapper>
  )
}

addDecorator((story) => <Story story={story} />)

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

setOptions({
  addonPanelInRight: true,
})
