import {View, Text, SafeAreaView, Pressable} from 'react-native';
import React from 'react';
import {Header} from '../../components/molecules';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {useDispatch} from 'react-redux';

const Dashboard = () => {
  // const {navigation} = props;
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const fetchDataStock = React.useCallback(async () => {
    const itemsCollection = firestore().collection('Stock');
    const snapshot = await itemsCollection.get();

    const items: any = [];
    snapshot.forEach(doc => {
      items.push({
        ...doc.data(),
      });
    });
    // Sort the items array by timestamp
    items.sort((a: any, b: any) => a.timestamp - b.timestamp);
    // setIncomingData(items);
    dispatch({type: 'SET_STOCK_DATA', payload: items});
  }, [dispatch]);

  React.useEffect(() => {
    fetchDataStock();
  }, [fetchDataStock]);

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
          onPress={() => navigation.navigate('Stock')}
          style={{
            width: '50%',
            height: 200,
            backgroundColor: 'green',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>Stock Barang</Text>
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
          onPress={() => navigation.navigate('Report')}
          style={{
            width: '50%',
            height: 200,
            backgroundColor: 'brown',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>Laporan</Text>
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
