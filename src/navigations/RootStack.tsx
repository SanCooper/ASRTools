/* eslint-disable react/react-in-jsx-scope */
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  Dashboard,
  Employee,
  Login,
  Report,
  Stock,
  IncomingTransaction,
  OutgoingTransaction,
} from '../screens';
import {RootStackParamList} from '../types/navigation';

const RootNavigation = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  return (
    <RootNavigation.Navigator
      initialRouteName="Dashboard"
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
        name="Employee"
        component={Employee}
        options={{headerShown: false}}
      />
      <RootNavigation.Screen
        name="Stock"
        component={Stock}
        options={{headerShown: false}}
      />
      <RootNavigation.Screen
        name="Report"
        component={Report}
        options={{headerShown: false}}
      />
      <RootNavigation.Screen
        name="IncomingTransaction"
        component={IncomingTransaction}
        options={{headerShown: false}}
      />
      <RootNavigation.Screen
        name="OutgoingTransaction"
        component={OutgoingTransaction}
        options={{headerShown: false}}
      />
    </RootNavigation.Navigator>
  );
};

export default RootStack;
