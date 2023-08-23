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
import {useToast} from 'react-native-toast-notifications';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {Dropdown} from '../../components/atoms';
import {EditIncomingProps} from './inteface';
import {RootState} from 'src/store/store';

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

const EditIncoming: React.FC<EditIncomingProps> = props => {
  const {route, navigation} = props;
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [stockVisible, setStockVisible] = React.useState<boolean>(false);
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
  const dataStock = useSelector((state: RootState) => state.stock.dataStock);

  const handleDateChange = (date: Date) => {
    setIncoming(prevIncoming => ({
      ...prevIncoming,
      tanggalMasuk: date.toLocaleDateString('id-ID'),
    }));
  };

  const fetchDataIncoming = React.useCallback(async () => {
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
      const collectionRef = firestore().collection('IncomingTransaction');
      const documentRef = collectionRef.doc(documentId);

      await documentRef.update(newData);
      console.log('Document updated successfully.');
      fetchDataIncoming();
      toast.show('Berhasil mengubah data', {type: 'success'});
      navigation.goBack();
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  async function getDocumentIdsByFieldValue(fieldName: string, value: string) {
    try {
      const collectionRef = firestore().collection('IncomingTransaction');
      const querySnapshot = await collectionRef
        .where(fieldName, '==', value)
        .get();
      const newData = {
        idPemasukan: incoming.idPemasukan,
        tanggalMasuk: incoming.tanggalMasuk,
        tipeHP: incoming.tipeHP,
        noNota: incoming.noNota,
        IMEI: incoming.IMEI,
        namaPelanggan: incoming.namaPelanggan,
        kerusakan: incoming.kerusakan,
        biaya: incoming.biaya,
        hargaPart: incoming.hargaPart,
        laba: incoming.laba,
        timestamp: incoming.timestamp,
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
    } else {
      getDocumentIdsByFieldValue('idPemasukan', incoming.idPemasukan);
    }
  };

  const setIncomingHandler = React.useCallback(() => {
    setIncoming(prevIncoming => ({
      ...prevIncoming,
      idPemasukan: route.params.idPemasukan,
      tanggalMasuk: route.params.tanggalMasuk,
      tipeHP: route.params.tipeHP,
      noNota: route.params.noNota,
      IMEI: route.params.IMEI,
      namaPelanggan: route.params.namaPelanggan,
      kerusakan: route.params.kerusakan,
      biaya: route.params.biaya,
      hargaPart: route.params.hargaPart,
      laba: route.params.laba,
      timestamp: route.params.timestamp,
    }));
  }, [route.params]);

  const getLaba = () => {
    if (incoming.biaya === 0) {
      return;
    } else {
      const laba = incoming.biaya - incoming.hargaPart;
      // (incoming.biaya as unknown as number) -
      // (incoming.hargaPart as unknown as number);
      setIncoming(prevIncoming => ({
        ...prevIncoming,
        laba: laba,
      }));
    }
  };

  React.useEffect(() => {
    setIncomingHandler();
  }, [setIncomingHandler]);

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
                color:
                  incoming.idPemasukan === ''
                    ? Pallets.netral_70
                    : Pallets.black,
                paddingTop: 7,
              },
            ]}>
            {incoming.idPemasukan !== ''
              ? incoming.idPemasukan
              : 'ID Transaksi Masuk'}
          </Text>
          <Text
            style={[
              styles.inputText,
              {
                color:
                  incoming.tanggalMasuk === ''
                    ? Pallets.netral_70
                    : Pallets.black,
                paddingTop: 7,
              },
            ]}
            onPress={() => setModalVisible(!modalVisible)}>
            {incoming.tanggalMasuk !== ''
              ? incoming.tanggalMasuk
              : 'Tanggal Transaksi'}
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

export default EditIncoming;

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
