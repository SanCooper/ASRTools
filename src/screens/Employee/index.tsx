import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Pallets} from '../../theme/';
import {Button} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/store/store';
import {Dropdown} from '../../components/atoms';
interface Employee {
  idKaryawan: string;
  nama: string;
  jabatan: string;
  gaji: number;
  jenisKelamin: string;
  timestamp: number;
}

const Employee = () => {
  const dispatch = useDispatch();
  const [autoId, setAutoId] = React.useState<string>('');
  const [genderModal, setGenderModal] = React.useState<boolean>(false);
  const [employee, setEmployee] = React.useState<Employee>({
    idKaryawan: autoId,
    nama: '',
    jabatan: '',
    gaji: 0,
    jenisKelamin: '',
    timestamp: 0,
  });
  const toast = useToast();
  const dataEmployee = useSelector(
    (state: RootState) => state.employee.dataEmployee,
  );

  const fetchData = React.useCallback(async () => {
    const itemsCollection = firestore().collection('Employee');
    const snapshot = await itemsCollection.get();

    const items: any = [];
    snapshot.forEach(doc => {
      items.push({
        ...doc.data(),
      });
    });
    // Sort the items array by timestamp
    items.sort((a: any, b: any) => a.timestamp - b.timestamp);
    // setEmployeeData(items);
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
      employee.gaji === 0
    ) {
      toast.show('Kolom input tidak boleh kosong!', {
        type: 'danger',
        duration: 1500,
      });
    } else {
      try {
        // console.log('employe', employee);
        await firestore().collection('Employee').add(employee);
        dispatch({type: 'INPUT_EMPLOYEE_DATA', payload: employee});
        toast.show('Berhasil menambah data', {type: 'success'});
        // Reset the form
        setAutoId('');
        setEmployee({
          idKaryawan: autoId,
          nama: '',
          jabatan: '',
          gaji: 0,
          jenisKelamin: '',
          timestamp: 0,
        });
      } catch (error) {
        console.error('Error adding employee: ', error);
      }
    }
  };

  const generateAutoId = React.useCallback(() => {
    if (dataEmployee.length > 0) {
      const array = dataEmployee.map(
        (entry: {idKaryawan: any}) => entry.idKaryawan,
      );
      const lastTwoDigits = array.map((id: string) =>
        parseInt(id.slice(-2), 10),
      );
      // Find the largest last two digits
      const largestLastTwoDigits = Math.max(...lastTwoDigits);

      // Increment the largest last two digits and format the new ID
      const newIdNumber = largestLastTwoDigits + 1;
      const newId = `KY${newIdNumber.toString().padStart(3, '0')}`;
      setAutoId(newId);
      setEmployee(prevEmployee => ({
        ...prevEmployee,
        idKaryawan: newId,
      }));
      const dateTimestamp = new Date().getTime();
      setEmployee(prevEmployee => ({
        ...prevEmployee,
        timestamp: dateTimestamp,
      }));
    } else {
      setAutoId('KY001');
      setEmployee(prevEmployee => ({
        ...prevEmployee,
        idKaryawan: 'KY001',
      }));
      const dateTimestamp = new Date().getTime();
      setEmployee(prevEmployee => ({
        ...prevEmployee,
        timestamp: dateTimestamp,
      }));
    }
  }, [dataEmployee]);

  // eslint-disable-next-line react/no-unstable-nested-components
  const GenderContent = () => (
    <>
      <TouchableOpacity
        onPress={() => {
          setEmployee(prevEmployee => ({
            ...prevEmployee,
            jenisKelamin: 'Laki-laki',
          }));
          setGenderModal(!genderModal);
        }}
        style={[
          styles.genderContainer,
          {
            backgroundColor: Pallets.white,
          },
        ]}>
        <Text style={{color: Pallets.black}}>Laki-laki</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setEmployee(prevEmployee => ({
            ...prevEmployee,
            jenisKelamin: 'Perempuan',
          }));
          setGenderModal(!genderModal);
        }}
        style={[
          styles.genderContainer,
          {
            backgroundColor: Pallets.white,
          },
        ]}>
        <Text style={{color: Pallets.black}}>Perempuan</Text>
      </TouchableOpacity>
    </>
  );

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{marginHorizontal: 16, paddingBottom: 50}}>
        <KeyboardAvoidingView>
          <Text
            style={[
              styles.inputText,
              {
                color: autoId === '' ? Pallets.netral_70 : Pallets.black,
                paddingTop: 7,
              },
            ]}
            onPress={() => generateAutoId()}>
            {autoId !== '' ? autoId : 'ID Karyawan'}
          </Text>
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
          {/* <TextInput
            placeholder="Jenis Kelamin"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            value={employee.jenisKelamin}
            onChangeText={value => handleInputChange('jenisKelamin', value)}
          /> */}
          <Dropdown
            label={
              employee.jenisKelamin !== ''
                ? employee.jenisKelamin
                : 'Jenis Kelamin'
            }
            textColor={
              employee.jenisKelamin === '' ? Pallets.netral_70 : Pallets.black
            }
            dropdownContent={<GenderContent />}
            style={styles.inputText}
            visible={genderModal}
            setVisible={setGenderModal}
          />
          <TextInput
            placeholder="Gaji"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            value={employee.gaji === 0 ? '' : employee.gaji.toString()}
            inputMode="numeric"
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
  genderContainer: {
    padding: 12,
    borderRadius: 6,
  },
});
