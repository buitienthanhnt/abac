Install the package:bash
npm install react-native-orientation-locker

// Hãy thận trọng khi sử dụng mã.Trigger rotation programmatically:javascript

import Orientation from 'react-native-orientation-locker';
import { useEffect } from 'react';

export default function VideoScreen() {
  useEffect(() => {
    // Force screen to rotate to landscape
    Orientation.lockToLandscape();

    return () => {
      // Return to portrait when leaving the screen
      Orientation.lockToPortrait();
    };
  }, []);
}