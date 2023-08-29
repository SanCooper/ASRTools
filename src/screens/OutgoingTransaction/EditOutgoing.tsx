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
import DatePicker from 'react-native-date-picker';
import {useDispatch} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import firestore from '@react-native-firebase/firestore';
import {Dropdown} from '../../components/atoms';
import {EditOutgoingProps} from './inteface';

interface OutgoingTransaction {
  idPengeluaran: string;
  tanggal: string;
  namaPengeluaran: string;
  biaya: number;
  keterangan: string;
  timestamp: number;
}

const EditOutgoing: React.FC<EditOutgoingProps> = props => {
  const {route, navigation} = props;
  const dispatch = useDispatch();
  // const [idStock, setIdStock] = React.useState<string>('');
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [keteranganVisible, setKeteranganVisible] =
    React.useState<boolean>(false);
  const [outgoing, setOutgoing] = React.useState<OutgoingTransaction>({
    idPengeluaran: '',
    tanggal: '',
    namaPengeluaran: '',
    biaya: 0,
    keterangan: '',
    timestamp: 0,
  });
  const toast = useToast();

  const handleDateChange = (date: Date) => {
    setOutgoing(prevOutgoing => ({
      ...prevOutgoing,
      tanggal: date.toLocaleDateString('id-ID'),
    }));
  };

  const fetchDataOutgoing = React.useCallback(async () => {
    const itemsCollection = firestore().collection('OutgoingTransaction');
    const snapshot = await itemsCollection.get();

    const items: any = [];
    snapshot.forEach(doc => {
      items.push({
        ...doc.data(),
      });
    });
    // Sort the items array by timestamp
    items.sort((a: any, b: any) => a.timestamp - b.timestamp);
    // setOutgoingData(items);
    dispatch({type: 'SET_OUTGOING_DATA', payload: items});
  }, [dispatch]);

  const sendLog = async (id: string) => {
    try {
      const activity = {
        message: `Berhasil mengubah data transaksi keluar dengan id ${id}`,
        timestamp: new Date().getTime(),
        tipe: 'Edit',
      };
      console.log('Activity', activity);
      await firestore().collection('LogActivity').add(activity);
      dispatch({type: 'INPUT_ACTIVITY_DATA', payload: activity});
    } catch (error) {
      console.error('Error edit log activity outgoing starnsaction: ', error);
    }
  };

  // Function to update the document
  const updateDocument = async (documentId: string, newData: any) => {
    try {
      const collectionRef = firestore().collection('OutgoingTransaction');
      const documentRef = collectionRef.doc(documentId);

      await documentRef.update(newData);
      console.log('Document updated successfully.');
      fetchDataOutgoing();
      toast.show('Berhasil mengubah data', {type: 'success'});
      sendLog(outgoing.idPengeluaran);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  async function getDocumentIdsByFieldValue(fieldName: string, value: string) {
    console.log('dsad', fieldName, value);
    try {
      const collectionRef = firestore().collection('OutgoingTransaction');
      const querySnapshot = await collectionRef
        .where(fieldName, '==', value)
        .get();
      const newData = {
        idPengeluaran: outgoing.idPengeluaran,
        tanggal: outgoing.tanggal,
        namaPengeluaran: outgoing.namaPengeluaran,
        biaya: outgoing.biaya,
        keterangan: outgoing.keterangan,
        timestamp: outgoing.timestamp,
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
  const handleInputChange = (field: keyof OutgoingTransaction, value: any) => {
    setOutgoing(prevOutgoing => ({
      ...prevOutgoing,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      outgoing.idPengeluaran === '' ||
      outgoing.tanggal === '' ||
      outgoing.namaPengeluaran === '' ||
      outgoing.biaya === 0 ||
      outgoing.keterangan === ''
    ) {
      toast.show('Kolom input tidak boleh kosong!', {
        type: 'danger',
        duration: 1500,
      });
    } else {
      getDocumentIdsByFieldValue('idPengeluaran', outgoing.idPengeluaran);
    }
  };

  const setOutgoingHandler = React.useCallback(() => {
    setOutgoing(prevOutgoing => ({
      ...prevOutgoing,
      idPengeluaran: route.params.idPengeluaran,
      tanggal: route.params.tanggal,
      biaya: route.params.biaya,
      namaPengeluaran: route.params.namaPengeluaran,
      keterangan: route.params.keterangan,
      timestamp: route.params.timestamp,
    }));
  }, [route.params]);

  React.useEffect(() => {
    setOutgoingHandler();
  }, [setOutgoingHandler]);

  // eslint-disable-next-line react/no-unstable-nested-components
  const KeteranganContent = () => (
    <>
      <TouchableOpacity
        onPress={() => {
          setOutgoing(prevOutgoing => ({
            ...prevOutgoing,
            keterangan: 'Operasional',
          }));
          setKeteranganVisible(!keteranganVisible);
        }}
        style={[
          styles.keteranganContainer,
          {
            backgroundColor: Pallets.white,
          },
        ]}>
        <Text style={{color: Pallets.black}}>Operasional</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setOutgoing(prevOutgoing => ({
            ...prevOutgoing,
            keterangan: 'Barang',
          }));
          setKeteranganVisible(!keteranganVisible);
        }}
        style={[
          styles.keteranganContainer,
          {
            backgroundColor: Pallets.white,
          },
        ]}>
        <Text style={{color: Pallets.black}}>Barang</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{marginHorizontal: 16, paddingBottom: 50}}>
        <KeyboardAvoidingView>
          <Text
            style={[
              styles.inputText,
              {
                color:
                  outgoing.idPengeluaran === ''
                    ? Pallets.netral_70
                    : Pallets.black,
                paddingTop: 7,
              },
            ]}>
            {outgoing.idPengeluaran !== ''
              ? outgoing.idPengeluaran
              : 'ID Pengeluaran'}
          </Text>
          <Text
            style={[
              styles.inputText,
              {
                color:
                  outgoing.tanggal === '' ? Pallets.netral_70 : Pallets.black,
                paddingTop: 7,
              },
            ]}
            onPress={() => setModalVisible(!modalVisible)}>
            {outgoing.tanggal !== '' ? outgoing.tanggal : 'Tanggal Transaksi'}
          </Text>
          <TextInput
            placeholder="Nama Pengeluaran"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            value={outgoing.namaPengeluaran}
            onChangeText={value => handleInputChange('namaPengeluaran', value)}
          />
          <TextInput
            placeholder="Biaya"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            value={outgoing.biaya === 0 ? '' : outgoing.biaya.toString()}
            inputMode="numeric"
            onChangeText={value => handleInputChange('biaya', value)}
          />
          <Dropdown
            label={
              outgoing.keterangan !== '' ? outgoing.keterangan : 'Keterangan'
            }
            textColor={
              outgoing.keterangan === '' ? Pallets.netral_70 : Pallets.black
            }
            dropdownContent={<KeteranganContent />}
            style={styles.inputText}
            visible={keteranganVisible}
            setVisible={setKeteranganVisible}
          />
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={{borderRadius: 10, marginTop: 16}}>
            SIMPAN
          </Button>
        </KeyboardAvoidingView>
      </ScrollView>
      <DatePicker
        modal
        open={modalVisible}
        mode="date"
        locale="id-ID"
        maximumDate={new Date()}
        date={new Date()}
        onConfirm={date => {
          setModalVisible(!modalVisible);
          handleDateChange(date);
        }}
        onCancel={() => {
          setModalVisible(!modalVisible);
        }}
      />
    </SafeAreaView>
  );
};

export default EditOutgoing;

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
  keteranganContainer: {
    padding: 12,
    borderRadius: 6,
  },
});
