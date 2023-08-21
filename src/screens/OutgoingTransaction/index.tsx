import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  ScrollView,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import {Pallets} from '../../theme/';
import {Button} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import {useDispatch, useSelector} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import {RootState} from 'src/store/store';
import firestore from '@react-native-firebase/firestore';
interface OutgoingTransaction {
  idPengeluaran: string;
  tanggal: string;
  namaPengeluaran: string;
  biaya: string;
  keterangan: string;
  timestamp: number;
}

const OutgoingTransaction = () => {
  const dispatch = useDispatch();
  const [autoId, setAutoId] = React.useState<string>('');
  const [selectedDate, setSelectedDate] = React.useState<string>('');
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [outgoing, setOutgoing] = React.useState<OutgoingTransaction>({
    idPengeluaran: '',
    tanggal: '',
    namaPengeluaran: '',
    biaya: '',
    keterangan: '',
    timestamp: 0,
  });
  const toast = useToast();
  const dataOutgoing = useSelector(
    (state: RootState) => state.outgoingTransaction.dataOgTransaction,
  );

  const handleDateChange = (date: Date) => {
    setSelectedDate(date.toLocaleDateString('id-ID'));
    setOutgoing(prevOutgoing => ({
      ...prevOutgoing,
      tanggal: date.toLocaleDateString('id-ID'),
    }));
  };

  const fetchData = React.useCallback(async () => {
    const itemsCollection = firestore().collection('IncomingTransaction');
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
    dispatch({type: 'SET_INCOMING_DATA', payload: items});
  }, [dispatch]);

  const handleInputChange = (
    field: keyof OutgoingTransaction,
    value: string,
  ) => {
    setOutgoing(prevOutgoing => ({
      ...prevOutgoing,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setOutgoing(prevOutgoing => ({
      ...prevOutgoing,
      tanggalMasuk: selectedDate,
    }));
    if (
      outgoing.idPengeluaran === '' ||
      outgoing.tanggal === '' ||
      outgoing.namaPengeluaran === '' ||
      outgoing.biaya === '' ||
      outgoing.keterangan === ''
    ) {
      toast.show('Kolom input tidak boleh kosong!', {
        type: 'danger',
        duration: 1500,
      });
    } else {
      setOutgoing(prevOutgoing => ({
        ...prevOutgoing,
        timestamp: new Date().getTime(),
      }));
      try {
        // console.log('employe', outgoing);
        await firestore().collection('OutgoingTransaction').add(outgoing);
        dispatch({type: 'INPUT_OUTGOING_DATA', payload: outgoing});
        toast.show('Berhasil menambah data', {type: 'success'});
        // Reset the form
        setAutoId('');
        setOutgoing({
          idPengeluaran: '',
          tanggal: selectedDate,
          namaPengeluaran: '',
          biaya: '',
          keterangan: '',
          timestamp: 0,
        });
      } catch (error) {
        console.error('Error adding outgoing: ', error);
      }
    }
  };

  const generateAutoId = React.useCallback(() => {
    if (dataOutgoing.length > 0) {
      const array = dataOutgoing.map(
        (entry: {idPengeluaran: any}) => entry.idPengeluaran,
      );
      const lastTwoDigits = array.map((id: string) =>
        parseInt(id.slice(-2), 10),
      );
      // Find the largest last two digits
      const largestLastTwoDigits = Math.max(...lastTwoDigits);

      // Increment the largest last two digits and format the new ID
      const newIdNumber = largestLastTwoDigits + 1;
      const newId = `PL${newIdNumber.toString().padStart(3, '0')}`;
      setAutoId(newId);
      setOutgoing(prevOutgoing => ({
        ...prevOutgoing,
        idPengeluaran: newId,
      }));
      const dateTimestamp = new Date().getTime();
      setOutgoing(prevOutgoing => ({
        ...prevOutgoing,
        timestamp: dateTimestamp,
      }));
    } else {
      setAutoId('PL001');
      setOutgoing(prevOutgoing => ({
        ...prevOutgoing,
        idPengeluaran: 'PL001',
      }));
      const dateTimestamp = new Date().getTime();
      setOutgoing(prevOutgoing => ({
        ...prevOutgoing,
        timestamp: dateTimestamp,
      }));
    }
  }, [dataOutgoing]);

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
            {autoId !== '' ? autoId : 'ID Pengeluaran'}
          </Text>
          <Text
            style={[
              styles.inputText,
              {
                color: selectedDate === '' ? Pallets.netral_70 : Pallets.black,
                paddingTop: 7,
              },
            ]}
            onPress={() => setModalVisible(!modalVisible)}>
            {selectedDate !== '' ? selectedDate : 'Tanggal Transaksi'}
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
            value={outgoing.biaya}
            inputMode="numeric"
            onChangeText={value => handleInputChange('biaya', value)}
          />
          <TextInput
            placeholder="Keterangan"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            value={outgoing.keterangan}
            onChangeText={value => handleInputChange('keterangan', value)}
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

export default OutgoingTransaction;

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
