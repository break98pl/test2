import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';
import {useSelector} from 'react-redux';
import {selectIsShowReha} from '@modules/visitPlan/tsushoVPList.slice';
import {useTranslation} from 'react-i18next';
import {DimensionValue} from 'react-native';

export type TsushoMonthlyPlanAndResultItemProps = {
  monthlyPlanWidth?: DimensionValue;
  resultWidth?: DimensionValue;
  isHaveMonthlyPlan?: boolean;
  isHaveResult?: boolean;
  isShowUnInsurrance?: boolean;
  isForRegisterModal?: boolean;
};

const TsushoMonthlyPlanAndResultItem = ({
  monthlyPlanWidth,
  resultWidth,
  isHaveResult = false,
  isHaveMonthlyPlan = false,
  isShowUnInsurrance = false,
  isForRegisterModal = false,
}: TsushoMonthlyPlanAndResultItemProps) => {
  const {t} = useTranslation();
  const notCoverByInsuranceText = t('tsusho_vp_list.notCoverByInsurance');

  const isShowReha = useSelector(selectIsShowReha);

  const getUninsuranceBannerDimension = (): {
    width: DimensionValue;
    left: DimensionValue;
  } => {
    if (isForRegisterModal) {
      return {
        width: '22%',
        left: '31%',
      };
    } else {
      return {
        width: !isShowReha ? '24%' : '18%',
        left: '31%',
      };
    }
  };

  return (
    <>
      <View
        style={StyleSheet.flatten([
          {width: monthlyPlanWidth},
          styles.center,
          styles.borderRight,
        ])}>
        {isHaveMonthlyPlan ? (
          <View style={styles.havingMark} />
        ) : (
          <BaseText style={styles.noHave}>---</BaseText>
        )}
      </View>
      <View
        style={StyleSheet.flatten([
          {width: resultWidth},
          styles.center,
          styles.borderRight,
        ])}>
        {isHaveResult ? (
          <View style={styles.havingMark} />
        ) : (
          <BaseText style={styles.noHave}>---</BaseText>
        )}
      </View>
      {isShowUnInsurrance && (
        <View
          style={StyleSheet.flatten([
            styles.banner,
            getUninsuranceBannerDimension(),
          ])}>
          <BaseText style={styles.bannerText}>
            {notCoverByInsuranceText}
          </BaseText>
        </View>
      )}
    </>
  );
};

export default TsushoMonthlyPlanAndResultItem;

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderRight: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.GRAY_PH,
  },
  havingMark: {
    width: 14,
    height: 14,
    borderWidth: 0.7,
    borderColor: Colors.BLACK,
    borderRadius: 999,
  },
  banner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    backgroundColor: Colors.GRAY_PH,
  },
  bannerText: {
    color: Colors.WHITE,
    paddingVertical: 1,
    justifyContent: 'center',
  },
  noHave: {},
});
