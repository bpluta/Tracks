import React from 'react';
import { GearIcon } from './gear';
import { ClockIcon } from './clock';
import { ChartIcon } from './chart';
import { TaskIcon } from './task';
import { PlusIcon } from './plus';
import { Style } from '../style';
import { Text } from 'react-native';

export const Gear = () => (
  <GearIcon
      fill={Style.colors.primary}
      width={Style.icon.width}
      height={Style.icon.height}
      style={{
        marginRight: Style.icon.marginRight,
        marginLeft: Style.icon.marginLeft,
      }}
  />
);

export const Chart = (color) => (
  <ChartIcon
    fill={color}
    width={Style.icon.width}
    height={Style.icon.width}
  />
);

export const Task = (color) => (
  <TaskIcon
    fill={color}
    width={Style.icon.width}
    height={Style.icon.width}
  />
);

export const Clock = (color) => (
  <ClockIcon
    fill={color}
    width={Style.icon.width}
    height={Style.icon.width}
  />
);

export const Edit = () => (
  <Text
    width={Style.icon.width} height={Style.icon.height}
    style={{
      color: Style.colors.primary,
      fontSize: 17,
      marginRight: Style.icon.marginRight,
      marginLeft: Style.icon.marginLeft
    }}>
      Edit
    </Text>
)

export const Save = () => (
  <Text
    width={Style.icon.width} height={Style.icon.height}
    style={{
      color: Style.colors.primary,
      fontSize: 17,
      marginRight: Style.icon.marginRight,
      marginLeft: Style.icon.marginLeft
    }}>
      Save
    </Text>
)

export const Plus = () => (
  <PlusIcon fill={Style.colors.primary}
    width={Style.icon.width}
    height={Style.icon.height}
    style={{
      marginRight: Style.icon.marginRight,
      marginLeft: Style.icon.marginLeft,
    }}
  />
)
