# react-native-sim-based-sms

A React Native library to send SMS from a specific SIM slot on Android.

## Installation

```sh
npm install react-native-sim-based-sms
```

## Usage

First, ensure you have added the necessary permissions to your `AndroidManifest.xml` as described in the setup section. Then, you can import and use the `sendSms` function in your component.

```javascript
import * as React from 'react';
import { Button, Alert, PermissionsAndroid, View } from 'react-native';
import { sendSms } from 'react-native-sim-based-sms';

export default function MySmsComponent() {

  const handleSendSms = async (simSlot: 0 | 1) => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      ]);

      if (
        granted['android.permission.SEND_SMS'] === 'granted' &&
        granted['android.permission.READ_PHONE_STATE'] === 'granted'
      ) {
        const phoneNumber = '+1234567890';
        const message = 'Hello from React Native!';
        const result = await sendSms(phoneNumber, message, simSlot);
        Alert.alert('Success', result);
      } else {
        Alert.alert('Permissions Denied', 'Cannot send SMS without required permissions.');
      }
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert('Error', error.message);
        }
    }
  };

  return (
    <View>
      <Button title="Send SMS from SIM 1" onPress={() => handleSendSms(0)} />
      <Button title="Send SMS from SIM 2" onPress={() => handleSendSms(1)} />
    </View>
  );
}
```

## Android Setup

You must add the following permissions to your app's main `AndroidManifest.xml` file, located at `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.SEND_SMS" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
```

## API

### `sendSms(phoneNumber, message, simSlot)`

Sends an SMS message to a given phone number from a specific SIM slot. This function is only available on Android.

| Parameter     | Type       | Description                                           |
| ------------- | ---------- | ----------------------------------------------------- |
| `phoneNumber` | `string`   | The recipient's phone number.                         |
| `message`     | `string`   | The content of the SMS message.                       |
| `simSlot`     | `0` or `1` | The SIM slot to send from (0 for SIM 1, 1 for SIM 2). |

**Returns:** A `Promise<string>` that resolves with a success message or rejects with an error.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
