import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export declare type RootStackParamList = {
  Login: undefined;
  Notification: undefined;
  DetailItem: {
    idProduct?: string;
  };
  Dashboard: undefined;
  Stock: undefined;
  IncomingTransaction: undefined;
  OutgoingTransaction: undefined;
  Report: undefined;
  Employee: undefined;
};
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export declare type TabParamList = {
  Beranda: undefined;
  Screen1: NavigatorScreenParams<null>;
  Screen2: NavigatorScreenParams<null>;
  Screen3: NavigatorScreenParams<null>;
  Screen4: undefined;
};

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

export declare type AuthParamList = {
  Login: undefined;
  Home: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};
export type AuthScreenProps<T extends keyof AuthParamList> =
  NativeStackScreenProps<AuthParamList, T>;
