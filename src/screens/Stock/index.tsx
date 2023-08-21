import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Pallets} from '../../theme';
import {Table, Row, TableWrapper, Cell} from 'react-native-reanimated-table';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/store/store';
import firestore from '@react-native-firebase/firestore';

const Stock = () => {
  const dispatch = useDispatch();
  const tableHead = [
    'No',
    'ID Barang',
    'Tanggal Masuk',
    'Tanggal Keluar',
    'Nama',
    'Harga',
    '✎',
  ];
  const flexArr = [0.4, 1, 1, 1, 1, 1, 1];
  const dataStock = useSelector((state: RootState) => state.stock.dataStock);

  const fetchData = React.useCallback(async () => {
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
    fetchData();
  }, [fetchData]);

  const buttonElement = (data: any) => (
    <View
      style={{
        alignSelf: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 80,
      }}>
      <MaterialIcon
        name="edit-square"
        size={20}
        color={'green'}
        onPress={() => console.log('edit', data)}
      />
      <Ionicon
        name="trash"
        size={20}
        color={Pallets.danger_main}
        onPress={() => console.log('delete')}
      />
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{marginTop: 16}}>
        <ScrollView horizontal={true} style={{paddingHorizontal: 16}}>
          <Table
            style={{paddingRight: 30}}
            borderStyle={{
              borderWidth: 1,
              borderColor: '#C1C0B9',
            }}>
            <TableWrapper style={{flexDirection: 'row', paddingRight: 5}}>
              <Row
                data={tableHead}
                style={styles.head}
                textStyle={{
                  color: Pallets.black,
                  alignSelf: 'center',
                  fontWeight: '700',
                }}
                flexArr={flexArr}
              />
            </TableWrapper>
            {dataStock.map(
              (
                stock: {
                  idBarang: React.Key | null | undefined;
                  tanggalMasuk: any;
                  tanggalKeluar: any;
                  nama: any;
                  harga: any;
                },
                index: number,
              ) => (
                <TableWrapper key={index} style={{flexDirection: 'row'}}>
                  <Cell
                    data={index + 1}
                    textStyle={styles.text}
                    style={{width: 40, padding: 5}}
                  />
                  <Cell
                    data={stock.idBarang}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={stock.tanggalMasuk}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={stock.tanggalKeluar}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={stock.nama}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={stock.harga}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={buttonElement(stock)}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                </TableWrapper>
              ),
            )}
          </Table>
        </ScrollView>
        <Text style={{color: Pallets.black, margin: 16}}>
          Input stok barang dari Transaksi Pengeluaran
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Stock;

const styles = StyleSheet.create({
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
    justifyContent: 'center',
    width: 640,
  },
  text: {marginHorizontal: 4, color: Pallets.black},
});
