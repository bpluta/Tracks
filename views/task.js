import React, {Component} from 'react';
import { View, SafeAreaView, Text, AsyncStorage, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LoadingScreen } from '../views/loading';
import { LargeLabel } from '../components/largeLabel';
import { TimeWidget } from '../components/timeWidget';
import { TableView } from '../components/tableView/tableView';
import { InfoRowItem } from '../components/tableView/infoRowItem';
import { DescriptionBox } from '../components/tableView/descriptionBox';
import { RoundedButton } from '../components/roundedButton';
import { Counter } from '../components/counter';
import { Style } from '../style';
import { Edit } from '../icons/navigationIcons';
import { getTaskState, getDateLabel, getTimeLeftLabel, getCounterLabel, getValueOfTimeLabel, getCurrencyLabel, getTimeLabel, getWidgetTimeLabel } from '../config/formatData';
import { fetchTaskData, updateTask, startTask, stopTask } from '../config/dataFetch';
import { isDemo } from './init';
import { getProject, getTask, getUserData, getRecentWorkTime } from '../demo/dataGateway.js';

export class TaskScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
   return {
     headerRight:
       <TouchableOpacity onPress={() => navigation.navigate('TaskSettings',{taskID: navigation.state.params.taskID})}>
         <Edit />
       </TouchableOpacity>,
      headerTintColor: Style.colors.primary,
   };
 };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      taskID: this.props.navigation.state.params.taskID,
      taskInfo: null,
      isActive: false,
      refreshing: false,
    }
    // this.fetchData();
  }

  toggleCounter = () => {
    this.setState({isActive: !this.state.isActive})
  }

  onWillBlur() {
    clearInterval(this.interval);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params.refreshNeeded) {
      this.fetchData();
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => { {
    if (!isDemo) {
      fetchTaskData(this.state.taskID, async (resp) => {
          await this.setState({taskInfo: resp});
          this.setState({isLoaded: true});
          this.setState({refreshing: false})
          if (this.state.taskInfo.isActive) {
            clearInterval(this.interval);
            this.interval = setInterval(() => this.count(), 1000);
          }
      })
    }
    else {
      await this.setState({taskInfo: getTask(this.state.taskID)})
      this.setState({isLoaded: true});
      this.setState({refreshing: false})
      if (this.state.taskInfo.isActive) {
        clearInterval(this.interval);
        this.interval = setInterval(() => this.count(), 1000);
      }
  }}}

  refresh = () => {
    this.setState({refreshing: true});
    this.fetchData();
  }

  updateTaskState = async (key: StateKeys, value) => {
    await this.setState((prevState) => ({
      taskInfo: { ...prevState.taskInfo, [key]: value}
    }));
    await updateTask(this.state.taskInfo,this.state.taskInfo.id,() => this.fetchData())
  }

  resumeTask() {
    this.updateTask('isActive', 1,() => {
      if (this.state.taskInfo.isActive === 1) {
        startTask(this.state.taskInfo.id,(resp) => 0)
        this.interval = setInterval(() => this.count(), 1000);
      }
    })
  }

  async updateTask(key, value, callback) {
    await this.setState((prevState) => ({
      taskInfo: { ...prevState.taskInfo, [key]: value}
    }),() => callback());
  }

  count() {
    this.setState((prevState) => ({
      taskInfo: { ...prevState.taskInfo, 'timeSpent': this.state.taskInfo.timeSpent+1}
    }));
  }

  pauseTask() {
    this.updateTask('isActive', 0, () => {
      if (this.state.taskInfo.isActive === 0) {
        stopTask(this.state.taskInfo.id,(resp) => 0)
        clearInterval(this.interval);
      }
    })
  }

  render() {
    if (!this.state.isLoaded) {
      return (<LoadingScreen />);
    }
    else {
      taskName = this.state.taskInfo.name;
      timeSpent = this.state.taskInfo.timeSpent;
      pricePerHour = this.state.taskInfo.pricePerHour;
      task = this.state.taskInfo;
      return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ScrollView refreshControl={
            <RefreshControl
              onRefresh={this.refresh}
              refreshing={this.state.refreshing}
            />
          }>
            <LargeLabel style={{marginTop: 10, marginLeft: 20}} text={taskName}/>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop:20, paddingBottom:30}}>
              <TimeWidget
                title="Time spent"
                main={getWidgetTimeLabel(timeSpent)}
                second={getValueOfTimeLabel(timeSpent,pricePerHour)}
              />
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom:20}}>
              <CounterWidget isActive={this.state.taskInfo.isActive} time={this.state.taskInfo.timeSpent} />
            </View>
            <View>
              <TaskInfo task={task}/>
            </View>
            <View style={{marginTop:20,flex: 1, paddingTop:10, paddingBottom:10, justifyContent: 'center', alignItems: 'center'}}>
              <Buttons navigation={this.props.navigation} isActive={this.state.taskInfo.isActive} state={task.state} pauseTask={() => this.pauseTask()} resumeTask={() => this.resumeTask()} updateTask={(key,value) => this.updateTaskState(key,value)}/>
            </View>
            <View style={{marginTop: 20, marginBottom: 30}}>
              <Description text={this.state.taskInfo.description} />
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}

