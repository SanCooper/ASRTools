import {SafeAreaView, ScrollView, Text} from 'react-native';
import React from 'react';
import {Pallets} from '../../theme';

const IncomingList = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{marginHorizontal: 16, paddingBottom: 50}}>
        <Text style={{color: Pallets.black}}>Data Transaksi Masuk</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IncomingList;
