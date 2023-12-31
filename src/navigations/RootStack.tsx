/* eslint-disable react/react-in-jsx-scope */
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  Dashboard,
  EditEmployee,
  EditIncoming,
  EditOutgoing,
  Login,
  Report,
  Stock,
} from '../screens';
import {RootStackParamList} from '../types/navigation';
import OutgoingStack from './OutgoingStack';
import IncomingStack from './IncomingStack';
import EmployeeStack from './EmployeeStack';

const RootNavigation = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  return (
    <RootNavigation.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <RootNavigation.Screen
        name="Dashboard"
        component={Dashboard}
        options={{headerShown: false}}
      />
      <RootNavigation.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <RootNavigation.Screen
        name="EmployeeStack"
        component={EmployeeStack}
        options={{headerShown: true, title: 'Data Karyawan'}}
      />
      <RootNavigation.Screen
        name="EditEmployee"
        component={EditEmployee}
        options={{headerShown: true, title: 'Edit Data Karyawan'}}
      />
      <RootNavigation.Screen
        name="Stock"
        component={Stock}
        options={{headerShown: true, title: 'Stok Barang'}}
      />
      <RootNavigation.Screen
        name="Report"
        component={Report}
        options={{headerShown: true, title: 'Laporan'}}
      />
      <RootNavigation.Screen
        name="IncomingStack"
        component={IncomingStack}
        options={{headerShown: true, title: 'Transaksi Masuk'}}
      />
      <RootNavigation.Screen
        name="EditIncoming"
        component={EditIncoming}
        options={{headerShown: true, title: 'Edit Transaksi Masuk'}}
      />
      <RootNavigation.Screen
        name="OutgoingStack"
        component={OutgoingStack}
        options={{headerShown: true, title: 'Transaksi Keluar'}}
      />
      <RootNavigation.Screen
        name="EditOutgoing"
        component={EditOutgoing}
        options={{headerShown: true, title: 'Edit Transaksi Keluar'}}
      />
    </RootNavigation.Navigator>
  );
};

export default RootStack;
