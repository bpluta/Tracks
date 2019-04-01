import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RowItem } from './tableView/rowItem';
import { Style } from '../style';

const Data = [10,0,0,40,30,21,26,74,55,29,95,100,88,76,93,100,28,0,54]

const Graph = (props) => {
    let table = []
    let spaceBetween = props.spaceBetween
    let width = (props.size/props.cols)-(2*spaceBetween)
    let height = width
    let rows = props.rows;
    let cols = props.cols;
    let data = props.data;
    var currentOpacity = 1;

    for (let i=0; i<rows; i++) {
      let children = []
      for (let j=0; j<cols; j++) {
        if (i*cols+j < props.data.length) {
          currentOpacity = 0.9*(props.data[i*cols+j]/100)+0.1
        }
        else {
          currentOpacity = 0.1;
        }
        children.push(
          <View
          key={(i+1)*(j+1)}
          style={{
            width: width,
            height: height,
            opacity: currentOpacity,
            backgroundColor: Style.colors.primary,
            margin: spaceBetween
          }}></View>
        )
      }
      table.push(<View key={i} style={{flex: 1, flexDirection: "row"}}>{children}</View>)
    }
    return <View>{table}</View>
  }

export class FrequencyGraph extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{flex: 1, flexDirection: "column"}}>
        <Graph
          size={this.props.size}
          spaceBetween={this.props.spaceBetween}
          rows={this.props.rows}
          cols={this.props.cols}
          data={this.props.data}
        />
      </View>
    )
  }
}

FrequencyGraph.defaultProps = {

}
