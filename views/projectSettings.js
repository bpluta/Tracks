import React, {Component} from 'react';
import { View, SafeAreaView, Text, ScrollView, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { TableView } from '../components/tableView/tableView';
import { Save } from '../icons/navigationIcons';
import { InputRowItem } from '../components/tableView/inputRowItem';
import { TouchableInfoRowItem } from '../components/tableView/touchableInfoRowItem';
import { DescriptionInputBox } from '../components/tableView/descriptionInputBox';
import { Overlay } from 'react-native-elements';
import { PickerWidget } from '../components/pickerWidget';
import { RoundedButton } from '../components/roundedButton';
import { LoadingScreen } from './loading';
import { fetchProjectData, addProject, deleteProject, updateProject } from '../config/dataFetch';
import { isDemo } from './init';
import { getUserData, getRecentWorkTime, getProjectList } from '../demo/dataGateway.js';
import { verifyHourlywage, getPreciseDateLabel, convertDate } from '../config/formatData';

import { Style } from '../style';

function isProjectDataCorrect(data) {
  isCorrect = true;
  if (data.name=="") {
    alert("Project name missing","Please fill the project name");
    isCorrect = false;
  }
  if (data.pricePerHour=="" || parseFloat(data.pricePerHour)<=0) {
    alert("Hourly wage missing","Please fill the project houly wage. It must be positive number.");
    isCorrect = false;
  }
  return isCorrect;
}

export class ProjectSettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      projectID: this.props.navigation.state.params.projectID,
      projectInfo: null,
    }
    // this.fetchData();
  }

  static navigationOptions = ({ navigation }) => {
   return {
      headerTitle: 'Project settings',
      headerRight:
        <TouchableOpacity onPress={
            () => {
              projectData = navigation.getParam('projectData','');
              if (isProjectDataCorrect(projectData)) {

                updateProject(projectData,projectData.id, () => {
                  Alert.alert(
                    `Project updated!`,
                    `Your project ${projectData.name} has been updated`,
                    [ {text: `OK`, onPress: () => navigation.navigate('Project', { projectID: projectData.id, refreshNeeded: true})}]
                  )
                });
                };
              }
            }>
          <Save />
        </TouchableOpacity>,
      headerTintColor: Style.colors.primary,
   };
 };

 setNavigationParamters() {
   this.props.navigation.setParams({
     projectData: this.state.projectInfo,
  });
 }

 componentDidMount() {
   this.fetchData()
 }

 fetchData = async () => { {
   if (!isDemo) {
     fetchProjectData(this.state.projectID, async (resp) => {
         await this.setState({projectInfo: resp});
         await this.setHourlyWage(String(resp.pricePerHour));
         await this.setState((prevState) => ({
           taskInfo: { ...prevState.projectInfo, "deadline": convertDate(this.state.projectInfo.deadline)}
         }));
         await this.setState((prevState) => ({
           taskInfo: { ...prevState.projectInfo, "createdAt": convertDate(this.state.projectInfo.createdAt)}
         }));
         this.setState({isLoaded: true});
         this.setNavigationParamters();
     });
   }
   else {
     await this.setState({projectInfo: getProject(this.state.projectID)})
     await this.setHourlyWage(String(resp.pricePerHour));
     await this.setState((prevState) => ({
       taskInfo: { ...prevState.projectInfo, "deadline": convertDate(this.state.projectInfo.deadline)}
     }));
     await this.setState((prevState) => ({
       taskInfo: { ...prevState.projectInfo, "createdAt": convertDate(this.state.projectInfo.createdAt)}
     }));
     this.setState({isLoaded: true});
     this.setNavigationParamters();
   }
 } };

 setHourlyWage(hourlyWageValue) {
   verifyHourlywage(hourlyWageValue,(wage) => this.updateProject('pricePerHour',wage));
 }

 setName = (nazwa) => {
   this.updateProject('name',nazwa);
 }

 setStartDate(date) {
   this.updateProject('createdAt',date);
 }

 setDeadline(date) {
   this.updateProject('deadline',date);
 }

 setDecription(text) {
   this.updateProject('description',text);
 }

 setPayholder(text) {
   this.updateProject('for',text);
 }

 projectDeleteInvoke() {
   Alert.alert(
     `Deleting project`,
     `Are you sure you want delete this project? This opperation is irreversible`,
     [ {text: `Yes`, onPress: () => {
       deleteProject(this.state.projectInfo.id,() => 0)
       this.props.navigation.navigate('Projects',{refreshNeeded: true})
     }},
     {text: `Cancel`, onPress: () => 0}]
   );
 }

 async updateProject(key: StateKeys, value) {
   await this.setState((prevState) => ({
     projectInfo: { ...prevState.projectInfo, [key]: value}
   }));
   this.setNavigationParamters();
 }

 render() {
   if (!this.state.isLoaded) {
     return (
       <LoadingScreen />
     );
   }
   else {
     project = this.state.projectInfo;
     return (
         <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Style.colors.settingsBackground }}>
           <ScrollView automaticallyAdjustContentInsets={false}>
             <View style={{marginTop: 20}}>
               <TableView items={[
                 {type: InputRowItem, left: "Project name", right: project.name, rightItemStyle: {width: "70%"}, onChangeText: ((name) => { this.setName(name) })},
                 {type: TouchableInfoRowItem, left: "Start date", right: getPreciseDateLabel(project.createdAt), rightLabelStyle: {color: "#000000"}, onPress: (() => this.setState({isStartDatePickerVisible: true}))},
                 {type: TouchableInfoRowItem, left: "Deadline", right: getPreciseDateLabel(project.deadline), rightLabelStyle: {color: "#000000"}, onPress: (() => this.setState({isDeadlinePickerVisible: true}))},
                 {type: InputRowItem, left: "Hourly wage", right: project.pricePerHour, onChangeText: ((hourlyWageValue) => this.setHourlyWage(hourlyWageValue)), keyboardType: "decimal-pad"},
                 {type: InputRowItem, left: "Payholder name", right: project['for'], rightItemStyle: {width: "60%"}, onChangeText: ((name) => { this.setPayholder(name) })},
               ]}/>
             </View>
             <View style={{marginTop: 45}}>
               <DescriptionInputBox
                 title="Project description"
                 onChangeText={(text) => this.setDecription(text)}
                 value={project.description}
                />
             </View>
             <View style={{flex:1, alignItems: "center", marginTop: 45}}>
               <RoundedButton
                 rectStyle={{
                   borderWidth: 1,
                   width: 215,
                   height: 42,
                   backgroundColor: "transparent",
                   borderColor: Style.colors.negative,
                 }}
                 textStyle={{fontSize: 15, color: Style.colors.negative}}
                 text="delete project"
                 onPress={() => this.projectDeleteInvoke()}
                />
             </View>
           </ScrollView>
           <PickerOverlay
             title="Start date"
             isVisible={this.state.isStartDatePickerVisible}
             date={new Date(project.createdAt)}
             onDateChange={(date) => this.setStartDate(date)}
             buttonOnPress={() => { this.setState({isStartDatePickerVisible: false})}}
           />
           <PickerOverlay
             title="Deadline"
             isVisible={this.state.isDeadlinePickerVisible}
             date={new Date(project.deadline)}
             onDateChange={(date) => this.setDeadline(date)}
             buttonOnPress={() => { this.setState({isDeadlinePickerVisible: false})}}
           />
         </SafeAreaView>
       );
   }
 }
}

const PickerOverlay = (props) => {
  return (
    <Overlay
      isVisible={props.isVisible}
      overlayBackgroundColor="transparent"
      width="auto"
      height="auto"
      onBackdropPress={props.buttonOnPress} >
      <PickerWidget
        type="date"
        title={props.title}
        date={props.date}
        buttonOnPress={props.buttonOnPress}
        onDateChange={props.onDateChange}
        maximumDate={props.maximumDate}
      />
    </Overlay>
  )
}
