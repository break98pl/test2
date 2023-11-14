import React from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

interface Props {
  photoPath: string;
}

const CareListAPSignatureContent = ({photoPath}: Props) => {
  return photoPath ? (
    <View>
      <FastImage
        source={{
          uri: `file://${photoPath}`,
        }}
        style={styles.signatureImage}
        resizeMode={'contain'}
      />
    </View>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  signatureImage: {
    width: 70,
    height: 70,
  },
});

export default CareListAPSignatureContent;
