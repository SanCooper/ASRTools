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
import DatePicker from 'react-native-date-picker';

const IncomingTransaction = () => {
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState<string>('');

  const handleDateChange = (date: Date) => {
    setSelectedDate(date.toLocaleDateString('id-ID'));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{marginHorizontal: 16, paddingBottom: 50}}>
        <KeyboardAvoidingView>
          <TextInput
            placeholder="ID Transaksi Masuk"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
          />
          <TextInput
            placeholder="Tanggal Transaksi"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
            value={selectedDate}
            onPressIn={() => setModalVisible(true)}
          />
          <TextInput
            placeholder="Tipe HP"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
          />
          <TextInput
            placeholder="No Nota"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
          />
          <TextInput
            placeholder="IMEI"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
          />
          <TextInput
            placeholder="Nama Pelanggan"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
          />
          <TextInput
            placeholder="Kerusakan"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
          />
          <TextInput
            placeholder="Biaya"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
          />
          <TextInput
            placeholder="Harga Part"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
          />
          <TextInput
            placeholder="Laba"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
          />
          <Button
            mode="contained"
            onPress={() => {}}
            style={{borderRadius: 10, marginTop: 16}}>
            SIMPAN
          </Button>
        </KeyboardAvoidingView>
      </ScrollView>
      <DatePicker
        modal
        open={modalVisible}
        mode="date"
        date={new Date()}
        onConfirm={date => {
          setModalVisible(false);
          handleDateChange(date);
        }}
        onCancel={() => {
          setModalVisible(false);
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
