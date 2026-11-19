import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export async function hapticSelect(): Promise<void> {
  try {
    await Haptics.selectionAsync();
  } catch {
    // Web and simulators may not have a vibrator.
  }
}

export async function hapticSwitch(on: boolean): Promise<void> {
  try {
    if (Platform.OS === 'android') {
      await Haptics.performAndroidHapticsAsync(
        on ? Haptics.AndroidHaptics.Toggle_On : Haptics.AndroidHaptics.Toggle_Off,
      );
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Missing vibrator is not a failure.
  }
}
