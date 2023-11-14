import React from 'react';
import ShiJuTaTopBar from './ShiJuTaTopBar';
import ShiJuTaToolBar from './ShiJuTaToolBar';

interface IShiJuTaNavBarProps {
  onCheckAll?: () => void;
  onCancelCheckAll?: () => void;
  allowRegister?: boolean;
}

const ShiJuTaNavBar = (props: IShiJuTaNavBarProps) => {
  const {onCheckAll, onCancelCheckAll, allowRegister} = props;
  return (
    <>
      <ShiJuTaTopBar />
      <ShiJuTaToolBar
        allowRegister={allowRegister}
        onCheckAll={onCheckAll}
        onCancelCheckAll={onCancelCheckAll}
      />
    </>
  );
};

export default ShiJuTaNavBar;
