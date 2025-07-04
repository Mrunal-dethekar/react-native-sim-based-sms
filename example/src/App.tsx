import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  SafeAreaView,
} from 'react-native';
import { sendSms } from 'react-native-sim-based-sms';

export default function App() {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [message, setMessage] = React.useState('');

  const requestSmsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      ]);
      if (
        granted['android.permission.SEND_SMS'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_PHONE_STATE'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        return true;
      } else {
        Alert.alert('Permissions not granted');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleSendSms = async (simSlot: 0 | 1) => {
    const hasPermission = await requestSmsPermission();
    if (!hasPermission) {
      return;
    }

    if (!phoneNumber || !message) {
      Alert.alert('Please enter a phone number and message');
      return;
    }

    try {
      const result = await sendSms(phoneNumber, message, simSlot);
      Alert.alert('Success', result);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>React Native SIM SMS</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number (e.g., +1234567890)"
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Message"
        onChangeText={setMessage}
        value={message}
        multiline
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSendSms(0)}
        >
          <Text style={styles.buttonText}>Send from SIM 1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSendSms(1)}
        >
          <Text style={styles.buttonText}>Send from SIM 2</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
