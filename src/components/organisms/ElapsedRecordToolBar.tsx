import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import CheckAllButton from '@molecules/CheckAllButton';
import RegisterElapsedButton from '@molecules/RegisterElapsedButton';
import {useFocusEffect} from '@react-navigation/native';
import {useAppSelector} from '@store/config';
import {selectFilteringDate} from '@modules/tenant/tenant.slice';

interface IElapsedRecordToolBarProps {
  onCheckAll?: () => void;
  onCancelCheckAll?: () => void;
  allowRegister?: boolean;
}

const ElapsedRecordToolBar = (props: IElapsedRecordToolBarProps) => {
  const {onCheckAll, onCancelCheckAll, allowRegister} = props;
  const [isCheckAll, setIsCheckAll] = useState(true);
  const filteringDate = useAppSelector(selectFilteringDate);

  useFocusEffect(
    useCallback(() => {
      setIsCheckAll(true);
      onCancelCheckAll && onCancelCheckAll();
    }, []),
  );

  useEffect(() => {
    setIsCheckAll(true);
    onCancelCheckAll && onCancelCheckAll();
  }, [filteringDate]);

  const handleCheckAll = () => {
    if (!onCheckAll || !onCancelCheckAll) {
      return;
    }
    setIsCheckAll(!isCheckAll);
    if (isCheckAll) {
      onCheckAll();
    } else {
      onCancelCheckAll();
    }
  };

  return (
    <View style={styles.toolbar}>
      <CheckAllButton isChecked={isCheckAll} onPress={handleCheckAll} />
      <RegisterElapsedButton allowRegister={allowRegister} />
    </View>
  );
};

export default ElapsedRecordToolBar;

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