const TaskInfo = (props) => {
  return (
    <TableView
      items={[
        {type: InfoRowItem, left: "Start Date", right: getDateLabel(props.task.createdAt)},
        {type: InfoRowItem, left: "Deadline", right: getDateLabel(props.task.deadline)},
        {type: InfoRowItem, left: "Hourly wage", right: getCurrencyLabel(props.task.pricePerHour,'PLN')},
        {type: InfoRowItem, left: "State", right: getTaskState(props.task.state)},
      ]}
      innerSeparatorWidth="100%"
    />
  );
};

const CounterWidget = (props) => {
  if (props.isActive == true) {
    return (
      <View style={{flex:1, flexDirection: "column"}}>
        <View style={{ flexDirection: "row", paddingBottom: 10, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{margin: 10,width:10,height:10,borderRadius:5,backgroundColor:Style.colors.negative}}></View>
          <Counter style={{fontSize: 30}} time={props.time} />
        </View>

      </View>
    )
  }
  else {
    return (<View></View>)
  }
}

const Buttons = (props) => {
  if (props.state == "closed") {
    return (
      <View>
      <View>
        <RoundedButton
          rectStyle={{width: 215, height: 42, borderWidth: 1, borderColor: Style.colors.neutralButton}}
          textStyle={{color: Style.colors.neutralButton, fontSize: 15}}
          text="Re-open task"
          onPress={() => props.updateTask('state','open')}
        />
      </View>
      </View>
    )
  }
  else if (props.state == "planned"){
    return (
      <View>
      <View>
        <RoundedButton
          rectStyle={{width: 215, height: 42, borderWidth: 1, borderColor: Style.colors.neutralButton}}
          textStyle={{color: Style.colors.neutralButton, fontSize: 15}}
          text="Open task"
          onPress={() => props.updateTask('state','open')}
        />
      </View>
      </View>
    )
  }
  else {
    if (!props.isActive) {
      return (
        <View>
        <View>
          <RoundedButton
            rectStyle={{width: 215, height: 42, borderWidth: 1, borderColor: Style.colors.positive}}
            textStyle={{color: Style.colors.positive, fontSize: 15}}
            text="Resume task"
            onPress={() => props.resumeTask()}
          />
        </View>
        <View style={{paddingTop:10}}>
          <RoundedButton
            rectStyle={{width: 215, height: 42, borderWidth: 1, borderColor: Style.colors.negative}}
            textStyle={{color: Style.colors.negative, fontSize: 15}}
            text="Mark as finished"
            onPress={() => props.updateTask('state','closed')}
          />
        </View>
        </View>
      )
    }
    else {
      return (
        <View>
        <View>
          <RoundedButton
            rectStyle={{width: 215, height: 42, borderWidth: 1, borderColor: Style.colors.neutralButton}}
            textStyle={{color: Style.colors.neutralButton, fontSize: 15}}
            text="Stop task"
            onPress={() => props.pauseTask()}
          />
        </View>
        <View style={{paddingTop:10}}>
          <RoundedButton
            rectStyle={{width: 215, height: 42, borderWidth: 1, borderColor: Style.colors.negative}}
            textStyle={{color: Style.colors.negative, fontSize: 15}}
            text="Mark as finished"
            onPress={() => props.updateTask('state','closed')}
          />
        </View>
        </View>
      )
    }
  }
}

const Description = (props) => {
  if (props.text!="") {
    return (
      <DescriptionBox title="Task Description" innerText={props.text}/>
    )
  }
  else {
    return (<View></View>)
  }
}
