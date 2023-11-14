import {useCallback, useState} from 'react';

/**
 * Implement the logic of showing or hiding a component.
 *
 * @param defaultVisible
 */
const useVisible = (defaultVisible = false) => {
  const [isVisible, setVisible] = useState(defaultVisible);

  const showComponent = useCallback(() => {
    setVisible(true);
  }, []);

  const hideComponent = useCallback(() => {
    setVisible(false);
  }, []);

  return {isVisible, showComponent, hideComponent};
};

export default useVisible;
