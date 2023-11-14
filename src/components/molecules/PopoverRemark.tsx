import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseTooltip from '@templates/BaseTooltip';
import BaseButton from '@atoms/BaseButton';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';
import useVisible from '@hooks/useVisible';

export type TRemark = {
  label: string;
  content: string;
};

interface IPopoverRemarkProps {
  data: TRemark;
  placement?: 'right' | 'center' | 'bottom' | 'left' | 'top';
}

const PopoverRemark = (props: IPopoverRemarkProps) => {
  const {data, placement = 'right'} = props;
  const {t} = useTranslation();
  const {
    isVisible: isShowRemarkPopover,
    showComponent: openRemarkPopover,
    hideComponent: hideRemarkPopover,
  } = useVisible();

  const renderRemarkTooltip = () => {
    return (
      <BaseText
        style={styles.remarkNoteContent}
        color={Colors.BLACK}
        text={data.content}
      />
    );
  };

  return (
    <BaseButton style={styles.container} onPress={openRemarkPopover}>
      <BaseTooltip
        title={data.label}
        showHeader
        placement={placement}
        isVisible={isShowRemarkPopover}
        onClose={hideRemarkPopover}
        closeOnContentInteraction={false}
        closeOnBackgroundInteraction={false}
        leftButtonText={t('user_list.close')}
        onLeftButtonPress={hideRemarkPopover}
        content={renderRemarkTooltip()}
        contentStyle={styles.remarkContainer}
        headerStyle={styles.headerSettingPeriod}>
        <View style={styles.targetView} />
      </BaseTooltip>
      <BaseText
        style={styles.remarkText}
        color={Colors.PRIMARY}
        text={data.label}
      />
    </BaseButton>
  );
};

export default PopoverRemark;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  remarkContainer: {
    width: 370,
    height: 650,
  },
  headerSettingPeriod: {
    backgroundColor: Colors.GRAY_BACKGROUND,
    borderBottomColor: Colors.GRAY_PH,
  },
  remarkText: {
    marginLeft: -30,
  },
  targetView: {
    width: 30,
    height: 10,
  },
  remarkNoteContent: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
});
