import React from 'react';
import { ScrollView , Text, SafeAreaView, View, Picker, AsyncStorage, Keyboard, TouchableOpacity, Alert } from 'react-native';
import { NavigationEvents } from "react-navigation";
import { LoadingScreen } from './loading';
import { NavigationActions, StackActions } from 'react-navigation';
import { RoundedButton } from '../components/roundedButton';
import { InputRowItem } from '../components/tableView/inputRowItem';
import { TableView } from '../components/tableView/tableView';
import { InfoRowItem } from '../components/tableView/infoRowItem';
import { TableTitle } from '../components/tableView/tableView';
import { TouchableInfoRowItem } from '../components/tableView/touchableInfoRowItem';
import { PickerWidget } from '../components/pickerWidget';
import { Save } from '../icons/navigationIcons';
import { Overlay } from 'react-native-elements';
import { fetchUserData, updateUser } from '../config/dataFetch';
import { isDemo } from './init';
import { verifyHourlywage, verifyPhoneNumber, workingHoursLabel, workingDaysLabel } from '../config/formatData';
import { Style } from '../style';

export class SettingsScreen extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,

      workingDays: this.getArrayOfIntegerSequence(7),
      isWorkingDaysOverlayVisible: false,

      workingHours: this.getArrayOfIntegerSequence(24),
      isWorkingHoursOverLayVisible: false,
    }
    this.fetchData();
  }

  static navigationOptions = ({ navigation }) => {
   return {
     headerRight:
       <TouchableOpacity onPress={() => {
         userData = navigation.getParam('updatedUser','');
           userData.email = ""
           updateUser(userData,userData.id,(resp) => 0);
           Alert.alert(
             `Settings updated!`,
             `Your settings have been updated`,
             [ {text: `OK`, onPress:
               () => {
                 navigation.goBack()
               }
             }])

       }}>
         <Save />
       </TouchableOpacity>,
     headerTintColor: Style.colors.primary,
   };
  };

  setNavigationParamters() {
    this.props.navigation.setParams({
      updatedUser: this.state.user,
   });
  }

  fetchData = async () => { {
    if (!isDemo) {
      fetchUserData(async (resp) => {
        await this.setState({user: resp});
        this.setHourlywage(this.state.user.defaultPricePerHour)
        this.setNavigationParamters()
        this.setState({isLoaded: true});
      });
    }
    else {
      var value = await AsyncStorage.getItem('User');
      if (value !== null) {
        value = await JSON.parse(value);
        await this.setState({user: value});
        this.setDefaults();
        this.setState({isLoaded: true});
      }
    }
  }};

  saveData = async () => {{
      updateUser(this.state.user, this.state.user.id)
    }
  }

  logout = () => {
    Alert.alert(
      `Logging out`,
      `Are you sure you want to log out?`,
      [ {text: `Yes`, onPress: () => {
        AsyncStorage.setItem('IsLogged', "false")
        this.props.navigation.navigate('Login');
      }},
      {text: `Cancel`, onPress: () => 0}]
    );
  }

  getArrayOfIntegerSequence(upto) {
    var arr=[];
    for (var i=1; i<=upto; i++) {
      arr.push({label: i.toString(), value: i.toString()});
    }
    return arr;
  }

  setHourlywage(hourlyWageValue) {
    verifyHourlywage(hourlyWageValue, (wage) => this.updateUser("defaultPricePerHour",hourlyWageValue.toString()));
  }

  setPhoneNumber(phoneNumber) {
    verifyPhoneNumber(phoneNumber, (phone) => this.updateUser("phone",phone));
  }

  async updateUser(key: StateKeys, value) {
    await this.setState((prevState) => ({
      user: { ...prevState.user, [key]: value}
    }),() => this.setNavigationParamters());

  }

  updateOverlayVisibility(overlayKey: StateKeys, overlayValue) {
    this.setState({[overlayKey]: overlayValue});
  }

  resetStack(payload) {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        key: String(payload.action.routeName),
        actions: [
          NavigationActions.navigate({
            routeName: payload.action.routeName,
          })
        ]
    }));
  };

  render() {
    var user = this.state.user;
    var workingDays = {
      isVisible: this.state.isWorkingDaysOverlayVisible,
      data: this.state.workingDays,
    }
    var workingHours = {
      isVisible: this.state.isWorkingHoursOverLayVisible,
      data: this.state.workingHours,
    }

    if (!this.state.isLoaded) {
      return (
        <LoadingScreen />
      );
    }
    else {
      return (
          <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Style.colors.settingsBackground }}>
            <NavigationEvents
              onWillFocus={payload => {
                this.resetStack(payload);
              }}
              onWillBlur={() => {
              }}
            />

            <ScrollView automaticallyAdjustContentInsets={false}>
              <View style={{marginTop: 20}}>
                <TableView items={[
                  {type: InputRowItem, left: "First name", right: user.name, rightItemStyle: {width: "70%"}, onChangeText: ((name) => { this.updateUser("name", name) })},
                  {type: InputRowItem, left: "Last Name", right: user.surname, rightItemStyle: {width: "70%"}, onChangeText: ((surname) => { this.updateUser("surname", surname) })},
                ]}/>
              </View>

              <View style={{marginTop: 45}}>
                <TableTitle text="Invoice details" />
                <TableView items={[
                  {type: InputRowItem, left: "Email", right: user.email, rightItemStyle: {width: "80%"}, onChangeText: ((email) => { this.updateUser("email", email) }), keyboardType: "email-address"},
                  {type: InputRowItem, left: "Phone number", right: user.phone, rightItemStyle: {width: "60%"}, onChangeText: ((phone) => { this.setPhoneNumber(phone) }), keyboardType: "phone-pad"},
                ]}/>
              </View>

              <View style={{marginTop: 45}}>
                <TableTitle text="Defaults" />
                <TableView items={[
                  {type: InputRowItem , left: "Hourly wage", right: user.defaultPricePerHour, onChangeText: ((hourlyWageValue) => this.setHourlywage(hourlyWageValue)), keyboardType: "decimal-pad"},
                  {type: TouchableInfoRowItem, left: "Working days weekly", right: workingDaysLabel(user.workingDays), rightLabelStyle: {color: "#000000"}, onPress: (() => this.setState({isWorkingDaysOverlayVisible: true}))},
                  {type: TouchableInfoRowItem, left: "Working hours daily", right: workingHoursLabel(user.workingHours), rightLabelStyle: {color: "#000000"}, onPress: (() => this.setState({isWorkingHoursOverLayVisible: true}))},
                ]}/>
              </View>
              <View style={{marginTop: 25, marginBottom: 25, justifyContent: 'center', alignItems: 'center'}}>

                <View style={{paddingTop:5, paddingBottom:5}}>
                  <RoundedButton
                    rectStyle={{width: 215, height: 42, borderWidth: 1, borderColor: Style.colors.neutralButton}}
                    textStyle={{fontSize: 15, color: Style.colors.neutralButton}}
                    text="change password"
                    onPress={() => {this.props.navigation.navigate('ChangePassword')}}/>
                </View>
                <View style={{paddingTop:5, paddingBottom:10}}>
                  <RoundedButton
                    rectStyle={{width: 215, height: 42, borderWidth: 1, borderColor: Style.colors.negative}}
                    textStyle={{fontSize: 15, color: Style.colors.negative}}
                    text="log out"
                    onPress={() => this.logout()}/>
                </View>
              </View>
            </ScrollView>

            <PickerOverlay
              title="Working days"
              data={workingDays.data}
              isVisible={workingDays.isVisible}
              selectedValue={user.workingDays}
              onValueChange={(itemValue, itemIndex) => {this.updateUser("workingDays", itemValue)}}
              buttonOnPress={() => {this.updateOverlayVisibility("isWorkingDaysOverlayVisible", false)}}
            />
            <PickerOverlay
              title="Working hours"
              data={workingHours.data}
              isVisible={workingHours.isVisible}
              selectedValue={user.workingHours}
              onValueChange={(itemValue, itemIndex) => {this.updateUser("workingHours", itemValue)}}
              buttonOnPress={() => {this.updateOverlayVisibility("isWorkingHoursOverLayVisible", false)}}
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
        title={props.title}
        items={props.data}
        selectedValue={props.selectedValue}
        onValueChange={props.onValueChange}
        buttonOnPress={props.buttonOnPress}
      />
    </Overlay>
  )
}

const ArrowRight = () => <Icon name="ios-arrow-forward" size={22} />;
const RightButton = () => (
  <Button onPress={() => alert('Hello world!')}>
    <ArrowRight />
  </Button>
);
