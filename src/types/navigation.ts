import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export declare type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Stock: undefined;
  Report: undefined;
  OutgoingStack: NavigatorScreenParams<OutgoingParamList>;
  IncomingStack: NavigatorScreenParams<IncomingParamList>;
  EmployeeStack: NavigatorScreenParams<EmployeeParamList>;
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

export declare type OutgoingParamList = {
  OutgoingTransaction: {
    keyword?: string;
  };
  OutgoingList: {
    keyword?: string;
  };
};
export type OutgoingScreenProps<T extends keyof OutgoingParamList> =
  CompositeScreenProps<
    MaterialTopTabScreenProps<OutgoingParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export declare type IncomingParamList = {
  IncomingTransaction: {
    keyword?: string;
  };
  IncomingList: {
    keyword?: string;
  };
};
export type IncomingScreenProps<T extends keyof IncomingParamList> =
  CompositeScreenProps<
    MaterialTopTabScreenProps<IncomingParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export declare type EmployeeParamList = {
  Employee: {
    keyword?: string;
  };
  EmployeeList: {
    keyword?: string;
  };
};
export type EmployeeScreenProps<T extends keyof EmployeeParamList> =
  CompositeScreenProps<
    MaterialTopTabScreenProps<EmployeeParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export declare type StockParamList = {
  StockTransaction: {
    keyword?: string;
  };
  StockList: {
    keyword?: string;
  };
};
export type StockScreenProps<T extends keyof StockParamList> =
  CompositeScreenProps<
    MaterialTopTabScreenProps<StockParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;
