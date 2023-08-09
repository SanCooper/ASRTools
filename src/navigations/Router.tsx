import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import RootStack from './RootStack';

type IRouter = {};
const Router: React.FC<IRouter> = () => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};

export default Router;
