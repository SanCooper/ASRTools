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

const OutgoingTransaction = () => {
  // const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = React.useState<string>('');
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date.toLocaleDateString('id-ID'));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
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
            value={selectedDate}
            onPressIn={() => setModalVisible(true)}
          />
          <TextInput
            placeholder="Nama Pengeluaran"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
          />
          <TextInput
            placeholder="Biaya"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
          />
          <TextInput
            placeholder="Keterangan"
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
