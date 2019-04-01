import React, {Component} from 'react';
import { View, SafeAreaView, Text, ScrollView, AsyncStorage, Alert } from 'react-native';
import { InfoRowItem } from '../components/tableView/infoRowItem';
import { TableView } from '../components/tableView/tableView';
import { TableTitle } from '../components/tableView/tableView';
import { ToggleRowItem } from '../components/tableView/toggleRowItem';
import { HorizontalLine } from '../components/tableView/tableView';
import { RoundedButton } from '../components/roundedButton';
import { LoadingScreen } from '../views/loading';
import { Style } from '../style';
import { isDemo } from './init';
import { fetchProjectData } from '../config/dataFetch';
import { getTaskState, getPreciseDateLabel, getTimeLeftLabel, getCurrencyLabel, getValueOfTimeLabel, getTimeLabel, getWidgetTimeLabel } from '../config/formatData';

export class ProjectSummaryScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Project summary',
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

  async updateProject(key: StateKeys, value) {
    await this.setState((prevState) => ({
      projectInfo: { ...prevState.projectInfo, [key]: value}
    }));
    this.setNavigationParamters();
  }

  fetchData = async () => { {
    if (!isDemo) {
      fetchProjectData(this.state.projectID, async (resp) => {
          await this.setState({projectInfo: resp});
          this.setState({isLoaded: true});
      });
    }
    else {
      this.setState({isLoaded: true});
    }
  } };

  render() {
    if (!this.state.isLoaded) {
      return (
        <LoadingScreen />
      );
    }
    else {
      return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Style.colors.settingsBackground}}>
          <ScrollView>
            <View style={{marginTop:45}}>
              <InfoSummary project={this.state.projectInfo} />
            </View>
            <View style={{marginTop:30}}>
              <TableTitle text="Work" />
              <WorkSummary project={this.state.projectInfo} />
            </View>
            <View style={{flex:1, alignItems: "center", marginTop: 45}}>
              <RoundedButton
                rectStyle={{
                  borderWidth: 1,
                  width: 215,
                  height: 42,
                  backgroundColor: "transparent",
                  borderColor: Style.colors.positive,
                }}
                textStyle={{fontSize: 15, color: Style.colors.positive}}
                text="generate invoice"
                onPress={() => {
                  Alert.alert(
                    `Invoice`,
                    `Your invoice has been generated and sent to your email address`,
                    [ {text: `OK`, onPress: () => 0} ]
                  );
                }}
               />
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}

const InfoSummary = (props) => {
  return (
    <TableView items={[
      { type: InfoRowItem, left: "Project name", right: props.project.name},
      { type: InfoRowItem, left: "Start date", right: getPreciseDateLabel(props.project.createdAt)},
      { type: InfoRowItem, left: "Deadline", right: getPreciseDateLabel(props.project.deadline)},
      { type: InfoRowItem, left: "Payholder", right: props.project.for},
    ]}/>
  )
}

const WorkSummary = (props) => {
  return (
    <TableView items={[
      { type: InfoRowItem, left: "Total work time", right: getWidgetTimeLabel(props.project.timeSpent)},
      { type: InfoRowItem, left: "Hourly wage", right: getCurrencyLabel(props.project.pricePerHour, "PLN")},
      { type: InfoRowItem, left: "Total value", right: getValueOfTimeLabel(props.project.timeSpent,props.project.pricePerHour)},
    ]}/>
  )
}
