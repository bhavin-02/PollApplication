import React from 'react';
import {Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import ThemeButtonStyle from './themeButtonStyle';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../theme/colors/colors';
import CustomText from '../text/CustomText';

export interface themeButtonProps {
  title?: string;
  loading?: boolean;
  containerStyle?: any;
  titleStyle?: any;
  ref?: any;
  onPress: () => void;
}

const ThemeButton = ({
  title = 'Button',
  loading = false,
  containerStyle = ThemeButtonStyle.container,
  titleStyle = ThemeButtonStyle.titleTextStyle,
  onPress,
  ref,
}: themeButtonProps) => {
  return (
    <TouchableOpacity
      ref={ref}
      style={[ThemeButtonStyle.container, containerStyle]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading}>
      <LinearGradient
        start={{x: 0.0, y: 2.5}}
        end={{x: 1.5, y: 2.5}}
        locations={[0, 0.5]}
        colors={['#79AFC1', '#79AFC1']}
        style={ThemeButtonStyle.linearGradientContainer}>
        {loading ? (
          <ActivityIndicator size="small" color={colors?.AppTheme.Secondary} />
        ) : (
          <CustomText textStyle={[ThemeButtonStyle.titleTextStyle, titleStyle]}>
            {title}
          </CustomText>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default ThemeButton;
