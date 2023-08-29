import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {IncomingList, IncomingTransaction} from '../screens';
import {Dimensions} from 'react-native';
import {Text} from 'react-native-paper';
import {IncomingParamList} from 'src/types/navigation';
import {Pallets} from '../theme';

const IncomingTab = createMaterialTopTabNavigator<IncomingParamList>();
const {width} = Dimensions.get('window');
const IncomingStack = () => {
  return (
    <IncomingTab.Navigator
      initialRouteName="IncomingTransaction"
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
      <IncomingTab.Screen
        name="IncomingTransaction"
        component={IncomingTransaction}
        options={{title: 'Input'}}
      />
      <IncomingTab.Screen
        name="IncomingList"
        component={IncomingList}
        options={{title: 'Data'}}
      />
    </IncomingTab.Navigator>
  );
};

export default IncomingStack;
