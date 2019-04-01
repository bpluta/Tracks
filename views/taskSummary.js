import React, {Component} from 'react';
import { View, SafeAreaView, Text, ScrollView } from 'react-native';
import { InfoRowItem } from '../components/tableView/infoRowItem';
import { TableView } from '../components/tableView/tableView';
import { TableTitle } from '../components/tableView/tableView';
import { ToggleRowItem } from '../components/tableView/toggleRowItem';
import { HorizontalLine } from '../components/tableView/tableView';

export class TaskSummaryScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Task summary',
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
      includeTasks: true,
    }
    this.fetchData();
  }

  fetchData = async () => { {
    await this.fetchProject();
    await this.fetchTasks();
    this.setState({isLoaded: true});
  } };

  fetchProject = async () => { {
    let projects = await AsyncStorage.getItem('Projects');
    if (projects !== null) {
      projects = JSON.parse(projects);
      for (var i=0; i<projects.length; i++) {
        if (projects[i].id == this.state.projectID) {
          await this.setState({projectInfo: projects[i]});
          break;
        }
      }
    }
  }};

  fetchTasks = async () => {
    taskList = [];
    let tasks = await AsyncStorage.getItem('Tasks');
    if (tasks !== null) {
      tasks = JSON.parse(tasks);
      for (var i=0; i<this.state.projectInfo.tasksIds.length; i++) {
        for (var j=0; j<tasks.length; j++) {
          if (tasks[j].id == this.state.projectInfo.tasksIds[i]) {
            taskList.push(tasks[j]);
          }
        }
      }
    }
    await this.setState({tasksInfo: taskList});
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#F7F7F7" }}>
        <ScrollView>
          <View style={{marginTop:45}}>
            <InfoSummary />
          </View>
          <View style={{marginTop:30}}>
            <TableTitle text="Work" />
            <WorkSummary />
          </View>
          <View style={{marginTop:45}}>
            <HorizontalLine />
            <ToggleRowItem left="Include task details" />
            <HorizontalLine />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const InfoSummary = (props) => {
  return (
    <TableView items={[
      { type: InfoRowItem, left: "Project name", right: "-"},
      { type: InfoRowItem, left: "Start date", right: "-"},
      { type: InfoRowItem, left: "End date", right: "-"},
      { type: InfoRowItem, left: "Deadline", right: "-"},
      { type: InfoRowItem, left: "Payholder", right: "-"},
    ]}/>
  )
}

const WorkSummary = (props) => {
  return (
    <TableView items={[
      { type: InfoRowItem, left: "Total work time", right:"-"},
      { type: InfoRowItem, left: "Hourly wage", right:"-"},
      { type: InfoRowItem, left: "Total value", right:"-"},
    ]}/>
  )
}
