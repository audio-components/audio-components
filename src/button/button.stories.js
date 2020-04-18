import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs'

import Button from '.'

const stories = storiesOf('Button', module)
stories.addDecorator(withKnobs)
stories.add('default', () => <Button>{text('label', 'Click me')}</Button>)
