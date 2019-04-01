import React, {Component} from 'react';
import { View, SafeAreaView, ScrollView, Text, ActivityIndicator, AsyncStorage, TouchableOpacity, RefreshControl } from 'react-native';
import { RoundedButton } from '../components/roundedButton';
import { LoadingScreen } from '../views/loading';
import { TimeWidget } from '../components/timeWidget';
import { TableView } from '../components/tableView/tableView';
import { MoreInfoRowItem } from '../components/tableView/moreInfoRowItem';
import { RoundedRect } from '../components/roundedRect';
import { Style } from '../style';
import { LargeLabel } from '../components/largeLabel';
import { DescriptionBox } from '../components/tableView/descriptionBox';
import { TickIcon } from '../icons/tick';
import { InfoRowItem } from '../components/tableView/infoRowItem';
import { HorizontalLine } from '../components/tableView/tableView';
import { Edit } from '../icons/navigationIcons';
import { fetchProjectData, updateProject, updateTask } from '../config/dataFetch';
import { isDemo } from './init';
import { getUserData, getRecentWorkTime, getProject } from '../demo/dataGateway.js';
import { getTaskState, getDate, getTimeLeftLabel, getValueOfTimeLabel, getTimeLabel, getWidgetTimeLabel, stringToDate } from '../config/formatData';

export class ProjectScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
   return {
     headerRight:
       <TouchableOpacity onPress={() => navigation.navigate('ProjectSettings',{projectID: navigation.state.params.projectID})}>
         <Edit />
       </TouchableOpacity>,
       headerTintColor: Style.colors.primary,
   };
 };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      projectID: this.props.navigation.state.params.projectID,
      projectInfo: null,
      tasksInfo: null,
      refreshing: false,
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => { {
    if (!isDemo) {
      fetchProjectData(this.state.projectID, async (resp) => {
          await this.setState({projectInfo: resp});
          if (this.state.projectInfo) {
            await this.setState({tasksInfo: resp.tasks})
            this.setState({isLoaded: true});
          }
          this.setState({refreshing : false});
      });
    }
    else {
      await this.setState({projectInfo: getProject(this.state.projectID)})
      await this.setState({tasksInfo: getProject(this.state.projectID).tasks})
      this.setState({isLoaded : true})
      this.setState({refreshing : false});
    }
  } };

  updateTaskState = async (key: StateKeys, value) => {
    let taskArray = this.state.tasksInfo;
    for (var i=0; i<taskArray.length; i++) {
      taskArray[i][key] = value
    }
    await this.setState((prevState) => ({
      tasksInfo: taskArray
    }))
    for (var i=0; i<this.state.tasksInfo.length; i++) {
      await updateTask(this.state.tasksInfo[i],this.state.tasksInfo[i].id,() => 0)
    }
  }

  updateProjectState = async (key: StateKeys, value) => {
    await this.setState((prevState) => ({
      projectInfo: { ...prevState.projectInfo, [key]: value}
    }));
    await this.updateTaskState(key,value)
    await updateProject(this.state.projectInfo,this.state.projectInfo.id,() => this.fetchData())
  }

  onRefresh() {
    this.setState({refreshing: true});
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params.refreshNeeded) {
      this.fetchData();
    }
  }


  render() {
    if (!this.state.isLoaded) {
      return (
        <LoadingScreen />
      );
    }
    else {
      timeSpent = this.state.projectInfo.timeSpent;
      pricePerHour = this.state.projectInfo.pricePerHour;
      projectName = this.state.projectInfo.name;
      navigation = this.props.navigation;
      tasksInfo = this.state.tasksInfo;
      projectID = this.state.projectInfo.id;
      projectDescription = this.state.projectInfo.description;
      projectPaymaster = this.state.projectInfo['for'];
      projectState = this.state.projectInfo.hasOwnProperty('state') ? this.state.projectInfo.state : "open";

      return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ScrollView refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }>
            <LargeLabel style={{marginTop: 10, marginLeft: 20}} text={projectName}/>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop:20, paddingBottom:50}}>
              <TimeWidget
                title="Time spent"
                main={getWidgetTimeLabel(timeSpent)}
                second={getValueOfTimeLabel(timeSpent,pricePerHour)}
              />
            </View>

            <View style={{marginBottom: 10}}>
              <TaskList
                tasks={tasksInfo}
                navigation={navigation}/>
            </View>

            <View style={{marginTop:10,flex: 1, justifyContent: 'center', alignItems: 'center'}}>

              <Buttons state={projectState} navigation={navigation} projectID={projectID} updateProject={(key,value) => this.updateProjectState(key,value)}/>
            </View>
            <View style={{marginTop: 20, marginBottom: 30}}>
              <Description text={projectDescription}/>
              <Paymaster name={projectPaymaster}/>
            </View>

          </ScrollView>
        </SafeAreaView>
    );
  }
  }
}

