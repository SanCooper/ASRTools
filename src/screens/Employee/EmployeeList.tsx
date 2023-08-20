import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Pallets} from '../../theme';
import {Table, Row, TableWrapper, Cell} from 'react-native-reanimated-table';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {ActivityIndicator} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {RootState} from 'src/store/store';

const EmployeeList = () => {
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
  const dataEmployee = useSelector((state: RootState) => state.dataEmployee);

  const buttonElement = (data: any) => (
    <TouchableOpacity onPress={() => console.log(data)}>
      <View style={{alignSelf: 'center', flex: 1}}>
        <Ionicon name="settings" size={20} color={Pallets.primary_main} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {dataEmployee.length > 0 ? (
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
                      data={employee.gaji}
                      textStyle={styles.text}
                      style={{width: 100, padding: 5}}
                    />
                    <Cell
                      data={employee.jenisKelamin}
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
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
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
