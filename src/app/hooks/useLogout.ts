import {useSelector} from 'react-redux';
import {
  selectAppType,
  selectChoseService,
  setAppTypeOfPreviousLogin,
  setIsAuthenticated,
  setServiceOfPreviousLogin,
} from '@modules/authentication/auth.slice';
import {useAppDispatch} from '@store/config';
import {updateTenantStatesWhenLogout} from '@modules/tenant/tenant.slice';
import {resetCareListFilterOptions} from '@modules/careList/careList.slice';
import {setCareListSortedBy} from '@modules/record/record.slice';

const useLogout = () => {
  const appType = useSelector(selectAppType);
  const service = useSelector(selectChoseService);
  const dispatch = useAppDispatch();

  /**
   * Handle the logic of logout.
   */
  const logout = () => {
    dispatch(updateTenantStatesWhenLogout());
    dispatch(setAppTypeOfPreviousLogin({appType}));
    dispatch(setServiceOfPreviousLogin({service}));

    dispatch(setCareListSortedBy({sortedBy: 'desc'}));
    dispatch(resetCareListFilterOptions({resetAll: true}));

    dispatch(setIsAuthenticated({value: false}));
  };

  return {logout};
};

export default useLogout;
