import { Platform } from 'react-native';
import NativeSimBasedSms from './NativeSimBasedSms';
import type { SimInfo } from './types';

export type { SimInfo };

/**
 * Sends an SMS from a specific SIM card on Android.
 * Requires SEND_SMS, READ_PHONE_STATE permission.
 * @returns {Promise<string>} A promise that resolves with a string.
 */
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

/**
 * Retrieves a list of active SIM cards and their information.
 * Requires READ_PHONE_STATE permission.
 * @returns {Promise<Array<SimInfo>>} A promise that resolves with an array of SIM card info objects.
 */
export function getSimInfo(): Promise<Array<SimInfo>> {
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

  return NativeSimBasedSms.getSimInfo();
}
