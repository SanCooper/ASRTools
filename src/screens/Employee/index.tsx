import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import {Pallets} from '../../theme/';
import {Button} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/store/store';
interface Employee {
  idKaryawan: string;
  nama: string;
  jabatan: string;
  gaji: string;
  jenisKelamin: string;
}

const Employee = () => {
  const dispatch = useDispatch();
  const [employee, setEmployee] = React.useState<Employee>({
    idKaryawan: '',
    nama: '',
    jabatan: '',
    gaji: '',
    jenisKelamin: '',
  });
  const toast = useToast();
  const dataEmployee = useSelector((state: RootState) => state.dataEmployee);

  const fetchData = React.useCallback(async () => {
    // try {
    //   const collectionRef = firestore().collection('Employee');
    //   collectionRef.onSnapshot(snapshot => {
    //     const dataArray = snapshot.docs.flatMap(doc => doc.data().karyawan);
    //     setEmployeeData(dataArray);
    //   });
    // } catch (error) {
    //   console.error('Error fetching data: ', error);
    // }
    const itemsCollection = firestore().collection('Employee');
    const snapshot = await itemsCollection.get();

    const items: any = [];
    snapshot.forEach(doc => {
      items.push({
        ...doc.data(),
      });
    });
    // setEmployeeData(items);
    console.log('item', items);
    dispatch({type: 'SET_EMPLOYEE_DATA', payload: items});
  }, [dispatch]);

  const handleInputChange = (field: keyof Employee, value: string) => {
    setEmployee(prevEmployee => ({
      ...prevEmployee,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      employee.idKaryawan === '' ||
      employee.nama === '' ||
      employee.jabatan === '' ||
      employee.jenisKelamin === '' ||
      employee.gaji === ''
    ) {
      toast.show('Kolom input tidak boleh kosong!', {
        type: 'danger',
        duration: 1500,
      });
    } else {
      try {
        await firestore().collection('Employee').add(employee);
        console.log('Employee added successfully!');
        // Reset the form
        setEmployee({
          idKaryawan: '',
          nama: '',
          jabatan: '',
          gaji: '',
          jenisKelamin: '',
        });
      } catch (error) {
        console.error('Error adding employee: ', error);
      }
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  React.useEffect(() => {
    console.log('data employee', dataEmployee);
  }, [dataEmployee]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{marginHorizontal: 16, paddingBottom: 50}}>
        <KeyboardAvoidingView>
          <TextInput
            placeholder="Id Karyawan"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            value={employee.idKaryawan}
            onChangeText={value => handleInputChange('idKaryawan', value)}
          />
          <TextInput
            placeholder="Nama"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            value={employee.nama}
            onChangeText={value => handleInputChange('nama', value)}
          />
          <TextInput
            placeholder="Jabatan"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            value={employee.jabatan}
            onChangeText={value => handleInputChange('jabatan', value)}
          />
          <TextInput
            placeholder="Jenis Kelamin"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            value={employee.jenisKelamin}
            onChangeText={value => handleInputChange('jenisKelamin', value)}
          />
          <TextInput
            placeholder="Gaji"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            value={employee.gaji}
            onChangeText={value => handleInputChange('gaji', value)}
          />
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={{borderRadius: 10, marginTop: 16}}>
            SIMPAN
          </Button>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Employee;

const styles = StyleSheet.create({
  inputText: {
    color: 'black',
    backgroundColor: Pallets.white,
    borderWidth: 1,
    borderColor: Pallets.netral_90,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: -5,
    marginTop: 16,
    height: 35,
  },
});
