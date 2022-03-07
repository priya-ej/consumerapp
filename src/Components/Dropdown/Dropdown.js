import React, {useState} from 'react';
import DropDown from 'react-native-paper-dropdown';

const DropdownComponent = ({value, list, setValue, label}) => {
  const [isVisible, updateIsVisible] = useState(false);
  return (
    <DropDown
      visible={isVisible}
      showDropDown={() => updateIsVisible(true)}
      onDismiss={() => updateIsVisible(false)}
      label={label}
      value={value}
      setValue={setValue}
      list={list}

      theme={{
        colors: { surface: '#FFFFFF', text: '#000000', placeholder: '#000000', primary: '#CDAF84', background: '#F7F7F7' },
        roundness: 0,
      }}
      activeColor='#FFFFFF'
      dropDownItemStyle={{ backgroundColor: '#FFFFFF' }}
      dropDownItemSelectedStyle={{ backgroundColor: '#3985ff' }}
    />
  );
};

export default DropdownComponent;
