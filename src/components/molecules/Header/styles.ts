import {StyleSheet} from 'react-native';
import {Pallets} from '../../../theme/';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  logo: {
    width: 99,
    height: 31,
  },
  dot: {
    backgroundColor: Pallets.tertiary_main,
    position: 'absolute',
    right: 15,
  },
  titleContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  nameText: {
    marginLeft: 12,
    fontSize: 16,
  },
});
