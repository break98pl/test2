import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import BaseButton from '@atoms/BaseButton';

interface IExcretionTemplateItemProps {
  onPress?: () => void;
}

const ExcretionTemplateItem = (props: IExcretionTemplateItemProps) => {
  const {onPress} = props;
  return (
    <BaseButton style={styles.container} onPress={onPress}>
      <View style={styles.rectangleTemplateItem}>
        <View style={styles.viewTop}>
          <BaseText weight="medium" size="large" text="?" />
          <BaseText weight="medium" size="large" text="載" />
          <BaseText weight="medium" size="large" text="ト" />
        </View>
        <View style={styles.viewBottom}>
          <BaseText weight="medium" size="large" text="◯" />
          <BaseText weight="medium" size="large" text="◯" />
          <BaseText weight="medium" size="large" text="◯" />
        </View>
      </View>
      <BaseText
        numberOfLines={1}
        style={styles.labelTemplate}
        text="普通（大）"
      />
    </BaseButton>
  );
};

export default ExcretionTemplateItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.TEMPLATE_BG,
    paddingHorizontal: 10,
  },
  rectangleTemplateItem: {
    width: '60%',
    height: 100,
    alignItems: 'center',
    rowGap: 5,
  },
  viewTop: {
    width: 120,
    height: '50%',
    borderBottomWidth: 2,
    borderBottomColor: Colors.BLACK,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom: 5,
  },
  viewBottom: {
    width: 120,
    height: '50%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  labelTemplate: {
    textAlign: 'center',
    width: 100,
  },
});
