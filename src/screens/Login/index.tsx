import {firebase} from '@react-native-firebase/auth';
import React, {useState} from 'react';
import {View} from 'react-native';
import {TextInput, Button, Text, useTheme} from 'react-native-paper';
// import {LoginProps} from './inteface';
import {useToast} from 'react-native-toast-notifications';
import {LoginProps} from './interface';
// import {useDispatch} from 'react-redux';
// import {setUserUID} from '../../store/feature/auth/action';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import {useSelector, useDispatch} from 'react-redux';

const Login: React.FC<LoginProps> = props => {
  const {navigation} = props;
  const toast = useToast();
  // const theme = useTheme();
  // const dispatch = useDispatch();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // const saveDataToAsyncStorage = async (uid: string) => {
  //   try {
  //     const key = 'userUid'; // Ganti dengan nama kunci yang sesuai untuk data Anda
  //     const value: string = uid; // Ganti dengan nilai yang ingin Anda simpan
  //     await AsyncStorage.setItem(key, value);
  //     console.log('Data berhasil disimpan di AsyncStorage.', uid);
  //   } catch (error) {
  //     console.error('Gagal menyimpan data di AsyncStorage:', error);
  //   }
  // };

  const handleLogin = () => {
    if (email === '' || password === '') {
      toast.show('Masukkan email dan password untuk login!', {
        type: 'waring',
        duration: 1000,
      });
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;
          if (user.emailVerified === true) {
            toast.show('Login berhasil!', {
              type: 'success',
              duration: 2000,
            });
            // console.log('user ', user.uid);
            // dispatch(setUserUID(user.uid));
            // saveDataToAsyncStorage(user.uid);
            navigation.reset({
              index: 0,
              routes: [{name: 'Dashboard'}],
            });
          }
          if (user.emailVerified === false) {
            toast.show('Login berhasil!', {
              type: 'success',
              duration: 2000,
            });
            // console.log('user ', user.uid);
            // dispatch(setUserUID(user.uid));
            // saveDataToAsyncStorage(user.uid);
            navigation.reset({
              index: 0,
              routes: [{name: 'Dashboard'}],
            });
            // toast.show(
            //   'Email belum terverifikasi. Silahkan periksa email anda!',
            //   {
            //     type: 'warning',
            //     duration: 2000,
            //   },
            // );
          }
        })
        .catch(error => {
          if (error.code === 'auth/invalid-email') {
            toast.show('Masukkan email yang valid!', {
              type: 'danger',
              duration: 2000,
            });
          }
          if (error.code === 'auth/user-not-found') {
            toast.show('Email belum terdaftar!', {
              type: 'danger',
              duration: 2000,
            });
          }
          if (error.code === 'auth/wrong-password') {
            toast.show('Password salah!', {
              type: 'danger',
              duration: 2000,
            });
          }
          if (error.code === 'auth/too-many-requests') {
            toast.show('Terlalu banyak percobaan login. Coba lagi nanti!', {
              type: 'danger',
              duration: 2000,
            });
          }
        });
    }
  };

  return (
    <View style={{padding: 16, backgroundColor: 'white'}}>
      <View
        style={{height: '20%', justifyContent: 'flex-end', paddingBottom: 20}}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: 'black',
          }}>
          Login
        </Text>
      </View>
      <View
        style={{height: '80%', justifyContent: 'center', paddingBottom: 100}}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={{marginBottom: 20}}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={{marginBottom: 20}}
        />
        <Button
          mode="contained"
          onPress={handleLogin}
          style={{borderRadius: 10}}>
          Login
        </Button>
        {/* <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            justifyContent: 'flex-end',
          }}>
          <Text
            style={{color: theme.colors.primary, fontSize: 16}}
            onPress={() => navigation.navigate('Dashboard')}>
            Ke Dashboard
          </Text>
        </View> */}
        {/* <View
          style={{
            flexDirection: 'row',
            marginTop: 70,
            justifyContent: 'center',
          }}>
          <Text style={{color: 'black', fontSize: 16}}>Belum punya akun? </Text>
          <View style={{borderColor: 'blue'}}>
            <Text
              style={{color: theme.colors.primary, fontSize: 16}}
              onPress={() => navigation.navigate('SignUp')}>
              Daftar disini
            </Text>
          </View>
        </View> */}
      </View>
    </View>
  );
};

export default Login;
