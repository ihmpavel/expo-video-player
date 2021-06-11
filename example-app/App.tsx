import { ScrollView, StyleSheet } from 'react-native'
import { Video } from 'expo-av'
import React from 'react'
import VideoPlayer from './lib/index'

const App = () => (
  <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
    <VideoPlayer
      videoProps={{
        shouldPlay: true,
        resizeMode: Video.RESIZE_MODE_CONTAIN,
        source: {
          uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        },
      }}
      defaultControlsVisible={true}
      style={{
        videoBackgroundColor: '#000',
        controlsBackgroundColor: '#000',
        width: 394,
        height: 800,
      }}
    />
  </ScrollView>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default App
