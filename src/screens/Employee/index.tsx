import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import {EmployeeProps} from './interface';
import {Header} from '../../components/molecules';
import {Pallets} from '../../theme/';
import {Button} from 'react-native-paper';
// import DatePicker from 'react-native-date-picker';

const Employee: React.FC<EmployeeProps> = props => {
  const {navigation} = props;
  // const [selectedDate, setSelectedDate] = React.useState<Date>('');
  // const [open, setOpen] = React.useState<boolean>(false);

  // const handleDateChange = (date: Date) => {
  //   setSelectedDate(date);
  // };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Header.Basic
        title="Data Karyawan"
        showBack={true}
        backPress={() => navigation.goBack()}
      />
      <ScrollView style={{marginHorizontal: 16, paddingBottom: 50}}>
        <KeyboardAvoidingView>
          <TextInput
            placeholder="Id Karyawan"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
          />
          <TextInput
            placeholder="Nama"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
          />
          <TextInput
            placeholder="Jabatan"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
          />
          <TextInput
            placeholder="Jenis Kelamin"
            placeholderTextColor={Pallets.netral_70}
            style={styles.inputText}
          />
          <TextInput
            placeholder="Gaji"
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

export default Employee;

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
