import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {Pallets} from '../../theme';
import {Table, Row, TableWrapper, Cell} from 'react-native-reanimated-table';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {RootState} from 'src/store/store';

const IncomingList = () => {
  // const [employeeData, setEmployeeData] = React.useState<any>([]);
  const tableHead = [
    'No',
    'ID Pemasukan',
    'Tanggal',
    'Tipe HP',
    'No Nota',
    'IMEI',
    'Nama Pelanggan',
    'Kerusakan',
    'Biaya',
    'Harga Part',
    'Laba',
    '✎',
  ];
  const flexArr = [0.4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const dataIncoming = useSelector(
    (state: RootState) => state.incomingTransaction.dataIcTransaction,
  );

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
            {dataIncoming.map(
              (
                incomingTransaction: {
                  idPemasukan: React.Key | null | undefined;
                  tanggalMasuk: any;
                  tipeHP: any;
                  noNota: any;
                  IMEI: any;
                  namaPelanggan: any;
                  kerusakan: any;
                  biaya: any;
                  hargaPart: any;
                  laba: any;
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
                    data={incomingTransaction.idPemasukan}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={incomingTransaction.tanggalMasuk}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={incomingTransaction.tipeHP}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={incomingTransaction.noNota}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={incomingTransaction.IMEI}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={incomingTransaction.namaPelanggan}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={incomingTransaction.kerusakan}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={incomingTransaction.biaya}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={incomingTransaction.hargaPart}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={incomingTransaction.laba}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={buttonElement(incomingTransaction)}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  {/* <Row
                      data={[
                        employee.tanggalMasuk,
                        employee.Nama,
                        employee.Jabatan,
                        employee.Gaji,
                        employee.JenisKelamin,
                        '',
                      ]}
                      textStyle={styles.text}
                      style={{height: 40, width: 500}}
                      flexArr={flexArr}
                    /> */}
                </TableWrapper>
              ),
            )}
          </Table>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IncomingList;

const styles = StyleSheet.create({
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
    justifyContent: 'center',
    width: 1140,
  },
  text: {marginHorizontal: 4, color: Pallets.black},
});
