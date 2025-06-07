import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {
  TriggerType,
  TimestampTrigger,
  RepeatFrequency,
  AndroidImportance,
} from '@notifee/react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { defaultTimes, DEFAULT_GMT } from '../constants/notificationDefaults';
import { ConvertTimeToTimezone } from '../utils/TimezoneConverter';

// Defined Colors
const COLOR_DARK = '#18024E';
const WHITE_BACKGROUND = '#FDFFFC';
const BORDER_COLOR = '#E0E0E0';
const ACCENT_COLOR = '#FDA2B1';

// +++ NEW HELPER FUNCTION +++
/**
 * Formats a string of numbers into hh:mm format automatically.
 * @param text The raw input string.
 * @returns A formatted time string.
 */
const formatTimeInput = (text: string) => {
  // Remove all non-digit characters
  const cleaned = text.replace(/\D/g, '');

  // Limit to 4 digits (e.g., hhmm)
  const limited = cleaned.substring(0, 4);

  // If more than 2 digits, automatically insert a colon
  if (limited.length > 2) {
    return `${limited.substring(0, 2)}:${limited.substring(2)}`;
  }

  return limited;
};


export default function NotificationSettingScreen({ navigation }) {
  const [mealTimes, setMealTimes] = useState(defaultTimes);
  const [timezone, setTimezone] = useState(DEFAULT_GMT);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ... (loadSettings, useEffect, handleTimezoneChange functions are unchanged) ...
  const loadSettings = useCallback(async () => {
    try {
      const storedTimes = await AsyncStorage.getItem('mealTimes');
      const storedZone = await AsyncStorage.getItem('timezone');
      if (storedTimes) {
          setMealTimes(JSON.parse(storedTimes));
      } else {
          setMealTimes(defaultTimes);
      }
      if (storedZone) setTimezone(Number(storedZone));
    } catch (e) {
      Alert.alert('Error', 'Gagal memuat pengaturan.');
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleTimezoneChange = (newGMT: number) => {
    if (!isEditMode) return;
    if (newGMT === timezone) return;

    const updatedTimes = Object.fromEntries(
      Object.entries(mealTimes).map(([key, time]) => [
        key,
        ConvertTimeToTimezone(time, timezone, newGMT),
      ])
    );
    setTimezone(newGMT);
    setMealTimes(updatedTimes);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const time of Object.values(mealTimes)) {
        if (!/^\d{2}:\d{2}$/.test(time)) {
          Alert.alert('Format Salah', 'Harap masukkan waktu dalam format hh:mm, contoh: 07:00.');
          setIsSaving(false);
          return;
        }
      }

      await AsyncStorage.setItem('mealTimes', JSON.stringify(mealTimes));
      await AsyncStorage.setItem('timezone', timezone.toString());
      // await updateNotifications(mealTimes); // Assuming this function is correct

      Alert.alert('Sukses', 'Pengingat makan telah diperbarui.');
      setIsEditMode(false);
    } catch (e) {
      console.error('Save failed:', e);
      Alert.alert('Error', 'Gagal menyimpan pengingat.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
      loadSettings();
      setIsEditMode(false);
  };

  // +++ UPDATED FUNCTION +++
  const handleTimeChange = (key: string, text: string) => {
    // Use the new formatter to ensure the format is always correct
    const formattedTime = formatTimeInput(text);
    setMealTimes(prev => ({ ...prev, [key]: formattedTime }));
  };

  const formatMealLabel = (key: string) => {
      return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ... (Header JSX is unchanged) ... */}
       <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Icon name="arrow-left" size={26} color={COLOR_DARK} />
        </TouchableOpacity>
        <Text style={styles.title}>Pengingat Makan</Text>
        <View style={styles.headerRight}>
            {isEditMode ? (
                <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
                    <Text style={styles.headerButtonText}>Batal</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={() => setIsEditMode(true)} style={styles.headerButton}>
                    <Text style={styles.headerButtonText}>Edit</Text>
                </TouchableOpacity>
            )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Timezone</Text>
        <View style={[styles.pickerContainer, !isEditMode && styles.disabled]}>
            <Icon name="clock-time-four-outline" size={22} color={COLOR_DARK} style={styles.pickerIconPrefix}/>
            <Picker
                enabled={isEditMode}
                selectedValue={timezone}
                onValueChange={(itemValue) => handleTimezoneChange(itemValue)}
                style={styles.picker}
                dropdownIconColor={isEditMode ? COLOR_DARK : BORDER_COLOR}
            >
                <Picker.Item label="WIB (GMT +7)" value={7} />
                <Picker.Item label="WITA (GMT +8)" value={8} />
                <Picker.Item label="WIT (GMT +9)" value={9} />
            </Picker>
        </View>

        <Text style={styles.sectionTitle}>Waktu Makan</Text>
        <View style={styles.listContainer}>
          {Object.entries(mealTimes).map(([key, value]) => (
            <View key={key} style={styles.mealRow}>
              <Text style={styles.mealLabel}>{formatMealLabel(key)}</Text>
              {/* This TextInput now uses the new reliable logic */}
              <TextInput
                style={[styles.input, !isEditMode && styles.disabledInput]}
                value={value}
                onChangeText={(text) => handleTimeChange(key, text)}
                placeholder="hh:mm"
                keyboardType="numeric"
                maxLength={5} // maxLength is still useful here
                editable={isEditMode}
              />
            </View>
          ))}
        </View>

        {isEditMode && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
            {isSaving ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ... (Styles are unchanged) ...
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE_BACKGROUND,
    },
    scrollContainer: {
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
    },
    headerButton: {
        padding: 8,
    },
    headerRight: {
        width: 60,
        alignItems: 'flex-end',
    },
    headerButtonText: {
        color: COLOR_DARK,
        fontSize: 16,
        fontWeight: '600',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLOR_DARK,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOR_DARK,
        marginBottom: 12,
        marginTop: 16,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: BORDER_COLOR,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    picker: {
        flex: 1,
        color: COLOR_DARK,
    },
    pickerIconPrefix: {
        marginLeft: 16,
        marginRight: 8,
    },
    listContainer: {
        borderWidth: 1.5,
        borderColor: BORDER_COLOR,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    mealRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
    },
    mealLabel: {
        fontSize: 16,
        color: COLOR_DARK,
        fontWeight: '500',
    },
    input: {
        fontSize: 16,
        color: COLOR_DARK,
        borderWidth: 1.5,
        borderColor: ACCENT_COLOR,
        borderRadius: 8,
        textAlign: 'center',
        width: 80,
        paddingVertical: 8,
        paddingHorizontal: 4,
        fontWeight: '600',
    },
    disabledInput: {
        backgroundColor: '#f5f5f5',
        borderColor: BORDER_COLOR,
        color: '#888',
    },
    disabled: {
        backgroundColor: '#f5f5f5',
        opacity: 0.7,
    },
    saveButton: {
        backgroundColor: COLOR_DARK,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 32,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});