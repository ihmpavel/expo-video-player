import React from 'react'

import { Text, View } from 'react-native'
import { shallow } from 'enzyme'

function App() {
  return (
    <View>
      <Text>Hey!</Text>
    </View>
  )
}

describe('App', () => {
  it('snapshot test', () => {
    const tree = shallow(<App />)
    expect(tree).toMatchSnapshot()
  })
})
