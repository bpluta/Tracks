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
import { fetchTaskData, updateTask, deleteTask } from '../config/dataFetch';
import { isDemo } from './init';
import { verifyHourlywage, getPreciseDateLabel, stringToDate, convertDate } from '../config/formatData';

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

export class TaskSettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      taskID: this.props.navigation.state.params.taskID,
      taskInfo: null,
    }
    this.fetchData();
  }

  static navigationOptions = ({ navigation }) => {
   return {
      headerTitle: 'Task settings',
      headerRight:
        <TouchableOpacity onPress={
            () => {
              taskData = navigation.getParam('taskData','');
              if (isTaskDataCorrect(taskData)) {
                updateTask(taskData,taskData.id, () => {
                  Alert.alert(
                    `Task updated!`,
                    `Your task ${taskData.name} has been updated`,
                    [ {text: `OK`, onPress: () => navigation.navigate('Task', { taskID: taskData.id, refreshNeeded: true})}]
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
     taskData: this.state.taskInfo,
  });
 }

 fetchData = async () => { {
   if (!isDemo) {
     fetchTaskData(this.state.taskID, async (resp) => {
         await this.setState({taskInfo: resp});
         await this.setHourlyWage(String(resp.pricePerHour));
         await this.setState((prevState) => ({
           taskInfo: { ...prevState.taskInfo, "deadline": convertDate(this.state.taskInfo.deadline)}
         }));
         await this.setState((prevState) => ({
           taskInfo: { ...prevState.taskInfo, "createdAt": convertDate(this.state.taskInfo.createdAt)}
         }));
         this.setState({isLoaded: true});
         this.setNavigationParamters();
     });
   }
   else {
     this.setState({isLoaded: true});
   }
 } };

 setHourlyWage(hourlyWageValue) {
   verifyHourlywage(hourlyWageValue,(wage) => this.updateTask('pricePerHour',wage));
 }

 setName = (nazwa) => {
   this.updateTask('name',nazwa);
 }

 setStartDate(date) {
   this.updateTask('createdAt',date);
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

 taskDeleteInvoke() {
   Alert.alert(
     `Deleting task`,
     `Are you sure you want delete this task? This opperation is irreversible`,
     [ {text: `Yes`, onPress: () => {
       deleteTask(this.state.taskInfo.id,() => 0)
       this.props.navigation.navigate('Project',{projectID: this.state.taskInfo.projectID, refreshNeeded: true})
     }},
     {text: `Cancel`, onPress: () => 0}]
   );
 }

 async updateTask(key: StateKeys, value) {
   await this.setState((prevState) => ({
     taskInfo: { ...prevState.taskInfo, [key]: value}
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
     task = this.state.taskInfo;
     return (
         <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Style.colors.settingsBackground }}>
           <ScrollView automaticallyAdjustContentInsets={false}>
             <View style={{marginTop: 20}}>
               <TableView items={[
                 {type: InputRowItem, left: "Task name", right: task.name, rightItemStyle: {width: "70%"}, onChangeText: ((name) => { this.setName(name) })},
                 {type: TouchableInfoRowItem, left: "Start date", right: getPreciseDateLabel(task.createdAt), rightLabelStyle: {color: "#000000"}, onPress: (() => this.setState({isStartDatePickerVisible: true}))},
                 {type: TouchableInfoRowItem, left: "Deadline", right: getPreciseDateLabel(task.deadline), rightLabelStyle: {color: "#000000"}, onPress: (() => this.setState({isDeadlinePickerVisible: true}))},
                 {type: InputRowItem, left: "Hourly wage", right: task.pricePerHour, onChangeText: ((hourlyWageValue) => this.setHourlyWage(hourlyWageValue)), keyboardType: "decimal-pad"},
                 {type: InputRowItem, left: "Payholder name", right: task['for'], rightItemStyle: {width: "60%"}, onChangeText: ((name) => { this.setPayholder(name) })},
               ]}/>
             </View>
             <View style={{marginTop: 45}}>
               <DescriptionInputBox
                 title="Task description"
                 onChangeText={(text) => this.setDecription(text)}
                 value={task.description}
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
                 text="delete task"
                 onPress={() => this.taskDeleteInvoke()}
                />
             </View>
           </ScrollView>
           <PickerOverlay
             title="Start date"
             isVisible={this.state.isStartDatePickerVisible}
             date={new Date(task.createdAt)}
             onDateChange={(date) => this.setStartDate(date)}
             buttonOnPress={() => { this.setState({isStartDatePickerVisible: false})}}
           />
           <PickerOverlay
             title="Deadline"
             isVisible={this.state.isDeadlinePickerVisible}
             date={new Date(task.deadline)}
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
