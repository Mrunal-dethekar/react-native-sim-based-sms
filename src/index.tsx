import { Platform } from 'react-native';
import NativeSimBasedSms from './NativeSimBasedSms';

export function sendSms(
  phoneNumber: string,
  message: string,
  simSlot: 0 | 1
): Promise<string> {
  if (Platform.OS !== 'android') {
    return Promise.reject(
      new Error('This feature is only available on Android.')
    );
  }

  if (!NativeSimBasedSms) {
    return Promise.reject(
      new Error("The native module for SimBasedSms doesn't seem to be linked.")
    );
  }

  return NativeSimBasedSms.sendSms(phoneNumber, message, simSlot);
}
