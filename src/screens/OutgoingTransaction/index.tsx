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
import {useDispatch, useSelector} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import {RootState} from 'src/store/store';
import firestore from '@react-native-firebase/firestore';
import {Dropdown} from '../../components/atoms';
interface OutgoingTransaction {
  idPengeluaran: string;
  tanggal: string;
  namaPengeluaran: string;
  biaya: number;
  keterangan: string;
  timestamp: number;
}

interface Stock {
  idBarang: string;
  tanggalMasuk: string;
  tanggalKeluar: string;
  nama: string;
  harga: number;
  timestamp: number;
}

const OutgoingTransaction = () => {
  const dispatch = useDispatch();
  const [autoId, setAutoId] = React.useState<string>('');
  // const [idStock, setIdStock] = React.useState<string>('');
  const [selectedDate, setSelectedDate] = React.useState<string>('');
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
  const [stock, setStock] = React.useState<Stock>({
    idBarang: '',
    tanggalMasuk: '',
    tanggalKeluar: '',
    nama: '',
    harga: 0,
    timestamp: 0,
  });
  const toast = useToast();
  const dataOutgoing = useSelector(
    (state: RootState) => state.outgoingTransaction.dataOgTransaction,
  );
  const dataStock = useSelector((state: RootState) => state.stock.dataStock);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date.toLocaleDateString('id-ID'));
    setOutgoing(prevOutgoing => ({
      ...prevOutgoing,
      tanggal: date.toLocaleDateString('id-ID'),
    }));
    setStock(prevStock => ({
      ...prevStock,
      tanggalMasuk: date.toLocaleDateString('id-ID'),
    }));
  };

  const fetchData = React.useCallback(async () => {
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

  const handleInputChange = (field: keyof OutgoingTransaction, value: any) => {
    if (field === 'namaPengeluaran') {
      setOutgoing(prevOutgoing => ({
        ...prevOutgoing,
        [field]: value,
      }));
      setStock(prevStock => ({
        ...prevStock,
        nama: value,
      }));
    } else if (field === 'biaya') {
      setOutgoing(prevOutgoing => ({
        ...prevOutgoing,
        [field]: value,
      }));
      setStock(prevStock => ({
        ...prevStock,
        harga: value,
      }));
    } else if (field === 'tanggal') {
      setOutgoing(prevOutgoing => ({
        ...prevOutgoing,
        [field]: value,
      }));
      setStock(prevStock => ({
        ...prevStock,
        tanggalMasuk: value,
      }));
    } else {
      setOutgoing(prevOutgoing => ({
        ...prevOutgoing,
        [field]: value,
      }));
    }
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
    // setOutgoingData(items);
    dispatch({type: 'SET_STOCK_DATA', payload: items});
  }, [dispatch]);

  const handleSubmitStock = async () => {
    setStock(prevStock => ({
      ...prevStock,
      tanggalMasuk: selectedDate,
    }));
    if (
      stock.idBarang === '' ||
      stock.tanggalMasuk === '' ||
      stock.nama === '' ||
      stock.harga === 0
    ) {
      toast.show('Kolom input tidak boleh kosong!', {
        type: 'danger',
        duration: 1500,
      });
    } else {
      setStock(prevStock => ({
        ...prevStock,
        timestamp: new Date().getTime(),
      }));
      try {
        // console.log('employe', stock);
        await firestore().collection('Stock').add(stock);
        dispatch({type: 'INPUT_STOCK_DATA', payload: stock});
        toast.show('Berhasil menambah data stok barang', {type: 'success'});
        // Reset the form
        setAutoId('');
        setStock({
          idBarang: '',
          tanggalMasuk: selectedDate,
          tanggalKeluar: '',
          nama: '',
          harga: 0,
          timestamp: 0,
        });
      } catch (error) {
        console.error('Error adding stock: ', error);
      }
    }
  };

  const sendLog = async (id: string) => {
    try {
      const activity = {
        message: `Berhasil menambahkan data transaksi keluar dengan id ${id}`,
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
    setOutgoing(prevOutgoing => ({
      ...prevOutgoing,
      tanggalMasuk: selectedDate,
    }));
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
      setOutgoing(prevOutgoing => ({
        ...prevOutgoing,
        timestamp: new Date().getTime(),
      }));
      try {
        // console.log('employe', outgoing);
        await firestore().collection('OutgoingTransaction').add(outgoing);
        dispatch({type: 'INPUT_OUTGOING_DATA', payload: outgoing});
        toast.show('Berhasil menambah data', {type: 'success'});
        sendLog(outgoing.idPengeluaran);
        if (outgoing.keterangan === 'Barang') {
          handleSubmitStock();
        }
        // Reset the form
        setAutoId('');
        setOutgoing({
          idPengeluaran: '',
          tanggal: selectedDate,
          namaPengeluaran: '',
          biaya: 0,
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

  const generateIdStock = React.useCallback(() => {
    if (dataStock.length > 0) {
      const array = dataStock.map((entry: {idBarang: any}) => entry.idBarang);
      const lastTwoDigits = array.map((id: string) =>
        parseInt(id.slice(-2), 10),
      );
      // Find the largest last two digits
      const largestLastTwoDigits = Math.max(...lastTwoDigits);

      // Increment the largest last two digits and format the new ID
      const newIdNumber = largestLastTwoDigits + 1;
      const newId = `BR${newIdNumber.toString().padStart(3, '0')}`;
      // setIdStock(newId);
      setStock(prevStock => ({
        ...prevStock,
        idBarang: newId,
      }));
      const dateTimestamp = new Date().getTime();
      setStock(prevStock => ({
        ...prevStock,
        timestamp: dateTimestamp,
      }));
    } else {
      // setIdStock('BR001');
      setStock(prevStock => ({
        ...prevStock,
        idBarang: 'BR001',
      }));
      const dateTimestamp = new Date().getTime();
      setStock(prevStock => ({
        ...prevStock,
        timestamp: dateTimestamp,
      }));
    }
  }, [dataStock]);

  React.useEffect(() => {
    fetchData();
    fetchDataStock();
  }, [fetchData, fetchDataStock]);

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
                color: autoId === '' ? Pallets.netral_70 : Pallets.black,
                paddingTop: 7,
              },
            ]}
            onPress={() => {
              generateAutoId();
              generateIdStock();
            }}>
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
  keteranganContainer: {
    padding: 12,
    borderRadius: 6,
  },
});
