import {StyleSheet} from 'react-native';
import React, {useState} from 'react';
import PopoverRecordElapsed from './PopoverRecordElapsed';
import BaseButton from '@atoms/BaseButton';

interface IRegisterElapsedButtonProps {
  allowRegister?: boolean;
}

const RegisterElapsedButton = (props: IRegisterElapsedButtonProps) => {
  const {allowRegister} = props;
  const [isShowElapsedPopover, setIsShowElapsedPopover] = useState(false);

  return (
    <BaseButton style={styles.registerAllBtn}>
      <PopoverRecordElapsed
        isShowPopover={isShowElapsedPopover}
        setIsShowPopover={setIsShowElapsedPopover}
        allowRegister={allowRegister}
        arrowStyle={styles.hideArrow}
        style={styles.registerButtonCustom}
        registerAllButton
      />
    </BaseButton>
  );
};

export default RegisterElapsedButton;

const styles = StyleSheet.create({
  registerButtonCustom: {
    left: 12,
    width: 100,
    justifyContent: 'flex-start',
    flexDirection: 'row-reverse',
  },
  registerAllBtn: {
    width: 101,
    height: 30,
  },
  hideArrow: {
    display: 'none',
  },
});
