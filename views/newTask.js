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
import { fetchUserData, addTask } from '../config/dataFetch';
import { isDemo } from './init';
import { verifyHourlywage, getPreciseDateLabel } from '../config/formatData';

import { Style } from '../style';

function isTaskDataCorrect(data) {
  isCorrect = true;
  if (data.name=="") {
    Alert.alert("Task name missing","Please fill the task name");
    isCorrect = false;
  }
  if (data.pricePerHour=="" || parseFloat(data.pricePerHour)<=0) {
    Alert.alert("Hourly wage missing","Please fill the task houly wage. It must be positive number.");
    isCorrect = false;
  }
  return isCorrect;
}

export class NewTaskScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStartDatePickerVisible: false,
      isDeadlinePickerVisible: false,
      isLoaded: false,
      userID: "",
      task: {
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
      headerTitle: 'New task',
      headerRight:
        <TouchableOpacity onPress={
            () => {
              taskData = navigation.getParam('newTask','');
              if (isTaskDataCorrect(taskData)) {
                data = {
                  name: taskData.name,
                  description: taskData.description,
                  deadline: taskData.deadline,
                  projectId: taskData.projectID.toString(),
                  pricePerHour: taskData.pricePerHour,
                  for: taskData['for'],
                };
                addTask(data,() => 0);
                Alert.alert(
                  `Task added!`,
                  `Your task ${taskData.name} has been added`,
                  [ {text: `OK`, onPress: () => navigation.navigate('Project',{projectID: taskData.projectID, refreshNeeded: true})},]
                );
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
     newTask: this.state.task,
  });
 }

 fetchData = async () => { {
   await this.getUserID();
   if (!isDemo) {
     fetchUserData(async (resp) => {
       await this.updateTask('pricePerHour', resp.defaultPricePerHour.toString());
       await this.updateTask('projectID', this.props.navigation.state.params.projectID);
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
     await this.updateTask('pricePerHour', JSON.parse(value).defaultWage);
   }
 }

 setHourlyWage(hourlyWageValue) {
   verifyHourlywage(hourlyWageValue,(wage) => this.updateTask('pricePerHour',wage));
 }

 setName = (nazwa) => {
   this.updateTask('name',nazwa);
 }

 setStartDate(date) {
   this.updateTask('start',date);
 }

 setDeadline(date) {
   this.updateTask('deadline',date);
 }

 setDecription(text) {
   this.updateTask('description',text);
 }

 setPayholder(text) {
   this.updateTask('for',text);
 }

 updateTask(key: StateKeys, value) {
   this.setState((prevState) => ({
     task: { ...prevState.task, [key]: value}
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
     task = this.state.task;
     return (
         <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Style.colors.settingsBackground }}>
           <ScrollView automaticallyAdjustContentInsets={false}>
             <View style={{marginTop: 20}}>
               <TableView items={[
                 {type: InputRowItem, left: "Task name", right: task.name, onChangeText: ((name) => { this.setName(name) })},
                 {type: TouchableInfoRowItem, left: "Start date", right: getPreciseDateLabel(task.start), rightLabelStyle: {color: "#000000"}, onPress: (() => this.setState({isStartDatePickerVisible: true}))},
                 {type: TouchableInfoRowItem, left: "Deadline", right: getPreciseDateLabel(task.deadline), rightLabelStyle: {color: "#000000"}, onPress: (() => this.setState({isDeadlinePickerVisible: true}))},
                 {type: InputRowItem, left: "Hourly wage", right: task.pricePerHour, onChangeText: ((hourlyWageValue) => this.setHourlyWage(hourlyWageValue)), keyboardType: "decimal-pad"},
                 {type: InputRowItem, left: "Payholder name", right: task['for'], onChangeText: ((name) => { this.setPayholder(name) })},
               ]}/>
             </View>
             <View style={{marginTop: 45}}>
               <DescriptionInputBox
                 title="Task description"
                 onChangeText={(text) => this.setDecription(text)}
                 value={task.description}
                />
             </View>
           </ScrollView>
           <PickerOverlay
             title="Start date"
             isVisible={this.state.isStartDatePickerVisible}
             date={task.start}
             maximumDate={task.deadline}
             onDateChange={(date) => this.setStartDate(date)}
             buttonOnPress={() => { this.setState({isStartDatePickerVisible: false})}}
           />
           <PickerOverlay
             title="Deadline"
             isVisible={this.state.isDeadlinePickerVisible}
             date={task.deadline}
             minimumDate={task.start}
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