const Buttons = (props) => {
  if (props.state=="open") {
    return (
      <View>
        <View style={{paddingTop:10}}>
          <RoundedButton
            rectStyle={{width: 215, height: 42, borderWidth: 1, borderColor: Style.colors.neutralButton}}
            textStyle={{color: Style.colors.neutralButton, fontSize: 15}}
            text="Add new task"
            onPress={() => props.navigation.navigate('NewTask', { projectID: props.projectID })}
          />
        </View>
        <View style={{paddingTop:10, paddingBottom:10}}>
          <RoundedButton
            rectStyle={{width: 215, height: 42, borderWidth: 1, borderColor: Style.colors.negative}}
            textStyle={{color: Style.colors.negative, fontSize: 15}}
            text="Mark as finished"
            onPress={() => props.updateProject('state','closed')}
          />
        </View>
      </View>
    )
  }
  else if (props.state="closed") {
    return (
      <View>
        <View style={{paddingTop:10}}>
          <RoundedButton
            rectStyle={{width: 215, height: 42, borderWidth: 1, borderColor: Style.colors.positive}}
            textStyle={{color: Style.colors.positive, fontSize: 15}}
            text="Project summary"
            onPress={() => props.navigation.navigate('ProjectSummary', { projectID: props.projectID })}
          />
        </View>
        <View style={{paddingTop:10, paddingBottom:10}}>
          <RoundedButton
            rectStyle={{width: 215, height: 42, borderWidth: 1, borderColor: Style.colors.neutralButton}}
            textStyle={{color: Style.colors.neutralButton, fontSize: 15}}
            text="Re-open"
            onPress={() => props.updateProject('state','open')}
          />
        </View>
      </View>
    )
  }

}

const isOverdue = (deadlineString) => {
  let deadline = stringToDate(deadlineString)
  let currentDate = new Date();
  return deadline < currentDate
};

const Paymaster = (props) => {
  if (props.name!="") {
    return (
      <View style={{marginTop:30}}>
        <HorizontalLine />
          <InfoRowItem left="Paymaster" right={props.name} />
        <HorizontalLine />
      </View>
    )
  }
  else {
    return (<View></View>)
  }
}

const Description = (props) => {
  if (props.text!="") {
    return (
      <DescriptionBox title="Project Description" innerText={props.text}/>
    )
  }
  else {
    return (<View></View>)
  }
}

const TaskList = (props) => {
  items = [];
  props.tasks.map((task) => {
    items.push({
      type: MoreInfoRowItem,
      main: task.name,
      second: getTaskState(task.state),
      rightItem: task.state=="closed" ? <TickIcon style={{alignSelf: "flex-end", marginRight:10}} fill="#93C470" height="25" width="25"/> :
        <RoundedRect
        text={getTimeLeftLabel(task.deadline)}
        rectStyle={{
          height: 33,
          alignSelf: 'flex-end',
          backgroundColor: isOverdue(task.deadline) ? Style.colors.negative : Style.colors.positive,
        }}
        textStyle={{
          marginLeft: 15,
          marginRight: 15,
          fontWeight: "700",
          fontSize: 16,
          color: Style.colors.contrastToPrimary,
        }}
      />,
    onPress: () => props.navigation.navigate('Task', { taskID: task.id })});
  });
  return (
    <TableView items={items} innerSeparatorWidth="90%"/>
  );
};
