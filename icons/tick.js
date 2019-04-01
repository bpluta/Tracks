import React from 'react';
import { Svg, Path } from 'react-native-svg';

export class TickIcon extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Svg viewBox="0 0 500 500" {...this.props}>
      <Path d="M170.4,456.4c-0.5,0-1.1,0-1.6,0c-12.3-0.5-23.7-6.4-31.1-16.2l-123.6-163C0.5,259.1,4,233.4,22,219.7  c18-13.7,43.8-10.1,57.4,7.9L173,350.9L422.6,70.5c15.1-16.9,41-18.4,57.9-3.4c16.9,15.1,18.4,41,3.4,57.9L201.1,442.6    C193.3,451.4,182.1,456.4,170.4,456.4z"/>
      </Svg>
    )
  }
}
