import React, {Component} from 'react';
import { View, SafeAreaView, Text, ScrollView, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { TableView } from '../components/tableView/tableView';
import { Save } from '../icons/navigationIcons';
import { InputRowItem } from '../components/tableView/inputRowItem';
import { TouchableInfoRowItem } from '../components/tableView/touchableInfoRowItem';
import { DescriptionInputBox } from '../components/tableView/descriptionInputBox';
import { Overlay } from 'react-native-elements';
import { PickerWidget } from '../components/pickerWidget';
import { LoadingScreen } from './loading';
import { fetchUserData, addProject } from '../config/dataFetch';
import { isDemo } from './init';
import { verifyHourlywage, getPreciseDateLabel } from '../config/formatData';

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

export class NewProjectScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStartDatePickerVisible: false,
      isDeadlinePickerVisible: false,
      isLoaded: false,
      userID: "",
      project: {
        name: "",
        start: new Date(),
        deadline: new Date(),
        pricePerHour: "30",
        description: "",
        ['for']: "",
      }
    }
    this.fetchData();

  }

  static navigationOptions = ({ navigation }) => {
   return {
      headerTitle: 'New project',
      headerRight:
        <TouchableOpacity onPress={
            () => {
              projectData = navigation.getParam('newProject','');
              if (isProjectDataCorrect(projectData)) {
                addProject(projectData,(resp) => {
                  Alert.alert(
                    `Project added!`,
                    `Your project ${projectData.name} has been added`,
                    [ {text: `OK`, onPress:
                      () => navigation.navigate('Projects',{refreshNeeded: true})
                    },]
                  );
                });
              }
            }
            }>
          <Save />
        </TouchableOpacity>,
      headerTintColor: Style.colors.primary,
   };
 };

 setNavigationParamters() {
   this.props.navigation.setParams({
     newProject: this.state.project,
  });
 }

 fetchData = async () => { {
   await this.getUserID();
   if (!isDemo) {
     fetchUserData(async (resp) => {
       await this.updateProject('pricePerHour', resp.defaultPricePerHour.toString());
       this.setState({isLoaded: true});
       this.setNavigationParamters();
       });
   }
   else {
     this.setState({isLoaded: true});
   }
 } };

 getUserID = async () => {
   const value = await AsyncStorage.getItem('User');
   if (value !== null) {
     await this.setState({userID: JSON.parse(value).id});
     await this.updateProject('pricePerHour', JSON.parse(value).defaultWage);
   }
 }

 setHourlyWage(hourlyWageValue) {
   verifyHourlywage(hourlyWageValue,(wage) => this.updateProject('pricePerHour',wage));
 }

 setName = (nazwa) => {
   this.updateProject('name',nazwa);
 }

 setStartDate(date) {
   this.updateProject('start',date);
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

 updateProject(key: StateKeys, value) {
   this.setState((prevState) => ({
     project: { ...prevState.project, [key]: value}
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
     project = this.state.project;
     return (
         <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Style.colors.settingsBackground }}>
           <ScrollView automaticallyAdjustContentInsets={false}>
             <View style={{marginTop: 20}}>
               <TableView items={[
                 {type: InputRowItem, left: "Project name", right: project.name, onChangeText: ((name) => { this.setName(name) })},
                 {type: TouchableInfoRowItem, left: "Start date", right: getPreciseDateLabel(project.start), rightLabelStyle: {color: "#000000"}, onPress: (() => this.setState({isStartDatePickerVisible: true}))},
                 {type: TouchableInfoRowItem, left: "Deadline", right: getPreciseDateLabel(project.deadline), rightLabelStyle: {color: "#000000"}, onPress: (() => this.setState({isDeadlinePickerVisible: true}))},
                 {type: InputRowItem, left: "Hourly wage", right: project.pricePerHour, onChangeText: ((hourlyWageValue) => this.setHourlyWage(hourlyWageValue)), keyboardType: "decimal-pad"},
                 {type: InputRowItem, left: "Payholder name", right: project['for'], onChangeText: ((name) => { this.setPayholder(name) })},
               ]}/>
             </View>
             <View style={{marginTop: 45}}>
               <DescriptionInputBox
                 title="Project description"
                 onChangeText={(text) => this.setDecription(text)}
                 value={project.description}
                />
             </View>
           </ScrollView>
           <PickerOverlay
             title="Start date"
             isVisible={this.state.isStartDatePickerVisible}
             date={project.start}
             maximumDate={project.deadline}
             onDateChange={(date) => this.setStartDate(date)}
             buttonOnPress={() => { this.setState({isStartDatePickerVisible: false})}}
           />
           <PickerOverlay
             title="Deadline"
             isVisible={this.state.isDeadlinePickerVisible}
             date={project.deadline}
             minimumDate={project.start}
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
