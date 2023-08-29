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
import {Pallets} from '../../theme';
import {Button} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {useToast} from 'react-native-toast-notifications';
import {Dropdown} from '../../components/atoms';
import {EditEmployeeProps} from './inteface';
import {useDispatch} from 'react-redux';

interface Employee {
  idKaryawan: string;
  nama: string;
  jabatan: string;
  gaji: number;
  jenisKelamin: string;
  timestamp: number;
}

const EditEmployee: React.FC<EditEmployeeProps> = props => {
  const {route, navigation} = props;
  const dispatch = useDispatch();
  const [genderModal, setGenderModal] = React.useState<boolean>(false);
  const [employee, setEmployee] = React.useState<Employee>({
    idKaryawan: '',
    nama: '',
    jabatan: '',
    gaji: 0,
    jenisKelamin: '',
    timestamp: 0,
  });
  const toast = useToast();

  const fetchDataEmployee = React.useCallback(async () => {
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

  const sendLog = async (id: string) => {
    try {
      const activity = {
        message: `Berhasil mengubah data karyawan dengan id ${id}`,
        timestamp: new Date().getTime(),
        tipe: 'Edit',
      };
      console.log('Activity', activity);
      await firestore().collection('LogActivity').add(activity);
      dispatch({type: 'INPUT_ACTIVITY_DATA', payload: activity});
    } catch (error) {
      console.error('Error edit log activity employee: ', error);
    }
  };

  // Function to update the document
  const updateDocument = async (documentId: string, newData: any) => {
    try {
      const collectionRef = firestore().collection('Employee');
      const documentRef = collectionRef.doc(documentId);

      await documentRef.update(newData);
      console.log('Document updated successfully.');
      fetchDataEmployee();
      toast.show('Berhasil mengubah data', {type: 'success'});
      sendLog(employee.idKaryawan);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  async function getDocumentIdsByFieldValue(fieldName: string, value: string) {
    console.log('dsad', fieldName, value);
    try {
      const collectionRef = firestore().collection('Employee');
      const querySnapshot = await collectionRef
        .where(fieldName, '==', value)
        .get();
      const newData = {
        idKaryawan: employee.idKaryawan,
        nama: employee.nama,
        jabatan: employee.jabatan,
        gaji: employee.gaji,
        jenisKelamin: employee.jenisKelamin,
        timestamp: employee.timestamp,
      };
      if (!querySnapshot.empty) {
        const documentIds = querySnapshot.docs.map(doc => doc.id);
        updateDocument(documentIds[0], newData);
      } else {
        console.log('No documents found with the specified value.');
      }
    } catch (error) {
      console.error('Error querying documents:', error);
    }
  }

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
      getDocumentIdsByFieldValue('idKaryawan', employee.idKaryawan);
    }
  };

  const handleInputChange = (field: keyof Employee, value: string) => {
    setEmployee(prevEmployee => ({
      ...prevEmployee,
      [field]: value,
    }));
  };

  const setEmployeeHandler = React.useCallback(() => {
    setEmployee(prevEmployee => ({
      ...prevEmployee,
      idKaryawan: route.params.idKaryawan,
      nama: route.params.nama,
      jabatan: route.params.jabatan,
      gaji: route.params.gaji,
      jenisKelamin: route.params.jenisKelamin,
      timestamp: route.params.timestamp,
    }));
  }, [route.params]);

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
    setEmployeeHandler();
  }, [setEmployeeHandler]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{marginHorizontal: 16, paddingBottom: 50}}>
        <KeyboardAvoidingView>
          <Text
            style={[
              styles.inputText,
              {
                color:
                  employee.idKaryawan === ''
                    ? Pallets.netral_70
                    : Pallets.black,
                paddingTop: 7,
              },
            ]}>
            {employee.idKaryawan !== '' ? employee.idKaryawan : 'ID Karyawan'}
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

export default EditEmployee;

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
