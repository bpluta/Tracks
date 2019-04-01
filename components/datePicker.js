import React from 'react';
import { View, Text, StyleSheet, TextInput, DatePickerIOS } from 'react-native';
import { RowItem } from './tableView/rowItem';
import { HorizontalLine } from './tableView/tableView'
import { RoundedButton } from './roundedButton';
import { Style } from '../style';

export class DatePicker extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <DatePickerIOS
          date={this.props.date}
          onDateChange={this.setDate}
          minimumDate={this.props.minimumDate}
          maximumDate={this.props.maximumDate}
          onDateChange={this.props.onDateChange}
          mode="datetime"
          minuteInterval={10}
        />
      </View>
    )
  }
}

DatePicker.defaultProps = {
  date: "",
  minimumDate: "",
  maximumDate: "",
  onDateChange: (() => 0),
}
