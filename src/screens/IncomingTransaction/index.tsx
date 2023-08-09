import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import {IncomingTransactionProps} from './interface';
import {Header} from '../../components/molecules';
import {Pallets} from '../../theme/';
import {Button} from 'react-native-paper';
// import DatePicker from 'react-native-date-picker';

const IncomingTransaction: React.FC<IncomingTransactionProps> = props => {
  const {navigation} = props;
  // const [selectedDate, setSelectedDate] = React.useState<Date>('');
  // const [open, setOpen] = React.useState<boolean>(false);

  // const handleDateChange = (date: Date) => {
  //   setSelectedDate(date);
  // };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Header.Basic
        title="Transaksi Masuk"
        showBack={true}
        backPress={() => navigation.goBack()}
      />
      <ScrollView style={{marginHorizontal: 16, paddingBottom: 50}}>
        <KeyboardAvoidingView>
          <TextInput
            placeholder="Id"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
          />
          <TextInput
            placeholder="Tanggal Transaksi"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
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
          {/* <DatePicker
          style={{width: 200}}
          date={selectedDate}
          mode="date"
          placeholder="Pilih tanggal"
          format="DD-MM-YYYY"
          confirmBtnText="OK"
          cancelBtnText="Batal"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 36,
            },
          }}
          onDateChange={date => handleDateChange(date)}
        /> */}
          <Button
            mode="contained"
            onPress={() => {}}
            style={{borderRadius: 10, marginTop: 16}}>
            SIMPAN
          </Button>
        </KeyboardAvoidingView>
      </ScrollView>
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
});
