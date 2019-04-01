import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';
import { StyleSheet, Platform, Button } from 'react-native';
import { HomeScreen } from '../views/home';
import { SettingsScreen } from '../views/settings';
import { ChangePasswordScreen } from '../views/changePassword';
import { LoginScreen } from '../views/login';
import { SignUpScreen } from '../views/signUp';
import { ForgottenScreen } from '../views/forgotten';
import { ClockIcon } from '../icons/clock';
import { ChartIcon } from '../icons/chart';
import { TaskIcon } from '../icons/task';
import { ProjectListScreen } from '../views/projectList';
import { ProjectScreen } from '../views/project';
import { ProjectSettingsScreen } from '../views/projectSettings';
import { ProjectSummaryScreen } from '../views/projectSummary';
import { NewProjectScreen } from '../views/newProject';
import { TaskScreen } from '../views/task';
import { NewTaskScreen } from '../views/newTask';
import { TaskSettingsScreen } from '../views/taskSettings';
import { TaskSummaryScreen } from '../views/taskSummary';
import { StatsScreen } from '../views/stats';
import { TodayScreen } from '../views/today';
import { InitScreen } from '../views/init';
import { Clock, Chart, Task } from '../icons/navigationIcons';
import { Style } from '../style';


const TITLE_OFFSET_LEFT_ALIGN = Platform.OS === 'ios' ? 20 : 56;

export const TodayStack = createStackNavigator({
  Today: {
    screen: TodayScreen,
  },
  Settings: {
    screen: SettingsScreen,
  },
  ChangePassword: {
    screen: ChangePasswordScreen,
  },
},{
  initialRouteName: 'Today',
})

export const StatsStack = createStackNavigator({
  Stats: {
    screen: StatsScreen,
  },
  Settings: {
    screen: SettingsScreen,
  },
  ChangePassword: {
    screen: ChangePasswordScreen,
  },
},{
  initialRouteName: 'Stats',
})

export const ProjectStack = createStackNavigator({
  Projects: {
    screen: ProjectListScreen,
  },
  Project: {
    screen: ProjectScreen,
  },
  NewProject: {
    screen: NewProjectScreen,
  },
  ProjectSettings: {
    screen: ProjectSettingsScreen,
  },
  ProjectSummary: {
    screen: ProjectSummaryScreen,
  },
  Task: {
    screen: TaskScreen,
  },
  NewTask: {
    screen: NewTaskScreen,
  },
  TaskSettings: {
    screen: TaskSettingsScreen,
  },
  TaskSummary: {
    screen: TaskSummaryScreen,
  },
  Settings: {
    screen: SettingsScreen,
  },
  ChangePassword: {
    screen: ChangePasswordScreen,
  },
},{
  initialRouteName: 'Projects',
})

export const MainApp = createBottomTabNavigator({
  Today: {
    screen: TodayStack,
    navigationOptions : {
      tabBarLabel: 'Today',
      tabBarIcon: ({tintColor }) => Clock(tintColor),
    }
  },
  Stats: {
    screen: StatsStack,
    navigationOptions : {
      tabBarLabel: 'Stats',
      tabBarIcon: ({tintColor }) => Chart(tintColor),
    }
  },
  Projects: { screen: ProjectStack,
  navigationOptions : {
    tabBarLabel: 'Project',
    tabBarIcon: ({tintColor }) => Task(tintColor),
  }
 }
},{
  tabBarOptions: {
    activeTintColor: Style.colors.primary,
  },
});


export const LoginStack = createStackNavigator({
  Login: {
    screen: LoginScreen,
  },
  SignUp: {
    screen: SignUpScreen,
  },
  Forgotten: {
    screen: ForgottenScreen,
  },
  Main: {
    screen: MainApp,
    navigationOptions : {
      header: null,
    }
  }
});

export const RootNavigator = createSwitchNavigator({
    Init: InitScreen,
    Main: MainApp,
    Login: LoginStack,
  },
  {
    initialRouteName: 'Init',
  }
)

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
});
