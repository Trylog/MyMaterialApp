import React, { useRef, useState } from "react";
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";
import {
	Provider as PaperProvider,
	Text,
	TextInput,
	Menu,
	Card,
	useTheme,
	MD3LightTheme as DefaultThemeM,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import moment from "moment";
import {
	NavigationContainer,
	NavigationIndependentTree,
	DefaultTheme,
} from "@react-navigation/native";
import { Colors } from "@/Colors";

const Tab = createMaterialTopTabNavigator();

const theme = {
	...DefaultThemeM,
	colors: Colors.colors,
};

const theme2 = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: "rgb(103, 80, 164)",
	},
};

export default function App() {
	return (
		<PaperProvider theme={theme}>
			{/* Only one NavigationContainer at the root level */}
			<NavigationIndependentTree>
				<NavigationContainer theme={theme2}>
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
		if (!startDate || !endDate) return "";
		const start = moment(startDate);
		const end = moment(endDate);
		const duration = moment.duration(end.diff(start));
		const years = duration.years();
		const months = duration.months();
		const days = duration.days();
		const monthsFull = Math.floor(duration.asMonths());
		const daysFull = Math.floor(duration.asDays());
		let result = "";
		if (years == 1) {
			result = result.concat("1 rok");
		} else if (years >= 2) {
			if (Math.floor(years / 10) != 1 && years % 10 >= 2 && years % 10 < 5) {
				result = result.concat(years.toString(), " lata");
			} else {
				result = result.concat(years.toString(), " lat");
			}
		}
		if (months >= 1) {
			if (years >= 1) result = result.concat(", ");
			if (months == 1) {
				result = result.concat("1 miesiąc");
			} else if (months >= 2 && months < 5) {
				result = result.concat(months.toString(), " miesiące");
			} else if (months >= 5) {
				result = result.concat(months.toString(), " miesięcy");
			}
		}
		if (years > 0 || months > 0) {
			if (days == 1) {
				result = result.concat(", 1 dzień");
			} else if (days >= 2) {
				result = result.concat(", ", days.toString(), " dni");
			}
			result = result.concat("\n");
		}
		if (years >= 1) {
			if (
				Math.floor(monthsFull / 10) != 1 &&
				monthsFull % 10 >= 2 &&
				monthsFull % 10 < 5
			) {
				result = result.concat(monthsFull.toString(), " miesiące lub ");
			} else {
				result = result.concat(monthsFull.toString(), " miesięcy lub ");
			}
		}
		if (daysFull == 1) {
			result = result.concat("1 dzień");
		} else if (daysFull >= 2) {
			result = result.concat(daysFull.toString(), " dni");
		}
		console.log(result);
		return result;
	};

	const inputStartRef = useRef<any>(null);
	const inputEndRef = useRef<any>(null);

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={styles.content}>
				<TextInput
					showSoftInputOnFocus={false}
					caretHidden={true}
					ref={inputStartRef}
					mode="outlined"
					label="Data początkowa"
					onFocus={() => setShowStartPicker(true)}
					value={startDate ? moment(startDate).format("DD/MM/YYYY") : ""}
					right={
						<TextInput.Icon icon="calendar" />
					}
					style={styles.input}
				/>
				{showStartPicker && (
					<DateTimePicker
						value={startDate || new Date()}
						mode="date"
						onChange={(_, date) => {
							setShowStartPicker(false);
							if (date) setStartDate(date);
							inputStartRef.current.blur();
						}}
					/>
				)}
				<TextInput
					showSoftInputOnFocus={false}
					caretHidden={true}
					ref={inputEndRef}
					mode="outlined"
					label="Data końcowa"
					onFocus={() => setShowEndPicker(true)}
					value={endDate ? moment(endDate).format("DD/MM/YYYY") : ""}
					right={
						<TextInput.Icon icon="calendar" />
					}
					style={styles.input}
				/>
				{showEndPicker && (
					<DateTimePicker
						value={endDate || new Date()}
						mode="date"
						onChange={(_, date) => {
							setShowEndPicker(false);
							if (date) setEndDate(date);
							inputEndRef.current.blur();
						}}
					/>
				)}
				<Card style={styles.resultCard} elevation={0}>
					<Text style={styles.result}>{calculateDifference()}</Text>
				</Card>
			</View>
		</TouchableWithoutFeedback>
	);
}

function AddDays() {
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [days, setDays] = useState("");
	const [years, setYears] = useState("");
	const [months, setMonths] = useState("");
	const [operation, setOperation] = useState("Dodaj");
	const [showPicker, setShowPicker] = useState(false);
	const [menuVisible, setMenuVisible] = useState(false);

	const calculateNewDate = () => {
		if (!startDate || (!days && !years && !months)) return "";
		const start = moment(startDate);
		const result =
			operation === "Dodaj"
				? start.add(years, "years").add(months, "months").add(days, "days")
				: start
						.subtract(years, "years")
						.subtract(months, "months")
						.subtract(days, "days");
		return result.format("DD/MM/YYYY");
	};

	const inputStartRef = useRef<any>(null);
	const inputPickRef = useRef<any>(null);

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={styles.content}>
				<TextInput
					showSoftInputOnFocus={false}
					caretHidden={true}
					ref={inputStartRef}
					mode="outlined"
					label="Data początkowa"
					onFocus={() => setShowPicker(true)}
					value={startDate ? moment(startDate).format("DD/MM/YYYY") : ""}
					right={
						<TextInput.Icon icon="calendar" />
					}
					style={styles.input}
				/>
				{showPicker && (
					<DateTimePicker
						value={startDate || new Date()}
						mode="date"
						onChange={(_, date) => {
							setShowPicker(false);
							if (date) setStartDate(date);
							inputStartRef.current.blur();
						}}
					/>
				)}

				<Menu
					visible={menuVisible}
					onDismiss={() => setMenuVisible(false)}
					anchor={
						<TextInput
							ref={inputPickRef}
							showSoftInputOnFocus={false}
							caretHidden={true}
							mode="outlined"
							style={styles.input}
							onFocus={() => setMenuVisible(true)}
						>
							{operation}
						</TextInput>
					}
				>
					<Menu.Item
						onPress={() => {
							setOperation("Dodaj");
							setMenuVisible(false);
							inputPickRef.current.blur();
						}}
						title="Dodaj"
					/>
					<Menu.Item
						onPress={() => {
							setOperation("Odejmij");
							setMenuVisible(false);
							inputPickRef.current.blur();
						}}
						title="Odejmij"
					/>
				</Menu>

				<TextInput
					label="Liczba lat"
					keyboardType="numeric"
					value={years}
					onChangeText={setYears}
					style={styles.input}
					mode="outlined"
				/>
				<TextInput
					label="Liczba miesięcy"
					keyboardType="numeric"
					value={months}
					onChangeText={setMonths}
					style={styles.input}
					mode="outlined"
				/>
				<TextInput
					label="Liczba dni"
					keyboardType="numeric"
					value={days}
					onChangeText={setDays}
					style={styles.input}
					mode="outlined"
				/>
				<Card style={styles.resultCard} elevation={0}>
					<Text style={styles.result}>{calculateNewDate()}</Text>
				</Card>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		padding: 20,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		rowGap: 20,
		backgroundColor: "white",
	},
	input: {
		marginVertical: 10,
		backgroundColor: "white",
	},
	resultCard: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "lightgray",
	},
	result: {
		marginVertical: 20,
		justifyContent: "center",
		fontSize: 16,
		fontWeight: "bold",
		backgroundColor: "white",
	},
});
