import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import DrawerTitle from '../components/drawer-title'

storiesOf('DrawerTitle', module)
  .add('with children', () => {
    return <DrawerTitle>Bananas</DrawerTitle>
  })
