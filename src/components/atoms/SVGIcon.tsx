import * as React from 'react';
import {View} from 'react-native';
import {SvgProps} from 'react-native-svg';

import {svgs, SVGIconTypes} from '@constants/svgs';

export interface IconProps extends SvgProps {
  width: number;
  height: number;
  name: SVGIconTypes;
}

const SVGIcon = (props: IconProps) => {
  const {name, width, height, ...others} = props;
  const IconComponent = svgs[name] ?? <View />;

  return <IconComponent {...others} width={width} height={height} />;
};

export default SVGIcon;
