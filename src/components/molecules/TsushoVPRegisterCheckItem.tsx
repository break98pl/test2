import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DimensionValue} from 'react-native';
import {useAppDispatch, useAppSelector} from '@store/config';
import {
  addEndRegisterAllItem,
  addStartRegisterAllItem,
  deleteEndRegisterAllItem,
  deleteStartRegisterAllItem,
  selectEndRegisterAllItems,
  selectRegisterAllModalTypeOpening,
  selectStartRegisterAllItems,
} from '@modules/visitPlan/tsushoVPList.slice';
import {TsushoResidentTenantItem} from '@modules/visitPlan/type';
import {RegisterAllModalType} from '@organisms/RegisterAllModal';
import {checkIfItemCanRegisterAll} from '@modules/visitPlan/tsushoVPList.utils';
import Checkbox, {CheckboxType} from '@atoms/CheckBox';

type Props = {
  data: TsushoResidentTenantItem;
  width?: DimensionValue;
};

const TsushoVPRegisterCheckItem = ({width, data}: Props) => {
  const dispatch = useAppDispatch();

  const [isChecked, setIsChecked] = useState(true);

  const modalRegisterTypeOpening = useAppSelector(
    selectRegisterAllModalTypeOpening,
  );

  const startRegisterItems = useAppSelector(selectStartRegisterAllItems);
  const endRegisterItems = useAppSelector(selectEndRegisterAllItems);

  useEffect(() => {
    handleCheckStartRegisterItem();
  }, [startRegisterItems, modalRegisterTypeOpening]);

  useEffect(() => {
    handleCheckEndRegisterItem();
  }, [endRegisterItems, modalRegisterTypeOpening]);

  /**
   * called when list of start register all items changed and it has this item
   */
  const handleCheckStartRegisterItem = () => {
    if (modalRegisterTypeOpening === RegisterAllModalType.StartRegister) {
      const checkItem = startRegisterItems.find(item => item.id === data.id);

      if (checkItem) {
        setIsChecked(true);
      } else {
        setIsChecked(false);
      }
    }
  };

  /**
   * called when list of end register all items changed and it has this item
   */
  const handleCheckEndRegisterItem = () => {
    if (modalRegisterTypeOpening === RegisterAllModalType.EndRegister) {
      const checkItem = endRegisterItems.find(item => item.id === data.id);

      if (checkItem) {
        setIsChecked(true);
      } else {
        setIsChecked(false);
      }
    }
  };

  /**
   * call when user check or uncheck item in register modal
   * @param checkState check state of checkbox
   */
  const onCheckRegisterItem = (checkState: boolean) => {
    if (checkState) {
      if (modalRegisterTypeOpening === RegisterAllModalType.StartRegister) {
        dispatch(addStartRegisterAllItem(data));
      } else {
        dispatch(addEndRegisterAllItem(data));
      }
    } else {
      if (modalRegisterTypeOpening === RegisterAllModalType.StartRegister) {
        dispatch(deleteStartRegisterAllItem(data));
      } else {
        dispatch(deleteEndRegisterAllItem(data));
      }
    }
  };

  const onPressCheckbox = () => {
    const newState = !isChecked;

    setIsChecked(newState);
    onCheckRegisterItem(newState);
  };

  return (
    <View style={[styles.container, {width}]}>
      {checkIfItemCanRegisterAll(data, modalRegisterTypeOpening) && (
        <Checkbox
          isCheck={isChecked}
          onPress={onPressCheckbox}
          checkboxType={CheckboxType.Type2}
        />
      )}
    </View>
  );
};

export default TsushoVPRegisterCheckItem;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
