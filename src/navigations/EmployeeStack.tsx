import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {EmployeeList, Employee} from '../screens';
import {Dimensions} from 'react-native';
import {Text} from 'react-native-paper';
import {EmployeeParamList} from 'src/types/navigation';
import {Pallets} from '../theme';

const EmployeeTab = createMaterialTopTabNavigator<EmployeeParamList>();
const {width} = Dimensions.get('window');
const EmployeeStack = () => {
  return (
    <EmployeeTab.Navigator
      initialRouteName="Employee"
      screenOptions={() => {
        return {
          tabBarScrollEnabled: true,
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarLabel: ({children, focused}) => {
            return (
              <Text
                style={[
                  {
                    color: focused ? Pallets.primary_main : Pallets.netral_70,
                    width: width / 3 - 20,
                    fontSize: 16,
                    fontWeight: focused ? '600' : '400',
                    textTransform: 'capitalize',
                    textAlign: 'center',
                  },
                ]}>
                {children}
              </Text>
            );
          },
          swipeEnabled: false,
          tabBarIndicatorStyle: {
            backgroundColor: Pallets.primary_main,
          },
          tabBarPressColor: 'transparent',
          tabBarAllowFontScaling: false,
          tabBarItemStyle: {
            paddingTop: 6,
            paddingBottom: 4,
            width: width / 2,
          },
        };
      }}>
      <EmployeeTab.Screen
        name="Employee"
        component={Employee}
        options={{title: 'Input'}}
      />
      <EmployeeTab.Screen
        name="EmployeeList"
        component={EmployeeList}
        options={{title: 'Data'}}
      />
    </EmployeeTab.Navigator>
  );
};

export default EmployeeStack;
