import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Pallets} from '../../theme';
import {Table, Row, TableWrapper, Cell} from 'react-native-reanimated-table';
// import {useSelector} from 'react-redux';
// import {RootState} from 'src/store/store';
import DatePicker from 'react-native-date-picker';
import firestore from '@react-native-firebase/firestore';
import {Button} from 'react-native-paper';
import RNPrint from 'react-native-print';

const Report = () => {
  const tableHead = [
    'No',
    'ID Laporan',
    'Tanggal',
    'Pemasukan',
    'Pengeluaran',
    // 'Laba',
  ];
  const flexArr = [0.4, 1, 1, 1, 1, 1];
  const [selectedMonth, setSelectedMonth] = React.useState<string>('');
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [showReport, setShowReport] = React.useState<boolean>(false);
  const [incomingData, setIncomingData] = React.useState<any[]>([]);
  const [outgoingData, setOutgoingData] = React.useState<any[]>([]);
  const [reportData, setReportData] = React.useState<any[]>([]);
  const [sumPengeluaran, setSumPengeluaran] = React.useState<number>(0);
  const [sumPemasukan, setSumPemasukan] = React.useState<number>(0);

  const handleDateChange = (dateData: Date) => {
    const date = new Date(dateData);
    const monthOptions = {month: 'long'} as Intl.DateTimeFormatOptions;
    const monthName = new Intl.DateTimeFormat('id-ID', monthOptions).format(
      date,
    );
    const year = date.getFullYear();
    const localDateFormat = `${monthName}-${year}`;
    setSelectedMonth(localDateFormat);
    //date for get fetch data by month year
    const date2 = new Date(dateData);
    const month2 = String(date2.getMonth() + 1); // Adding 1 because months are 0-indexed
    const year2 = date2.getFullYear();
    const localDateFormat2 = `${month2}/${year2}`;
    fetchHandle(localDateFormat2);
  };

  const handlePrint = async (data: any[]) => {
    const tableHeaders = `
      <tr>
        <th>No</th>
        <th>ID Laporan</th>
        <th>Tanggal</th>
        <th>Pemasukan</th>
        <th>Pengeluaran</th>
      </tr>
    `;

    const tableRows = data
      .map(
        (row, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${index > 8 ? 'LP0' + (index + 1) : 'LP00' + (index + 1)}</td>
        <td>${row.tanggal}</td>
        <td style="text-align: right;">${
          row.pemasukan === null ? '0' : row.pemasukan
        }</td>
        <td style="text-align: right;">${
          row.pengeluaran === null ? '0' : row.pengeluaran
        }</td>
      </tr>
    `,
      )
      .join('');

    const htmlContent = `
      <style>
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }
      </style>
      <h1>Laporan Bulan ${selectedMonth}</h1>
      <table>
        ${tableHeaders}
        ${tableRows}
        <tr>
          <td colspan="3" style="text-align: right;">Total</td>
          <td style="text-align: right;">${
            sumPemasukan === 0 ? '0' : sumPemasukan
          }</td>
          <td style="text-align: right;">${
            sumPengeluaran === 0 ? '-' : sumPengeluaran
          }</td>
        </tr>
        <tr>
          <td colspan="4" style="text-align: right;">Total Laba</td>
          <td style="text-align: right;">${sumPemasukan - sumPengeluaran}</td>
        </tr>
      </table>
    `;

    await RNPrint.print({
      html: htmlContent,
    });
  };

  const sumHandler = React.useCallback((data: any[]) => {
    sumPengeluaranHandler(data);
    sumPemasukanHandler(data);
  }, []);

  const sumPengeluaranHandler = (item: any[]): number => {
    let totalPengeluaran: number = 0;
    for (const entry of item) {
      const pengeluaran = entry.pengeluaran;
      if (pengeluaran !== null && typeof pengeluaran !== 'string') {
        totalPengeluaran += pengeluaran;
      } else if (typeof pengeluaran === 'string') {
        totalPengeluaran += parseInt(pengeluaran, 10);
      }
    }
    setSumPengeluaran(totalPengeluaran);
    return totalPengeluaran;
  };

  const sumPemasukanHandler = (item: any[]): number => {
    let totalPemasukan: number = 0;
    for (const entry of item) {
      const pemasukan = entry.pemasukan;
      if (pemasukan !== null && typeof pemasukan !== 'string') {
        totalPemasukan += pemasukan;
      } else if (typeof pemasukan === 'string') {
        totalPemasukan += parseInt(pemasukan, 10);
      }
    }
    setSumPemasukan(totalPemasukan);
    return totalPemasukan;
  };

  const generateReport = React.useCallback(() => {
    const report: any = [];

    incomingData.forEach(incoming => {
      const reportEntry = {
        tanggal: incoming.tanggalMasuk,
        pemasukan: incoming.laba,
        pengeluaran: null,
      };
      report.push(reportEntry);
    });
    outgoingData.forEach(outgoing => {
      const reportEntry = {
        tanggal: outgoing.tanggal,
        pemasukan: null,
        pengeluaran: outgoing.biaya,
      };
      report.push(reportEntry);
    });
    report.sort((a: any, b: any) => {
      const dateA = new Date(a.tanggal.split('/').reverse().join('/'));
      const dateB = new Date(b.tanggal.split('/').reverse().join('/'));
      return dateA.getTime() - dateB.getTime();
    });
    setReportData(report);
    sumHandler(report);
  }, [incomingData, outgoingData, sumHandler]);

  const fetchDataIncoming = React.useCallback(async (date: string) => {
    const itemsCollection = firestore().collection('IncomingTransaction');
    const snapshot = await itemsCollection.get();
    // .where('tanggalMasuk', '>=', dateFetch)
    // .get();
    const items: any = [];
    snapshot.forEach(doc => {
      if (doc.data().tanggalMasuk.includes(date)) {
        items.push({
          ...doc.data(),
        });
      }
    });
    // Sort the items array by timestamp
    items.sort((a: any, b: any) => a.timestamp - b.timestamp);
    // setIncomingData(items);
    setIncomingData(items);
  }, []);

  const fetchDataOutgoing = React.useCallback(async (date: string) => {
    const itemsCollection = firestore().collection('OutgoingTransaction');
    const snapshot = await itemsCollection.get();
    const items: any = [];
    snapshot.forEach(doc => {
      if (doc.data().tanggal.includes(date)) {
        items.push({
          ...doc.data(),
        });
      }
    });
    // Sort the items array by timestamp
    items.sort((a: any, b: any) => a.timestamp - b.timestamp);
    // setOutgoingData(items);
    setOutgoingData(items);
    // generateReport();
  }, []);

  const fetchHandle = async (date: string) => {
    fetchDataIncoming(date);
    fetchDataOutgoing(date);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{marginTop: 16}}>
        <View style={{marginHorizontal: 16, marginBottom: 16}}>
          <Text style={{color: Pallets.black, marginBottom: 5}}>
            Pilih Periode Bulan
          </Text>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <Text
              style={[
                styles.inputText,
                {
                  color:
                    selectedMonth === '' ? Pallets.netral_70 : Pallets.black,
                  paddingTop: 7,
                  width: '80%',
                },
              ]}
              onPress={() => setModalVisible(!modalVisible)}>
              {selectedMonth !== '' ? selectedMonth : 'Pilih Bulan'}
            </Text>
            <Button
              onPress={() => {
                generateReport();
                setShowReport(true);
              }}
              style={{
                width: '20%',
                backgroundColor: Pallets.primary_main,
                marginLeft: 6,
                marginBottom: 5,
              }}>
              OK
            </Button>
          </View>
        </View>
        <ScrollView horizontal={true} style={{paddingHorizontal: 16}}>
          <Table
            style={{paddingRight: 30}}
            borderStyle={{
              borderWidth: 1,
              borderColor: '#C1C0B9',
            }}>
            <TableWrapper style={{flexDirection: 'row', paddingRight: 5}}>
              <Row
                data={tableHead}
                style={styles.head}
                textStyle={{
                  color: Pallets.black,
                  alignSelf: 'center',
                  fontWeight: '700',
                }}
                flexArr={flexArr}
              />
            </TableWrapper>
            {reportData.map((item, index) => (
              <TableWrapper key={index} style={{flexDirection: 'row'}}>
                <Cell
                  data={index + 1}
                  textStyle={styles.text}
                  style={{width: 40, padding: 5}}
                />
                <Cell
                  data={index > 8 ? 'LP0' + (index + 1) : 'LP00' + (index + 1)}
                  textStyle={styles.text}
                  style={{width: 100, padding: 5}}
                />
                <Cell
                  data={item.tanggal}
                  textStyle={styles.text}
                  style={{width: 100, padding: 5}}
                />
                <Cell
                  data={item.pemasukan}
                  textStyle={styles.text}
                  style={{width: 100, padding: 5}}
                />
                <Cell
                  data={item.pengeluaran}
                  textStyle={styles.text}
                  style={{width: 100, padding: 5}}
                />
              </TableWrapper>
            ))}
          </Table>
        </ScrollView>
        {selectedMonth !== '' && showReport ? (
          <View>
            <Text style={{color: Pallets.black, marginLeft: 16, marginTop: 16}}>
              Laporan Bulan {selectedMonth}
            </Text>
            <Text style={{color: Pallets.black, marginLeft: 16, fontSize: 15}}>
              Pemasukan : {sumPemasukan === 0 ? '-' : sumPemasukan}
            </Text>
            <Text style={{color: Pallets.black, marginLeft: 16, fontSize: 15}}>
              Pengeluaran : {sumPengeluaran === 0 ? '-' : sumPengeluaran}
            </Text>
            <Text style={{color: Pallets.black, marginLeft: 16, fontSize: 15}}>
              Laba : {sumPemasukan - sumPengeluaran}
            </Text>
            <Button
              style={{
                backgroundColor: Pallets.primary_main,
                margin: 16,
              }}
              onPress={() => handlePrint(reportData)}>
              Cetak Data
            </Button>
          </View>
        ) : null}
      </ScrollView>
      <DatePicker
        modal
        open={modalVisible}
        mode="date"
        title={'Pilih Periode Bulan'}
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

export default Report;

const styles = StyleSheet.create({
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
    justifyContent: 'center',
    width: 440,
  },
  text: {marginHorizontal: 4, color: Pallets.black},
  inputText: {
    color: 'black',
    backgroundColor: Pallets.white,
    borderWidth: 1,
    borderColor: Pallets.netral_90,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: -5,
    marginTop: 0,
    height: 38,
  },
});
