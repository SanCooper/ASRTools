import React from 'react';
import {Appbar} from 'react-native-paper';
import {styles} from './styles';
import {Pallets} from '../../../theme/';

type Props = {
  backPress?: () => void;
  showBack?: boolean;
  showIcon1?: boolean;
  iconName1?: string;
  showIcon2?: boolean;
  iconName2?: string;
  iconPress1?: () => void;
  iconPress2?: () => void;
  title?: string;
  transparent?: boolean;
};

const Basic = (props: Props) => {
  const {
    backPress = () => {},
    showBack = false,
    showIcon1 = false,
    iconName1 = 'back',
    showIcon2 = false,
    iconName2 = 'back',
    iconPress1 = () => {},
    iconPress2 = () => {},
    title = '',
    transparent = false,
  } = props;
  return (
    <Appbar.Header
      style={{
        backgroundColor: transparent
          ? Pallets.transparent_0
          : Pallets.netral_10,
        elevation: !transparent ? 4 : 0,
        height: 50,
      }}>
      {showBack && (
        <Appbar.BackAction
          onPress={backPress}
          size={28}
          color={transparent ? Pallets.netral_10 : Pallets.netral_70}
        />
      )}
      <Appbar.Content
        title={title}
        titleStyle={[
          styles.title,
          {
            color: transparent ? Pallets.netral_10 : Pallets.primary_main,
            marginLeft: showIcon1 || showIcon2 === true ? 0 : -50,
          },
        ]}
        style={styles.titleContent}
      />
      {showIcon1 && (
        <Appbar.Action
          icon={iconName1}
          onPress={iconPress1}
          color={transparent ? Pallets.netral_10 : Pallets.netral_90}
        />
      )}
      {showIcon2 && (
        <Appbar.Action
          icon={iconName2}
          onPress={iconPress2}
          color={transparent ? Pallets.netral_10 : Pallets.netral_90}
        />
      )}
    </Appbar.Header>
  );
};

export default Basic;
