import React, { memo, useCallback, useState } from "react";
import { View, Text } from "react-native";
import { Button, HelperText, Surface, TextInput, Title } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import appActions from "../../store/app/actions";
import { appSelectors } from "../../store/app/selectors";
import { LoadingState } from "../../store/types";
import { theme } from "../../ui/global";
import { styles } from "./style";

const Auth = () => {
	const dispatch = useDispatch();

	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");

	const isLoading = useSelector(appSelectors.loadingState) === LoadingState.Loading;

	const onChangeTextLogin = useCallback((login) => setLogin(login), [setLogin]);
	const onChangeTextPassword = useCallback((password) => setPassword(password), [setPassword]);

	const isLoginEmpty = useCallback(() => !login.length, [login]);
	const isPasswordEmpty = useCallback(() => !password.length, [password]);

	const onLogin = useCallback(() => {
		if (!isLoginEmpty() && !isPasswordEmpty()) {
			dispatch(appActions.login({ login, password }));
		}
	}, [login, password]);

	return (
		<View style={styles.container}>
			<Surface
				style={styles.surface}
				accessibilityComponentType="surface"
				accessibilityTraits="surface">
				<Title style={styles.title}>Вход</Title>
				<TextInput
					autoFocus
					label="Логин"
					mode="outlined"
					value={login}
					disabled={isLoading}
					textContentType="username"
					autoCompleteType="username"
					autoCapitalize="none"
					style={styles.input}
					accessibilityComponentType="button"
					accessibilityTraits="button"
					onChangeText={onChangeTextLogin}
				/>
				<HelperText type="error" style={styles.helperText} visible={isLoginEmpty()}>
					Обязательное поле
				</HelperText>
				<TextInput
					label="Пароль"
					mode="outlined"
					value={password}
					disabled={isLoading}
					textContentType="password"
					autoCompleteType="password"
					secureTextEntry
					style={styles.input}
					accessibilityComponentType="button"
					accessibilityTraits="button"
					onChangeText={onChangeTextPassword}
				/>
				<HelperText type="error" style={styles.helperText} visible={isPasswordEmpty()}>
					Обязательное поле
				</HelperText>
				<Button
					mode="contained"
					dark
					style={styles.button}
					loading={isLoading}
					accessibilityComponentType="button"
					accessibilityTraits="button"
					onPress={onLogin}>
					<Text>ВОЙТИ</Text>
				</Button>
			</Surface>
		</View>
	);
};

export default memo(Auth);
