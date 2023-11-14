import React from 'react';
import TsuTopBar from './TsuTopBar';
import TsuToolBar from './TsuToolBar';

interface ITsuNavBarProps {
  onCheckAll?: () => void;
  onCancelCheckAll?: () => void;
  allowRegister?: boolean;
}

const TsuNavBar = (props: ITsuNavBarProps) => {
  const {onCheckAll, onCancelCheckAll, allowRegister} = props;
  return (
    <>
      <TsuTopBar />
      <TsuToolBar
        allowRegister={allowRegister}
        onCheckAll={onCheckAll}
        onCancelCheckAll={onCancelCheckAll}
      />
    </>
  );
};

export default TsuNavBar;
