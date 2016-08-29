import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import HamburgerButton from '../components/hamburger-button'

storiesOf('HamburgerButton', module)
  .add('default button', () => {
    return <HamburgerButton onClick={action('clicked')} />
  })
  .add('specified button', () => {
    return <HamburgerButton btnType="success" onClick={action('clicked')} />
  })
