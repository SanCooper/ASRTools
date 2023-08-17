import {View, Text, SafeAreaView, Pressable} from 'react-native';
import React from 'react';
import {Header} from '../../components/molecules';
import {useNavigation} from '@react-navigation/native';

const Dashboard = () => {
  // const {navigation} = props;
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Header.Basic title="DASHBOARD" />
      <View style={{flexDirection: 'row'}}>
        <Pressable
          onPress={() => navigation.navigate('IncomingStack')}
          style={{
            width: '50%',
            height: 200,
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>Transaksi Masuk</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('OutgoingStack')}
          style={{
            width: '50%',
            height: 200,
            backgroundColor: 'blue',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>Transaksi Keluar</Text>
        </Pressable>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Pressable
          onPress={() => navigation.navigate('EmployeeStack')}
          style={{
            width: '50%',
            height: 200,
            backgroundColor: 'purple',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>Data Karyawan</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Report')}
          style={{
            width: '50%',
            height: 200,
            backgroundColor: 'green',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>Laporan</Text>
        </Pressable>
      </View>
      <View style={{flexDirection: 'row'}}>
        {/* <Pressable
          onPress={() => navigation.navigate('Transaction')}
          style={{
            width: '50%',
            height: 200,
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>Transaksi</Text>
        </Pressable> */}
        <Pressable
          onPress={() => navigation.navigate('Stock')}
          style={{
            width: '50%',
            height: 200,
            backgroundColor: 'blue',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>Stock Barang</Text>
        </Pressable>
      </View>
      <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 5}}>
        <Text
          style={{
            color: 'black',
            alignSelf: 'center',
            justifyContent: 'flex-end',
          }}>
          © ASRTools
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
