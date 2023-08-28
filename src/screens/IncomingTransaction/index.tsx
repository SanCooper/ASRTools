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
import DatePicker from 'react-native-date-picker';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/store/store';
import firestore from '@react-native-firebase/firestore';
import {Dropdown} from '../../components/atoms';
interface IncomingTransaction {
  idPemasukan: string;
  tanggalMasuk: string;
  tipeHP: string;
  noNota: string;
  IMEI: string;
  namaPelanggan: string;
  kerusakan: string;
  biaya: number;
  hargaPart: number;
  laba: number;
  timestamp: number;
}

const IncomingTransaction = () => {
  const dispatch = useDispatch();
  const [autoId, setAutoId] = React.useState<string>('');
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [stockVisible, setStockVisible] = React.useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState<string>('');
  const [idBarang, setIdBarang] = React.useState<string>('');
  const [incoming, setIncoming] = React.useState<IncomingTransaction>({
    idPemasukan: '',
    tanggalMasuk: '',
    tipeHP: '',
    noNota: '',
    IMEI: '',
    namaPelanggan: '',
    kerusakan: '',
    biaya: 0,
    hargaPart: 0,
    laba: 0,
    timestamp: 0,
  });
  const toast = useToast();
  const dataIncoming = useSelector(
    (state: RootState) => state.incomingTransaction.dataIcTransaction,
  );
  const dataStock = useSelector((state: RootState) => state.stock.dataStock);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date.toLocaleDateString('id-ID'));
    setIncoming(prevIncoming => ({
      ...prevIncoming,
      tanggalMasuk: date.toLocaleDateString('id-ID'),
    }));
  };

  const fetchDataStock = React.useCallback(async () => {
    const itemsCollection = firestore().collection('Stock');
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
    dispatch({type: 'SET_STOCK_DATA', payload: items});
  }, [dispatch]);

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

  // Function to update the document
  const updateDocument = async (documentId: string, newData: any) => {
    try {
      const collectionRef = firestore().collection('Stock');
      const documentRef = collectionRef.doc(documentId);

      await documentRef.update(newData);
      setIdBarang('');
      fetchDataStock();
      console.log('Document updated successfully.');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  async function getDocumentIdsByFieldValue(fieldName: string, value: string) {
    try {
      const collectionRef = firestore().collection('Stock');
      const querySnapshot = await collectionRef
        .where(fieldName, '==', value)
        .get();
      const newData = {
        tanggalKeluar: selectedDate,
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

  const sendLog = async (id: string) => {
    try {
      const activity = {
        message: `Berhasil menambahkan data transaksi masuk dengan id ${id}`,
        timestamp: new Date().getTime(),
        tipe: 'Input',
      };
      console.log('Activity', activity);
      await firestore().collection('LogActivity').add(activity);
      dispatch({type: 'INPUT_ACTIVITY_DATA', payload: activity});
    } catch (error) {
      console.error('Error adding log activity incoming transaction: ', error);
    }
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
      incoming.biaya === 0 ||
      incoming.laba === 0
    ) {
      toast.show('Kolom input tidak boleh kosong!', {
        type: 'danger',
        duration: 1500,
      });
    } else if (incoming.biaya < incoming.hargaPart) {
      toast.show('Periksa lagi biaya dan harga part!', {type: 'danger'});
    } else {
      try {
        // console.log('employe', incoming);
        console.log('incoming ', incoming);
        await firestore().collection('IncomingTransaction').add(incoming);
        dispatch({type: 'INPUT_INCOMING_DATA', payload: incoming});
        toast.show('Berhasil menambah data', {type: 'success'});
        sendLog(incoming.idPemasukan);
        if (incoming.hargaPart !== 0 && idBarang !== '') {
          getDocumentIdsByFieldValue('idBarang', idBarang);
        }
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
          biaya: 0,
          hargaPart: 0,
          laba: 0,
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
    if (incoming.biaya === 0) {
      return;
    } else if (incoming.biaya < incoming.hargaPart) {
      toast.show('Periksa lagi biaya dan harga part!', {type: 'danger'});
    } else {
      const laba = incoming.biaya - incoming.hargaPart;
      setIncoming(prevIncoming => ({
        ...prevIncoming,
        laba: laba,
      }));
    }
  };

  const StockDropdown = React.useCallback(
    (stock: any[]) => {
      return stock.map((item: any, key: any) => (
        // console.log('item', item, key === 0)
        <TouchableOpacity
          key={key}
          onPress={() => {
            if (key === 0) {
              setIdBarang('');
            } else {
              setIdBarang(item.idBarang);
            }
            setIncoming(prevIncoming => ({
              ...prevIncoming,
              hargaPart: key === 0 ? 0 : item.harga,
            }));
            setStockVisible(!stockVisible);
          }}
          style={[
            styles.stockContainer,
            {
              backgroundColor: Pallets.white,
            },
          ]}>
          <Text style={{color: Pallets.black}}>
            {key === 0 ? 0 : `${item.nama} ${item.harga}`}
          </Text>
        </TouchableOpacity>
      ));
    },
    [stockVisible],
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
            value={incoming.biaya !== 0 ? incoming.biaya.toString() : ''}
            inputMode="numeric"
            onChangeText={value => handleInputChange('biaya', value)}
          />
          {/* <TextInput
            placeholder="Harga Part"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            inputMode="numeric"
            value={incoming.hargaPart}
            onChangeText={value => handleInputChange('hargaPart', value)}
          /> */}
          <Dropdown
            label={
              incoming.hargaPart !== 0
                ? incoming.hargaPart.toString()
                : 'Harga Part'
            }
            textColor={
              incoming.hargaPart === 0 ? Pallets.netral_70 : Pallets.black
            }
            dropdownContent={StockDropdown([
              dataStock[0],
              ...dataStock.filter((item: any) => item.tanggalKeluar === ''),
            ])}
            // dropdownContent={StockDropdown(
            //   dataStock.filter((item: any) => item.tanggalKeluar === ''),
            // )}
            style={styles.inputText}
            visible={stockVisible}
            setVisible={setStockVisible}
          />
          <Text
            style={[
              styles.inputText,
              {
                color: incoming.laba === 0 ? Pallets.netral_70 : Pallets.black,
                paddingTop: 7,
              },
            ]}
            onPress={() => getLaba()}>
            {incoming.laba !== 0 ? incoming.laba.toString() : 'Laba'}
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
  stockContainer: {
    padding: 12,
    borderRadius: 6,
  },
});
