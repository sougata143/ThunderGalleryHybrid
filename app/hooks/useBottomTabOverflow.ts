import { useState, useEffect } from 'react';
import { Platform, Keyboard } from 'react-native';

export default function useBottomTabOverflow() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  return {
    isKeyboardVisible,
    tabBarStyle: {
      display: isKeyboardVisible ? 'none' : 'flex',
      position: Platform.OS === 'ios' ? 'absolute' : 'relative',
      bottom: 0,
      left: 0,
      right: 0,
      elevation: 0,
      backgroundColor: 'transparent',
      borderTopWidth: 0,
    },
  };
}
