import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useBottomTabOverflow() {
  const insets = useSafeAreaInsets();
  return insets.bottom;
}

export default useBottomTabOverflow;
