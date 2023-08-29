import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {OutgoingList, OutgoingTransaction} from '../screens';
import {Dimensions} from 'react-native';
import {Text} from 'react-native-paper';
import {OutgoingParamList} from 'src/types/navigation';
import {Pallets} from '../theme';

const OutgoingTab = createMaterialTopTabNavigator<OutgoingParamList>();
const {width} = Dimensions.get('window');
const OutgoingStack = () => {
  return (
    <OutgoingTab.Navigator
      initialRouteName="OutgoingTransaction"
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
      <OutgoingTab.Screen
        name="OutgoingTransaction"
        component={OutgoingTransaction}
        options={{title: 'Input'}}
      />
      <OutgoingTab.Screen
        name="OutgoingList"
        component={OutgoingList}
        options={{title: 'Data'}}
      />
    </OutgoingTab.Navigator>
  );
};

export default OutgoingStack;
