import React, {Component} from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { RoundedButton } from '../components/roundedButton';
import { SignUpScreen } from '../views/signUp';
import { Gear } from '../icons/navigationIcons';
import { Style } from '../style';
import { PickerWidget } from '../components/pickerWidget';
import { HorizontalLine } from '../components/tableView/tableView';
import { Overlay } from 'react-native-elements';
import { Counter } from '../components/counter';
import { fetchUserData, fetchTaskData, fetchProjectData, startTask, stopTask, fetchLatestTask } from '../config/dataFetch';
import ProgressCircle from 'react-native-progress-circle';
import { getPreciseValueOfTimeLabel } from "../config/formatData";
import { CurrentItemBar } from '../components/currentItemBar';
import { LoadingScreen } from './loading';
import { EmptyScreen } from './empty';
import { isDemo } from './init';
import { getTimeLeftLabel, getTimeLabel, stringToDate } from '../config/formatData';
import { getProject, getTask, getUserData, getLatestTask, getRecentWorkTime } from '../demo/dataGateway.js';

function getPercentOfDailyWorkDone(workTime, dailyTarget) {
  return Math.floor((workTime/(dailyTarget*60*60))*100)
}

export class TodayScreen extends React.Component {
  constructor(props) {
    super(props);
    var mounted = false
    this.state = {
      isVisible: false,
      projectInfo: {},
      isLoaded: false,
      taskInfo: {},
      refreshing: false,
      isDataAvaiable: false,
    }
  }

  componentDidMount() {
    this.mounted = true
    this.fetchData().then(() => {
      if (this.state.taskInfo.isActive && this.mounted) {
        this.interval = setInterval(() => this.count(), 1000);
      }
    });
  }

  componentWillUnomount() {
    this.mounted = false
    clearInterval(this.interval);
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this.fetchData();
  }

  fetchData = async () => { {
    if (!isDemo) {
      await fetchLatestTask(async (taskResp) => {
        if (this.mounted) {
          if (Object.keys(taskResp).length === 0) {
            this.setState({isLoaded: true})
            this.setState({refreshing: false})
            this.setState({isDataAvaiable: false})
            return
          }
          await this.setState({taskInfo: taskResp})
          await fetchProjectData(this.state.taskInfo.projectId, async (projectResp) => {
            if (this.mounted) {
              await this.setState({projectInfo: projectResp});
              await fetchUserData((userResp) => {
                if (this.mounted) {
                  this.setState({userInfo: userResp});
                  if (typeof this.state.userInfo.workingDays === "undefined") {
                    this.setState((prevState) => ({
                      userInfo: { ...prevState.userInfo, "workingDays": 5}
                    }))
                  }
                  if (typeof this.state.userInfo.workingHours === "undefined") {
                    this.setState((prevState) => ({
                      userInfo: { ...prevState.userInfo, "workingHours": 8}
                    }))
                  }
                  this.setState({isLoaded: true})
                  this.setState({refreshing: false})
                  this.setState({isDataAvaiable: true})
                }
              })
            }
          })
        }
      })
    }
    else {
      await this.setState({taskInfo: getLatestTask()})
      await this.setState({projectInfo: getProject(this.state.taskInfo.projectId)})
      await this.setState({userInfo: getUserData()})
      this.setState({isLoaded: true})
      this.setState({refreshing: false})
      this.setState({isDataAvaiable: false})


  }}};

   static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Current Task",
      headerRight:
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Gear />
        </TouchableOpacity>,
      headerTintColor: Style.colors.primary,
    };
  };

  async updateTask(key, value, callback) {
    await this.setState((prevState) => ({
      taskInfo: { ...prevState.taskInfo, [key]: value}
    }),() => callback());
  }

  resumeTask() {
    this.updateTask('isActive', 1,() => {
      if (this.state.taskInfo.isActive === 1) {
        startTask(this.state.taskInfo.id,(resp) => 0)
        this.interval = setInterval(() => this.count(), 1000);
      }
    })
  }

  count() {
    this.updateTask("timeSpent", this.state.taskInfo.timeSpent+1, () => 0)
  }

  pauseTask() {
    this.updateTask('isActive', 0, () => {
      if (this.state.taskInfo.isActive === 0) {
        stopTask(this.state.taskInfo.id,(resp) => 0)
        clearInterval(this.interval);
      }
    })
  }

  getProjectState(deadline) {
    let timeDifference = stringToDate(deadline)-new Date()
    if (timeDifference < 0) {
      return "overdue"
    }
    else {
      return `${getTimeLabel(timeDifference)}`
    }
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <LoadingScreen />
      );
    }
    else {
      if (Object.keys(this.state.taskInfo).length === 0 && this.state.taskInfo.constructor === Object) {
        return (
          <EmptyScreen
            title="No active tasks avaiable"
            description="In order to start your work please navigate to Projects and choose a task You want to work on"
            buttonText="projects"
            buttonOnPress={()=>this.props.navigation.navigate('Projects')}
          />
        )
      }
      else {
        return (
          <SafeAreaView style={{ flex: 1}}>
            <ScrollView refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Task', { taskID: this.state.taskInfo.id })} >
            <View style={{width: "100%"}}>
              <CurrentItemBar
                title={this.state.taskInfo.name}
                subtitle={this.state.projectInfo.name}
                rectText={this.getProjectState(this.state.taskInfo.deadline)}
                rectColor={this.getProjectState(this.state.taskInfo.deadline) === "overdue" ? Style.colors.negative : Style.colors.positive }
                />
            </View>
            </TouchableOpacity>
            <View style={{marginTop: 60, marginBottom: "auto",justifyContent: 'center', alignItems: 'center' }}>
            <View>
              <ProgressCircle
                percent={getPercentOfDailyWorkDone(this.state.taskInfo.timeSpent, this.state.userInfo.workingHours)}
                radius={110}
                borderWidth={30}
                color={Style.colors.primary}
                shadowColor="#E2EDF4"
                bgColor="#ffffff"
              >
              <Text style={{ fontSize: 50, color: Style.colors.primary, fontWeight: "600" }}>
                {`${getPercentOfDailyWorkDone(this.state.taskInfo.timeSpent, this.state.userInfo.workingHours)}%`}
              </Text>
          </ProgressCircle>
            </View>
            <View style={{paddingTop: 20, alignItems: "center"}}>
              <Counter style={{fontSize: 50}} time={this.state.taskInfo.timeSpent}/>
              <Text style={{fontSize:25, fontWeight: "600",color: Style.colors.primary}}>{getPreciseValueOfTimeLabel(this.state.taskInfo.timeSpent,this.state.taskInfo.pricePerHour)}</Text>
              <View style={{paddingTop: 40}}>
              <CountButton isActive={this.state.taskInfo.isActive} onResume={()=>this.resumeTask()} onStop={()=>this.pauseTask()}/>
            </View>
            </View>
          </View>
        </ScrollView>
        </SafeAreaView>
      )
      }
    }
  }
}

const CountButton = (props) => {
  if (props.isActive === 1) {
    return (
      <RoundedButton
        text="stop task"
        onPress={() => props.onStop()}
      />
    )
  }
  else {
    return (
      <RoundedButton
        text="resume task"
        onPress={() => props.onResume()}
      />
    )
  }
}
