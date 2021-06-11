import { Text, View } from 'react-native'
import renderer from 'react-test-renderer'

const App = () => (
  <View>
    <Text>Hey!</Text>
  </View>
)

describe('App', () => {
  it('snapshot test', () => {
    const tree = renderer.create(<App />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
