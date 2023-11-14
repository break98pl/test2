import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import BaseButton from '@atoms/BaseButton';
import PopoverRecordReha from './PopoverRecordReha';
import RehaTargetSection from './RehaTargetSection';

type PerformTime = {
  weight: string;
  count: string;
  time: string;
};

export type TRehaContentDetail = {
  practiceContent?: string;
  performStatus?: string;
  time?: string;
  category?: string;
  target?: PerformTime;
  perform?: PerformTime;
  finishedLevel?: string;
  borgScale?: string;
  memo?: string;
  reporter?: string;
};

interface IRehaContentRowProps {
  isHeader?: boolean;
  data?: TRehaContentDetail;
}

const RehaContentRow = (props: IRehaContentRowProps) => {
  const {isHeader, data} = props;
  const {t} = useTranslation();
  const [isShowPopover, setIsShowPopover] = useState(false);

  const openPopover = () => {
    setIsShowPopover(true);
  };

  if (isHeader) {
    return (
      <View style={styles.containerHeader}>
        <View style={StyleSheet.compose(styles.headerRow, styles.firstHeader)}>
          <BaseText size="small" text={t('popover.practice_content')} />
          <BaseText size="small" text={t('common.perform_status')} />
          <BaseText size="small" text={t('popover.deliver_time')} />
        </View>
        <View style={StyleSheet.compose(styles.headerRow, styles.secondHeader)}>
          <BaseText size="small" text={t('popover.category')} />
          <BaseText size="small" text={t('popover.target')} />
          <BaseText size="small" text={t('common.perform')} />
        </View>
        <View style={StyleSheet.compose(styles.headerRow, styles.thirdHeader)}>
          <BaseText size="small" text={''} />
          <BaseText size="small" text={t('popover.finished_level')} />
          <BaseText size="small" text={t('popover.borg_scale')} />
        </View>
        <View style={StyleSheet.compose(styles.headerRow, styles.fourthHeader)}>
          <BaseText size="small" numberOfLines={4} text={t('popover.memo')} />
        </View>
        <View style={StyleSheet.compose(styles.headerRow, styles.fifthHeader)}>
          <BaseText size="small" text={t('popover.reporter')} />
        </View>
        <View style={StyleSheet.compose(styles.headerRow, styles.sixthHeader)}>
          <BaseButton>
            <BaseText
              size="small"
              color={Colors.GRAY_PH}
              weight="bold"
              text=""
            />
          </BaseButton>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        isShowPopover && {backgroundColor: Colors.GRAY_BORDER},
      ]}>
      <BaseButton
        onPress={openPopover}
        style={StyleSheet.compose(styles.headerColumn, styles.firstHeader)}>
        <PopoverRecordReha
          isShowPopover={isShowPopover}
          setIsShowPopover={setIsShowPopover}
          practiceContent={data?.practiceContent}
          performStatus={data?.performStatus}
          time={data?.time}
        />
      </BaseButton>
      <BaseButton
        onPress={openPopover}
        style={StyleSheet.compose(styles.headerColumn, styles.secondHeader)}>
        <BaseText size="small" text={data?.category} />
        {data?.performStatus !== t('tsusho_vp_list.cancelRehaExercise') ? (
          <>
            <RehaTargetSection
              weight={data?.target?.weight}
              count={data?.target?.count}
              times={data?.target?.time}
            />
            <RehaTargetSection
              weight={data?.perform?.weight}
              count={data?.perform?.count}
              times={data?.perform?.time}
            />
          </>
        ) : (
          <>
            <BaseText
              color={Colors.PLUM_RED}
              text={`${t('popover.postpone_reason')}:水分摂取`}
            />
            <BaseText text={t('common.space')} />
          </>
        )}
      </BaseButton>
      <BaseButton
        onPress={openPopover}
        style={StyleSheet.compose(styles.headerColumn, styles.thirdHeader)}>
        <BaseText text={t('common.space')} />
        {data?.performStatus !== t('tsusho_vp_list.cancelRehaExercise') && (
          <>
            <BaseText size="small" text={data?.finishedLevel} />
            <BaseText size="small" text={data?.borgScale} />
          </>
        )}
      </BaseButton>
      <View
        style={StyleSheet.compose(
          styles.headerColumn,
          styles.fourthHeaderData,
        )}>
        <ScrollView>
          <BaseText lineHeight="medium" size="small" text={data?.memo} />
        </ScrollView>
      </View>
      <BaseButton
        onPress={openPopover}
        style={StyleSheet.compose(styles.headerColumn, styles.fifthHeader)}>
        <BaseText size="xSmall" text={data?.reporter} />
      </BaseButton>
      <BaseButton
        onPress={openPopover}
        style={StyleSheet.compose(styles.headerColumn, styles.sixthHeader)}>
        <BaseText size="small" color={Colors.GRAY_PH} weight="bold" text=">" />
      </BaseButton>
    </View>
  );
};

export default RehaContentRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderWidth: 0.5,
    borderColor: Colors.GRAY_BORDER,
  },
  containerHeader: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: Colors.LIGHT_GRAY_BACKGROUND,
  },
  headerRow: {
    justifyContent: 'center',
    rowGap: 3,
  },
  headerColumn: {
    height: 70,
    justifyContent: 'center',
  },
  firstHeader: {
    width: 160,
  },
  secondHeader: {
    width: 240,
  },
  thirdHeader: {
    width: 130,
    paddingTop: 5,
  },
  fourthHeader: {
    width: 170,
  },
  fourthHeaderData: {
    width: 170,
    paddingTop: 5,
    justifyContent: 'flex-start',
  },
  fifthHeader: {
    width: 80,
  },
  sixthHeader: {
    width: 40,
  },
});
