/* eslint-disable prettier/prettier */
import { StyleSheet } from 'react-native';
import { Pallets, shadow } from '../../../theme';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: Pallets.netral_50,
        paddingLeft: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 6,
        zIndex: 1,
      },
      labelText: {
        fontSize: 14,
      },
      dropdown: {
        ...shadow.shadow_3,
        backgroundColor: Pallets.netral_10,
        width: '100%',
        borderRadius: 6,
        padding: 4,
        marginTop: 5,
      },
      title: {
        fontSize: 16,
        color: Pallets.netral_80,
        marginBottom: 4,
    },
});
