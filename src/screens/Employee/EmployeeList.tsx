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

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  // const [employeeData, setEmployeeData] = React.useState<any>([]);
  const tableHead = [
    'No',
    'ID Karyawan',
    'Nama',
    'Jabatan',
    'Gender',
    'Gaji',
    '✎',
  ];
  const flexArr = [0.4, 1, 1, 1, 1, 1];
  const dataEmployee = useSelector(
    (state: RootState) => state.employee.dataEmployee,
  );

  const sendLog = async (id: string) => {
    try {
      const activity = {
        message: `Berhasil menghapus data karyawan dengan id ${id}`,
        timestamp: new Date().getTime(),
        tipe: 'Delete',
      };
      console.log('Activity', activity);
      await firestore().collection('LogActivity').add(activity);
      dispatch({type: 'INPUT_ACTIVITY_DATA', payload: activity});
    } catch (error) {
      console.error('Error delete log activity employee: ', error);
    }
  };

  async function deleteDocument(documentId: string, value: string) {
    try {
      const collectionRef = firestore().collection('Employee');
      await collectionRef.doc(documentId).delete();
      dispatch({type: 'DELETE_EMPLOYEE_DATA', payload: value});
      sendLog(value);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }

  async function getDocumentIdsByFieldValue(fieldName: string, value: string) {
    try {
      const collectionRef = firestore().collection('Employee');
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
          onPress: () => getDocumentIdsByFieldValue('idKaryawan', id),
        },
      ],
      {cancelable: true},
    );
  };

  const editConfirmation = (data: any) => {
    Alert.alert(
      'Konfirmasi',
      `Yakin ingin edit data dengan id ${data.idKaryawan}?`,
      [
        {text: 'Batal', style: 'cancel'},
        {
          text: 'Ya',
          onPress: () =>
            navigation.navigate('EditEmployee', {
              idKaryawan: data.idKaryawan,
              nama: data.nama,
              jabatan: data.jabatan,
              gaji: data.gaji,
              jenisKelamin: data.jenisKelamin,
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
        onPress={() => deleteConfirmation(data.idKaryawan)}
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
            {dataEmployee.map(
              (
                employee: {
                  idKaryawan: React.Key | null | undefined;
                  nama: any;
                  jabatan: any;
                  gaji: any;
                  jenisKelamin: any;
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
                    data={employee.idKaryawan}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={employee.nama}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={employee.jabatan}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={employee.jenisKelamin}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={employee.gaji}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  <Cell
                    data={buttonElement(employee)}
                    textStyle={styles.text}
                    style={{width: 100, padding: 5}}
                  />
                  {/* <Row
                      data={[
                        employee.IdKaryawan,
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

export default EmployeeList;

const styles = StyleSheet.create({
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
    justifyContent: 'center',
    width: 640,
  },
  text: {marginHorizontal: 4, color: Pallets.black},
});
