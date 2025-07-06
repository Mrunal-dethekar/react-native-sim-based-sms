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
  ScrollView,
} from 'react-native';
import { sendSms, getSimInfo, type SimInfo } from 'react-native-sim-based-sms';

export default function App() {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [simInfoList, setSimInfoList] = React.useState<SimInfo[]>([]);

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

  React.useEffect(() => {
    const fetchSimInfo = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        ]);

        if (
          granted['android.permission.READ_PHONE_NUMBERS'] === 'granted' &&
          granted['android.permission.READ_PHONE_STATE'] === 'granted'
        ) {
          const sims = await getSimInfo();
          setSimInfoList(sims);
        } else {
          Alert.alert('Permission denied', 'READ_PHONE_STATE is required');
        }
      } catch (error) {
        console.error('Failed to fetch SIM info:', error);
      }
    };

    fetchSimInfo();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>React Native SIM SMS</Text>

        {simInfoList.length > 0 && (
          <View style={styles.simList}>
            {simInfoList.map((sim, index) => (
              <Text key={index} style={styles.simItem}>
                SIM {sim.simSlotIndex + 1}: {sim.displayName} (
                {sim.phoneNumber || 'N/A'})
              </Text>
            ))}
          </View>
        )}

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
          {simInfoList.map((sim) => (
            <TouchableOpacity
              key={sim.simSlotIndex}
              style={styles.button}
              onPress={() => handleSendSms(sim.simSlotIndex)}
            >
              <Text style={styles.buttonText}>
                Send from SIM {sim.simSlotIndex + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  simList: {
    marginBottom: 20,
    width: '100%',
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  simItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
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
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 2,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
