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
import {useToast} from 'react-native-toast-notifications';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/store/store';
import firestore from '@react-native-firebase/firestore';
interface IncomingTransaction {
  idPemasukan: string;
  tanggalMasuk: string;
  tipeHP: string;
  noNota: string;
  IMEI: string;
  namaPelanggan: string;
  kerusakan: string;
  biaya: string;
  hargaPart: string;
  laba: string;
  timestamp: number;
}

const IncomingTransaction = () => {
  const dispatch = useDispatch();
  const [autoId, setAutoId] = React.useState<string>('');
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState<string>('');
  const [incoming, setIncoming] = React.useState<IncomingTransaction>({
    idPemasukan: '',
    tanggalMasuk: '',
    tipeHP: '',
    noNota: '',
    IMEI: '',
    namaPelanggan: '',
    kerusakan: '',
    biaya: '',
    hargaPart: '',
    laba: '',
    timestamp: 0,
  });
  const toast = useToast();
  const dataIncoming = useSelector(
    (state: RootState) => state.incomingTransaction.dataIcTransaction,
  );

  const handleDateChange = (date: Date) => {
    setSelectedDate(date.toLocaleDateString('id-ID'));
    setIncoming(prevIncoming => ({
      ...prevIncoming,
      tanggalMasuk: date.toLocaleDateString('id-ID'),
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
    // setIncomingData(items);
    dispatch({type: 'SET_INCOMING_DATA', payload: items});
  }, [dispatch]);

  const handleInputChange = (
    field: keyof IncomingTransaction,
    value: string,
  ) => {
    setIncoming(prevIncoming => ({
      ...prevIncoming,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIncoming(prevIncoming => ({
      ...prevIncoming,
      tanggalMasuk: selectedDate,
    }));
    if (
      incoming.idPemasukan === '' ||
      incoming.tanggalMasuk === '' ||
      incoming.tipeHP === '' ||
      incoming.noNota === '' ||
      incoming.kerusakan === '' ||
      incoming.biaya === '' ||
      incoming.laba === ''
    ) {
      toast.show('Kolom input tidak boleh kosong!', {
        type: 'danger',
        duration: 1500,
      });
    } else {
      setIncoming(prevIncoming => ({
        ...prevIncoming,
        timestamp: new Date().getTime(),
      }));
      try {
        // console.log('employe', incoming);
        await firestore().collection('IncomingTransaction').add(incoming);
        dispatch({type: 'INPUT_INCOMING_DATA', payload: incoming});
        toast.show('Berhasil menambah data', {type: 'success'});
        // Reset the form
        setAutoId('');
        setIncoming({
          idPemasukan: '',
          tanggalMasuk: selectedDate,
          tipeHP: '',
          noNota: '',
          IMEI: '',
          namaPelanggan: '',
          kerusakan: '',
          biaya: '',
          hargaPart: '',
          laba: '',
          timestamp: 0,
        });
      } catch (error) {
        console.error('Error adding incoming: ', error);
      }
    }
  };

  const generateAutoId = React.useCallback(() => {
    if (dataIncoming.length > 0) {
      const array = dataIncoming.map(
        (entry: {idPemasukan: any}) => entry.idPemasukan,
      );
      const lastTwoDigits = array.map((id: string) =>
        parseInt(id.slice(-2), 10),
      );
      // Find the largest last two digits
      const largestLastTwoDigits = Math.max(...lastTwoDigits);
      // Increment the largest last two digits and format the new ID
      const newIdNumber = largestLastTwoDigits + 1;
      const newId = `PM${newIdNumber.toString().padStart(3, '0')}`;
      setAutoId(newId);
      setIncoming(prevIncoming => ({
        ...prevIncoming,
        idPemasukan: newId,
      }));
      const dateTimestamp = new Date().getTime();
      setIncoming(prevIncoming => ({
        ...prevIncoming,
        timestamp: dateTimestamp,
      }));
    } else {
      setAutoId('PM001');
      setIncoming(prevIncoming => ({
        ...prevIncoming,
        idPemasukan: 'PM001',
      }));
      const dateTimestamp = new Date().getTime();
      setIncoming(prevIncoming => ({
        ...prevIncoming,
        timestamp: dateTimestamp,
      }));
    }
  }, [dataIncoming]);

  const getLaba = () => {
    if (incoming.biaya === '') {
      return;
    } else {
      const laba =
        (incoming.biaya as unknown as number) -
        (incoming.hargaPart as unknown as number);
      setIncoming(prevIncoming => ({
        ...prevIncoming,
        laba: laba as unknown as string,
      }));
    }
  };

  // React.useEffect(() => {
  //   generateAutoId();
  // }, [generateAutoId]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{marginHorizontal: 16, paddingBottom: 50}}>
        <KeyboardAvoidingView>
          {/* <TextInput
            placeholder="ID Transaksi Masuk"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            editable={false}
            value={autoId}
            onChangeText={value => handleInputChange('idPemasukan', value)}
          /> */}
          <Text
            style={[
              styles.inputText,
              {
                color: autoId === '' ? Pallets.netral_70 : Pallets.black,
                paddingTop: 7,
              },
            ]}
            onPress={() => generateAutoId()}>
            {autoId !== '' ? autoId : 'ID Transaksi Masuk'}
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
            placeholder="Tipe HP"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            value={incoming.tipeHP}
            onChangeText={value => handleInputChange('tipeHP', value)}
          />
          <TextInput
            placeholder="No Nota"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            value={incoming.noNota}
            inputMode="numeric"
            onChangeText={value => handleInputChange('noNota', value)}
          />
          <TextInput
            placeholder="IMEI"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            value={incoming.IMEI}
            onChangeText={value => handleInputChange('IMEI', value)}
          />
          <TextInput
            placeholder="Nama Pelanggan"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            value={incoming.namaPelanggan}
            onChangeText={value => handleInputChange('namaPelanggan', value)}
          />
          <TextInput
            placeholder="Kerusakan"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            value={incoming.kerusakan}
            onChangeText={value => handleInputChange('kerusakan', value)}
          />
          <TextInput
            placeholder="Biaya"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            value={incoming.biaya}
            inputMode="numeric"
            onChangeText={value => handleInputChange('biaya', value)}
          />
          <TextInput
            placeholder="Harga Part"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            inputMode="numeric"
            value={incoming.hargaPart}
            onChangeText={value => handleInputChange('hargaPart', value)}
          />
          {/* <TextInput
            placeholder="Laba"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            value={incoming.laba}
            inputMode="numeric"
            onChangeText={value => handleInputChange('laba', value)}
          /> */}
          <Text
            style={[
              styles.inputText,
              {
                color: incoming.laba === '' ? Pallets.netral_70 : Pallets.black,
                paddingTop: 7,
              },
            ]}
            onPress={() => getLaba()}>
            {incoming.laba !== '' ? incoming.laba : 'Laba'}
          </Text>
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
        title={'Pilih Tanggal'}
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

export default IncomingTransaction;

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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    height: '50%',
    width: '90%',
  },
});
