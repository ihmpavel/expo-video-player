import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Video } from 'expo';
import VideoPlayer from 'expo-video-player';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <VideoPlayer
          videoProps={{
            shouldPlay: true,
            resizeMode: Video.RESIZE_MODE_CONTAIN,
            source: {
              uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
            }
          }}
          showFullscreenButton={false}
          isPortrait={true}
          playFromPositionMillis={0}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
