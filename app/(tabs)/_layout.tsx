import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import {
  Provider as PaperProvider,
  Text,
  TextInput,
  Button,
  Menu,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import moment from 'moment';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <PaperProvider>
      {/* Only one NavigationContainer at the root level */}
      <NavigationIndependentTree>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Różnica dat" component={DateDifference} />
          <Tab.Screen name="Dodaj/Odejmij dni" component={AddDays} />
        </Tab.Navigator>
      </NavigationContainer>
      </NavigationIndependentTree>
    </PaperProvider>
  );
}

function DateDifference() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);  
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const calculateDifference = () => {
    if (!startDate || !endDate) return '';
    const start = moment(startDate);
    const end = moment(endDate);
    const duration = moment.duration(end.diff(start));
    return `${duration.years()} lat, ${duration.months()} miesięcy, ${duration.days()} dni`;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.content}>
        <Button
          mode="outlined"
          onPress={() => setShowStartPicker(true)}
          style={styles.input}
        >
          Wybierz początkową datę: {startDate ? moment(startDate).format('DD/MM/YYYY') : '---'}
        </Button>
        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            onChange={(_, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        <Button
          mode="outlined"
          onPress={() => setShowEndPicker(true)}
          style={styles.input}
        >
          Wybierz końcową datę: {endDate ? moment(endDate).format('DD/MM/YYYY') : '---'}
        </Button>
        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            onChange={(_, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}

        <Text style={styles.result}>{calculateDifference()}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

function AddDays() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [days, setDays] = useState('');
  const [operation, setOperation] = useState('Dodaj');
  const [showPicker, setShowPicker] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const calculateNewDate = () => {
    if (!startDate || !days) return '';
    const start = moment(startDate);
    const result = operation === 'Dodaj' ? start.add(days, 'days') : start.subtract(days, 'days');
    return result.format('DD/MM/YYYY');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.content}>
        <Button
          mode="outlined"
          onPress={() => setShowPicker(true)}
          style={styles.input}
        >
          Wybierz datę początkową: {startDate ? moment(startDate).format('DD/MM/YYYY') : '---'}
        </Button>
        {showPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            onChange={(_, date) => {
              setShowPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button onPress={() => setMenuVisible(true)}>
              {operation}
            </Button>
          }
        >
          <Menu.Item onPress={() => { setOperation('Dodaj'); setMenuVisible(false); }} title="Dodaj" />
          <Menu.Item onPress={() => { setOperation('Odejmij'); setMenuVisible(false); }} title="Odejmij" />
        </Menu>

        <TextInput
          label="Liczba dni"
          keyboardType="numeric"
          value={days}
          onChangeText={setDays}
          style={styles.input}
          mode='outlined'
        />

        <Text style={styles.result}>{calculateNewDate()}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginVertical: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
