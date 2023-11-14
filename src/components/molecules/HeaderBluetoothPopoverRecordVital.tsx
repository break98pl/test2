import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';
import SVGIcon from '@atoms/SVGIcon';
import {Size} from '@themes/typography';

//TODO: handle text later
const text = '山下 達郎';

const sizeTextAbove: Size = 'medium';
const colorTextAbove = Colors.BLACK;
const sizeTextUnder: Size = 'small';
const colorTextUnder = Colors.GRAY_TEXT;

const HeaderBluetoothPopoverRecordVital = () => {
  return (
    <View style={styles.container}>
      <View style={styles.containerItem}>
        <SVGIcon name="elipse" width={48} height={48} />
        <View style={styles.containerText}>
          <BaseText size={sizeTextAbove} color={colorTextAbove} text={text} />
          <BaseText size={sizeTextUnder} color={colorTextUnder} text={text} />
        </View>
      </View>

      <View style={styles.containerItem}>
        <SVGIcon name="elipse" width={48} height={48} />
        <View style={styles.containerText}>
          <BaseText size={sizeTextAbove} color={colorTextAbove} text={text} />
          <BaseText size={sizeTextUnder} color={colorTextUnder} text={text} />
        </View>
      </View>

      <View style={styles.containerItem}>
        <SVGIcon name="elipse" width={48} height={48} />
        <View style={styles.containerText}>
          <BaseText size={sizeTextAbove} color={colorTextAbove} text={text} />
          <BaseText size={sizeTextUnder} color={colorTextUnder} text={text} />
        </View>
      </View>

      <View style={styles.containerItem}>
        <SVGIcon name="elipse" width={48} height={48} />
        <View style={styles.containerText}>
          <BaseText size={sizeTextAbove} color={colorTextAbove} text={text} />
          <BaseText size={sizeTextUnder} color={colorTextUnder} text={text} />
        </View>
      </View>
    </View>
  );
};

export default HeaderBluetoothPopoverRecordVital;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    width: '100%',
    gap: 20,
  },
  containerItem: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5,
  },
  containerText: {
    flexDirection: 'column',
    height: 44,
    justifyContent: 'center',
  },
});
