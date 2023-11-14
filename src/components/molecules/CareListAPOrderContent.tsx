import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import BaseText from '@atoms/BaseText';
import {APOrderRecord, APOrderService} from '@modules/record/record.type';
import useHighlightMemo from '@hooks/useHighlightMemo';

interface Props {
  apOrderRecord: APOrderRecord;
}

const CareListAPOrderContent = ({apOrderRecord}: Props) => {
  const {t} = useTranslation();
  const {highlightMemo} = useHighlightMemo();

  return (
    <View>
      {apOrderRecord.services.map((service: APOrderService, index) => (
        <View key={service.id}>
          <BaseText>
            {t('care_list.apOrderGroup')}
            {service.groupName}
          </BaseText>
          <BaseText>
            {t('care_list.apOrder')}
            {service.name}
          </BaseText>
          <BaseText>
            {t('care_list.apOrderStatus')}
            {service.isFinish
              ? t('care_list.implemented')
              : t('care_list.notImplemented')}
          </BaseText>
          {service.note && (
            <BaseText>
              {t('care_list.memoWithBracket')}
              {highlightMemo(service.note)}
            </BaseText>
          )}
          {index < apOrderRecord.services.length - 1 && (
            <BaseText>--------------------------------------</BaseText>
          )}
        </View>
      ))}
    </View>
  );
};

export default CareListAPOrderContent;
