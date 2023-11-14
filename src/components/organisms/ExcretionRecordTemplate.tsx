import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppType} from '@modules/setting/setting.type';
import {serviceTypeListOne, serviceTypeListTwo} from '@constants/constants';
import {
  selectAppType,
  selectChoseServiceName,
} from '@modules/authentication/auth.slice';

import ExcretionTemplateSelectionList from './ExcretionTemplateSelectionList';
import CapacityInputRecord from '@molecules/CapacityInputRecord';
import {useAppSelector} from '@store/config';
import {t} from 'i18next';
import {ExcretionModel} from '@modules/record/excretion.model';

interface IExcretionRecordTemplateProps {
  onClose?: () => void;
  onSelectedItem?: (item: IExcretionTemplate) => void;
  dataServicePlan: string;
}
export interface IExcretionTemplate {
  id: string;
  setNum?: number;
  setNo?: number;
  setName?: string;
  urineLeak?: string; //Sikkin
  excretionTool?: string; //HaisetuYogu
  urineQuantity?: string; //Hainyoryo
  urineStatus?: string; //HainyoKeitai
  faeceQuantity?: string; //Haibenryo
  faeceStatus?: string; //HaibenKeitai
  memo?: string;

  field1?: string;
  field2?: string;
  field3?: string;
  field4?: string;
  field5?: string;
  field6?: string;
  seq?: number;
  planServiceName?: string;
}

const ExcretionRecordTemplate = (props: IExcretionRecordTemplateProps) => {
  const {onClose, onSelectedItem, dataServicePlan} = props;
  const [servicePlan, setServicePlan] = useState(dataServicePlan);
  const appType = useAppSelector(selectAppType);
  const serviceName = useAppSelector(selectChoseServiceName);
  const [iconDatas, setIconDatas] = useState<IExcretionTemplate[]>([]);
  const getIconDatas = async () => {
    const data = await ExcretionModel.getExcretionTemplate();
    //const data: IExcretionTemplate[] = [];
    setIconDatas(data ? data : []);
  };

  useEffect(() => {
    getIconDatas();
  }, []);

  return (
    <View style={styles.container}>
      {appType === AppType.TAKINO && (
        <CapacityInputRecord
          label={t('popover.service_type')}
          title={t('popover.service_type')}
          value={servicePlan}
          data={
            serviceName === t('care_list.smallMultiFunctionsService')
              ? serviceTypeListOne
              : serviceTypeListTwo
          }
          onChange={e => setServicePlan(e)}
          placeholder={t('popover.not_set')}
          showInfoIcon
          isUseCustomStyle
        />
      )}
      <ExcretionTemplateSelectionList
        onClose={onClose}
        data={iconDatas}
        onSelectItem={item =>
          onSelectedItem &&
          onSelectedItem(Object.assign(item, {planServiceName: servicePlan}))
        }
      />
    </View>
  );
};

export default ExcretionRecordTemplate;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    height: 540,
  },
});
