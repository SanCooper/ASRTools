import React from 'react';
import {
  ScrollView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Pallets} from '../../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {styles} from './styles';

type Props = {
  label?: string;
  textColor?: string;
  setVisible?: (vis: boolean) => void;
  visible?: boolean;
  type?: string;
  style?: StyleProp<ViewStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
  title?: string;
  dropdownContent: any;
  disabled?: boolean;
};

const Dropdown = (props: Props) => {
  const {
    label,
    textColor = Pallets.netral_60,
    setVisible = () => {},
    visible,
    style,
    dropdownStyle,
    title,
    dropdownContent,
    disabled = false,
  } = props;
  const renderDropdown = () => {
    if (visible) {
      return (
        <View style={[styles.dropdown, dropdownStyle]}>
          <ScrollView>{dropdownContent}</ScrollView>
        </View>
      );
    }
  };

  return (
    <React.Fragment>
      {title && <Text style={styles.title}>{title}</Text>}
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={() => setVisible(!visible)}
        activeOpacity={0.7}
        disabled={disabled}>
        <Text
          style={[
            styles.labelText,
            {
              color: textColor,
              textTransform: 'capitalize',
            },
          ]}>
          {label}
        </Text>
        <View style={{padding: 14}}>
          <Ionicons name="chevron-down" size={20} color={Pallets.netral_60} />
        </View>
      </TouchableOpacity>
      {renderDropdown()}
    </React.Fragment>
  );
};

export default Dropdown;
