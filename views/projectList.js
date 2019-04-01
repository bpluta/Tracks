import React, {Component} from 'react';
import { View, SafeAreaView, ScrollView, Text, ActivityIndicator, AsyncStorage, TouchableOpacity, RefreshControl } from 'react-native';
import { RoundedButton } from '../components/roundedButton';
import { Data } from '../data';
import { ProjectWidget } from '../components/projectWidget';
import { LoadingScreen } from '../views/loading';
import { LargeLabel } from '../components/largeLabel';
import { Plus, Gear } from '../icons/navigationIcons';
import { EmptyScreen } from './empty';
import { isDemo } from './init';
import { Style } from '../style';
import { getUserData, getRecentWorkTime, getProjectList } from '../demo/dataGateway.js';
import { stringToDate, getTimeLabel } from '../config/formatData';
import { fetchUserData, fetchProjectData } from '../config/dataFetch';

export class ProjectListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
   return {
     headerLeft:
       <TouchableOpacity onPress={() => navigation.navigate('NewProject')}>
         <Plus />
       </TouchableOpacity>,
     headerRight:
       <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
         <Gear />
       </TouchableOpacity>
   };
 };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      projects: null,
      refreshing: false,
    }
    // this.fetchData();
  }

  navigateTo = (destination) => {
    this.props.navigation.navigate(destination);
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params.refreshNeeded) {
      this.fetchData();
    }
  }
  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => { {
    if (!isDemo) {
      fetchUserData(async (resp) => {
          await this.setState({projects: resp.projects});
          if (this.state.projects) {
            this.setState({isLoaded: true});
          }
          this.setState({refreshing: false})
      });
    }
    else {
      await this.setState({projects: getProjectList()})
      this.setState({isLoaded: true});
      this.setState({refreshing: false})
    }
  }};

  getFadedState(state) {
    if (state === "closed") {
      return true
    }
    else {
      return false
    }
  }

  getProjectState(data) {
    if (data.hasOwnProperty('deadline')) {
      let timeDifference = stringToDate(data.deadline)-new Date()
      if (timeDifference < 0) {
        return "overdue"
      }
      else {
        return `${getTimeLabel(timeDifference)}`
      }
    }
    else if (data.hasOwnProperty('state')) {
      return data.state
    }
    else {
      return "open"
    }
  }

  projectList() {
    return this.state.projects.map((data,index) => {
      return (
        <View key={index} style={{padding: 10}}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('Project', { projectID: data.id });
          }}>
          <ProjectWidget
            title={data.name}
            leftLabel={`${data.tasks.length} tasks`}
            rightLabel={this.getProjectState(data)}
            faded={this.getFadedState(data.state)}
          />
        </TouchableOpacity>
        </View>
      )
    })
}

  render() {
    if (!this.state.isLoaded) {
      return (
        <LoadingScreen />
      );
    }
    else {
      if (this.state.projects.length === 0) {
        return (
          <EmptyScreen
            title="No projects found"
            description="In order to start your work please add a new project"
            buttonText="new project"
            buttonOnPress={()=>this.props.navigation.navigate('NewProject')}
          />
        )
      }
      else {
        return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ScrollView refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }>
            <LargeLabel style={{marginTop: 10, marginLeft: 20}} text="My Projects"/>
            {this.projectList()}
          </ScrollView>
        </SafeAreaView>
      );
      }
    }
  }
}
