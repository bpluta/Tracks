import React from 'react';
import { View, Text, StyleSheet, TextInput, Picker } from 'react-native';
import { RowItem } from './tableView/rowItem';
import { HorizontalLine } from './tableView/tableView'
import { RoundedButton } from './roundedButton';
import { Style } from '../style';

export class ItemPicker extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <Picker
          prompt={this.props.prompt}
          mode="dropdown"
          selectedValue={this.props.selectedValue}
          onValueChange={this.props.onValueChange}
        >
        { this.props.items.map(({...item},i,arr) => (
           React.createElement(Picker.Item, {key: i, ...item})
        )) }
         </Picker>
        </View>
    )
  }
}

ItemPicker.defaultProps = {
  prompt: "",
  selectedValue: "",
  onValueChange: (() => 0),
  buttonOnPress : (() => 0),
}
