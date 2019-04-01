import React from 'react';
import { Svg, Polygon } from 'react-native-svg';

export class PlusIcon extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Svg viewBox="0 0 500 500" {...this.props}>
        <Polygon points="417.5,236 417.5,264 264,264 264,417.5 236,417.5 236,264 82.5,264 82.5,236 236,236 236,82.5 264,82.5 264,236 "/>
      </Svg>
    )
  }
}
