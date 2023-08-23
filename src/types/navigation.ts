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
  EditEmployee: {
    idKaryawan: string;
    nama: string;
    jabatan: string;
    gaji: number;
    jenisKelamin: string;
    timestamp: number;
  };
  EditOutgoing: {
    idPengeluaran: string;
    tanggal: string;
    namaPengeluaran: string;
    biaya: number;
    keterangan: string;
    timestamp: number;
  };
  EditIncoming: {
    idPemasukan: string;
    tanggalMasuk: string;
    tipeHP: string;
    noNota: string;
    IMEI: string;
    namaPelanggan: string;
    kerusakan: string;
    biaya: number;
    hargaPart: number;
    laba: number;
    timestamp: number;
  };
};
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

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
