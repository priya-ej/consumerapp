import React, {useState, useEffect, useCallback, memo} from 'react';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import RNCheckBox from '@react-native-community/checkbox';

import {colors} from '../../../../styles/color';
import margins from '../../../../styles/margins';
import {isAndroid} from '../../../../styles/scale';

/**
 * Displays a CheckBox.
 * Suitable for both Android and IOS.
 */
const CheckBox = ({
  data,
  handleCheckBox,
  isChecked = false,
  disabled = false,
  checkColor = colors.dodgerBlue,
  unCheckColor = colors.grey,
}) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => setChecked(isChecked), [isChecked], [isChecked]);

  /** Calls the passed `handleCheckBox` with data and check status */
  // const onValueChange = useCallback(
  //   val => {
  //     setChecked(val);
  //     handleCheckBox && data && handleCheckBox(data, val);
  //   },
  //   [data, handleCheckBox],
  // );

  return (
    <TouchableOpacity
      style={{
        paddingLeft: margins.h2,
        paddingTop: margins.h5,
        paddingRight: margins.h5,
      }}
      // onPress={() => isAndroid && !disabled && onValueChange(!checked)}
      /** Bug on IOS onValugeChage is called for both checkBox and TouchableOpacity */
    >
      <RNCheckBox
        style={{
          width: margins.w15,
          height: margins.w15,
        }}
        value={checked}
        boxType={'square'}
        disabled={disabled}
        // onValueChange={onValueChange}
        tintColor={unCheckColor}
        onCheckColor={colors.white}
        onTintColor={checkColor}
        onFillColor={checkColor}
        tintColors={{true: checkColor, false: unCheckColor}}
        animationDuration={0.1}
      />
    </TouchableOpacity>
  );
};

CheckBox.propTypes = {
  /** Is the CheckBox checked */
  isChecked: PropTypes.bool,
  /** Is the CheckBox disabled */
  disabled: PropTypes.bool,
  /** Data is returned when checked */
  data: PropTypes.any.isRequired,
  /** Callback method is called when checked */
  handleCheckBox: PropTypes.func,
  /** BackgroundColor of CheckBox when checked */
  checkColor: PropTypes.string,
  /** BackgroundColor of CheckBox when unchecked */
  unCheckColor: PropTypes.string,
};

export default memo(CheckBox);
