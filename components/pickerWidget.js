import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { RowItem } from './tableView/rowItem';
import { HorizontalLine } from './tableView/tableView'
import { RoundedButton } from './roundedButton';
import { ItemPicker } from './itemPicker';
import { DatePicker } from './datePicker';
import { Style } from '../style';

const pickerRowItemStyle = StyleSheet.create({
  box: {
    width: 300,
    height: "auto",
    padding: 10,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    borderRadius: 10,
    alignSelf: "center",
  },
  title: {
    fontSize: 18,
  },
  buttonRectStyle: {
    padding: 10,
    paddingLeft: 50,
    paddingRight: 50,
    width: "auto",
    height: Style.login.input.height,
    backgroundColor: Style.colors.transparent,
  },
  buttonTextStyle: {
    color: Style.colors.primary,
    fontSize: 16,
  }
});

export class PickerWidget extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={pickerRowItemStyle.box}>
        <View style={{alignItems: "center", textAlign: "center", marginBottom:10, marginTop:10}}>
        <Text style={pickerRowItemStyle.title}>{this.props.title}</Text>
        </View>
        <HorizontalLine width="90%"/>
        <Picker props={this.props} />
         <View style={{alignItems: "center"}} >
         <RoundedButton
           text={this.props.buttonText}
           onPress={this.props.buttonOnPress}
           rectStyle={pickerRowItemStyle.buttonRectStyle}
           textStyle={pickerRowItemStyle.buttonTextStyle}
           />
         </View>
        </View>
    )
  }
}


const Picker = (props)  => {
  props = props.props;
  switch (props.type) {
    case "date":
      return(
        <DatePicker
          date={props.date}
          minimumDate={props.minimumDate}
          maximumDate={props.maximumDate}
          onDateChange={props.onDateChange}
          />
      );
    default:
      return(
        <ItemPicker
          propmt={props.prompt}
          selectedValue={props.selectedValue}
          onValueChange={props.onValueChange}
          items={props.items}
          />
      )
    }
}

PickerWidget.defaultProps = {
  title: "Title",
  prompt: "",
  selectedValue: "",
  onValueChange: (() => 0),
  buttonText: "Apply",
  buttonOnPress : (() => 0),
}
