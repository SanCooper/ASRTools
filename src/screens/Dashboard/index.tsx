import {View, Text, SafeAreaView, Pressable, ScrollView} from 'react-native';
import React from 'react';
import {Header} from '../../components/molecules';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/store/store';
import {unixToDate} from '../../utils';

const Dashboard = () => {
  // const {navigation} = props;
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const dataLog = useSelector((state: RootState) => state.activity.logActivity);

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

  const fetchDataLog = React.useCallback(async () => {
    const itemsCollection = firestore().collection('LogActivity');
    const snapshot = await itemsCollection.get();

    const items: any = [];
    snapshot.forEach(doc => {
      items.push({
        ...doc.data(),
      });
    });
    // Sort the items array by timestamp
    items.sort((a: any, b: any) => b.timestamp - a.timestamp);
    // setIncomingData(items);
    dispatch({type: 'SET_ACTIVITY_DATA', payload: items});
  }, [dispatch]);

  React.useEffect(() => {
    fetchDataStock();
  }, [fetchDataStock]);

  React.useEffect(() => {
    fetchDataLog();
  }, [fetchDataLog]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Header.Basic title="DASHBOARD" />
      <ScrollView>
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
        <View style={{flex: 1, marginTop: 16}}>
          <Text
            style={{
              color: 'black',
              alignSelf: 'center',
              justifyContent: 'flex-end',
              fontSize: 16,
              marginBottom: 5,
            }}>
            Log
          </Text>
          {dataLog.length > 0 &&
            dataLog.slice(0, 20).map((item: any, index: number) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    marginBottom: 2,
                    backgroundColor:
                      item.tipe === 'Delete'
                        ? '#f94449'
                        : item.tipe === 'Input'
                        ? '#bfe3b4'
                        : '#93CAED',
                  }}>
                  <Text style={{color: 'black'}}>
                    {unixToDate(item.timestamp)}
                  </Text>
                  <Text
                    style={{
                      color: 'black',
                      marginLeft: 8,
                      width: '75%',
                    }}>
                    {item.message}
                  </Text>
                </View>
              );
            })}
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end', marginTop: 20}}>
          <Text
            style={{
              color: 'black',
              alignSelf: 'center',
              justifyContent: 'flex-end',
            }}>
            © ASRTools
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
