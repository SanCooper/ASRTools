import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import Router from './src/navigations/Router';
import Toast, {ToastProvider} from 'react-native-toast-notifications';
import {StyleSheet, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';
import store from './src/store/store';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#40BFFF',
    secondary: '#223263',
    tertiary: '#9098B1',
  },
};

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <ToastProvider>
            <Router />
            <Toast
              renderType={{
                danger: toast => (
                  <View style={styles.toastContainer}>
                    <View style={[styles.toastView, {backgroundColor: 'red'}]}>
                      <MaterialCommunityIcons
                        name="close"
                        size={16}
                        color="white"
                      />
                    </View>
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: '#f8110a',
                        marginTop: -4,
                      }}>
                      {toast.message}
                    </Text>
                  </View>
                ),
                warning: toast => (
                  <View style={styles.toastContainer}>
                    <View
                      style={[styles.toastView, {backgroundColor: '#f7d317'}]}>
                      <Entypo name="warning" size={16} color="white" />
                    </View>
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: '#f7d317',
                        marginTop: -4,
                      }}>
                      {toast.message}
                    </Text>
                  </View>
                ),
                success: toast => (
                  <View style={styles.toastContainer}>
                    <View
                      style={[styles.toastView, {backgroundColor: '#2fca58'}]}>
                      <Entypo name="checkmark-sharp" size={16} color="white" />
                    </View>
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: 'black',
                        marginTop: -4,
                      }}>
                      {toast.message}
                    </Text>
                  </View>
                ),
                normal: toast => (
                  <View style={styles.toastContainer}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: 'black',
                        marginTop: -4,
                      }}>
                      {toast.message}
                    </Text>
                  </View>
                ),
              }}
            />
          </ToastProvider>
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  toastContainer: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 6,
    flexDirection: 'row',
    maxWidth: '95%',
  },
  toastView: {
    width: 16,
    height: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});
