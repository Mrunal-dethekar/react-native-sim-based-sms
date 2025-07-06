import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { SimInfo } from './types';

export interface Spec extends TurboModule {
  sendSms(
    phoneNumber: string,
    message: string,
    simSlot: number
  ): Promise<string>;
  getSimInfo(): Promise<SimInfo[]>;
}

export default TurboModuleRegistry.get<Spec>('SimBasedSms');
