import { StyleSheet, View } from 'react-native'
import { Video } from 'expo-av'
import React from 'react'
import VideoPlayer from 'expo-video-player'

const App = () => (
  <View style={styles.container}>
    <VideoPlayer
      videoProps={{
        shouldPlay: true,
        resizeMode: Video.RESIZE_MODE_CONTAIN,
        source: {
          uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        },
      }}
      isPortrait={false}
    />
  </View>
)

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    flex: 1,
    justifyContent: 'center',
  },
})

export default App
