import {Alert, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {Pallets} from '../../theme';
import {Table, Row, TableWrapper, Cell} from 'react-native-reanimated-table';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/store/store';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

const OutgoingList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const tableHead = [
    'No',
    'ID Pengeluaran',
    'Tanggal',
    'Nama Pengeluaran',
    'Biaya',
    'Keterangan',
    '✎',
  ];
  const flexArr = [0.4, 1, 1, 1, 1, 1, 1];
  const dataOutGoing = useSelector(
    (state: RootState) => state.outgoingTransaction.dataOgTransaction,
  );

  const sendLog = async (id: string) => {
    try {
      const activity = {
        message: `Berhasil menghapus data transaksi keluar dengan id ${id}`,
        timestamp: new Date().getTime(),
        tipe: 'Delete',
      };
      console.log('Activity', activity);
      await firestore().collection('LogActivity').add(activity);
      dispatch({type: 'INPUT_ACTIVITY_DATA', payload: activity});
    } catch (error) {
      console.error('Error delete log activity outgoing transaction: ', error);
    }
  };

  async function deleteDocument(documentId: string, value: string) {
    try {
      const collectionRef = firestore().collection('OutgoingTransaction');
      await collectionRef.doc(documentId).delete();
      dispatch({type: 'DELETE_OUTGOING_DATA', payload: value});
      sendLog(value);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }

  async function getDocumentIdsByFieldValue(fieldName: string, value: string) {
    try {
      const collectionRef = firestore().collection('OutgoingTransaction');
      const querySnapshot = await collectionRef
        .where(fieldName, '==', value)
        .get();

      if (!querySnapshot.empty) {
        const documentIds = querySnapshot.docs.map(doc => doc.id);
        deleteDocument(documentIds[0], value);
      } else {
        console.log('No documents found with the specified value.');
      }
    } catch (error) {
      console.error('Error querying documents:', error);
    }
  }

  const deleteConfirmation = (id: string) => {
    Alert.alert(
      'Konfirmasi',
      `Yakin ingin hapus data dengan id ${id}?`,
      [
        {text: 'Batal', style: 'cancel'},
        {
          text: 'Ya',
          onPress: () => getDocumentIdsByFieldValue('idPengeluaran', id),
        },
      ],
      {cancelable: true},
    );
  };

  const editConfirmation = (data: any) => {
    Alert.alert(
      'Konfirmasi',
      `Yakin ingin edit data dengan id ${data.idPengeluaran}?`,
      [
        {text: 'Batal', style: 'cancel'},
        {
          text: 'Ya',
          onPress: () =>
            navigation.navigate('EditOutgoing', {
              idPengeluaran: data.idPengeluaran,
              tanggal: data.tanggal,
              namaPengeluaran: data.namaPengeluaran,
              biaya: data.biaya,
              keterangan: data.keterangan,
              timestamp: data.timestamp,
            }),
        },
      ],
      {cancelable: true},
    );
  };

  const buttonElement = (data: any) => (
    <View
      style={{
        alignSelf: 'center',
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 80,
      }}>
      <MaterialIcon
        name="edit-square"
        size={20}
        color={'green'}
        onPress={() => editConfirmation(data)}
      />
      <Ionicon
        name="trash"
        size={20}
        color={Pallets.danger_main}
        onPress={() => deleteConfirmation(data.idPengeluaran)}
        // onPress={() => console.log('delete')}
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
            {dataOutGoing.map(
              (
                outgoingTransaction: {
                  idPengeluaran: React.Key | null | undefined;
                  tanggal: any;
                  namaPengeluaran: any;
                  biaya: any;
                  keterangan: any;
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
                    data={outgoingTransaction.idPengeluaran}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={outgoingTransaction.tanggal}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={outgoingTransaction.namaPengeluaran}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={outgoingTransaction.biaya}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={outgoingTransaction.keterangan}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={buttonElement(outgoingTransaction)}
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

export default OutgoingList;

const styles = StyleSheet.create({
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
    justifyContent: 'center',
    width: 640,
  },
  text: {marginHorizontal: 4, color: Pallets.black},
});
