import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  sendSms(
    phoneNumber: string,
    message: string,
    simSlot: number
  ): Promise<string>;
}

export default TurboModuleRegistry.get<Spec>('SimBasedSms');
