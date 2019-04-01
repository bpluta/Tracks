import React from 'react';
import { Text, View,TextInput } from 'react-native';
import { ClockIcon } from '../icons/clock';
import { RoundedRect } from '../components/roundedRect';
import { RoundedInput } from '../components/roundedInput';
import { RoundedButton } from '../components/roundedButton';
import { InfoRowItem } from '../components/tableView/infoRowItem';
import { TableView } from '../components/tableView/tableView';
import { RowItem } from '../components/tableView/rowItem';
import { ToggleRowItem } from '../components/tableView/toggleRowItem';
import { MoreInfoRowItem } from '../components/tableView/moreInfoRowItem';

export class HomeScreen extends React.Component {
  state = {
    emailInput: "",
    emailSelect: {},
    emailDefaultValue: 'email',
    passwordInput: "",
    passwordSelect: {},
    passwordDefaultValue: 'password',
    toggleValue: true,
  };

  render() {
    const { emailInput, emailSelect, emailDefaultValue, passwordInput, passwordSelect, passwordDefaultValue, toggleValue} = this.state;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{padding: 8}}>
          <RoundedInput
            placeholder={emailDefaultValue}

            onChange={emailInput => this.setState({ emailInput })}
          />
        </View>
        <View style={{padding: 8}}>
          <RoundedInput
            placeholder={passwordDefaultValue}
            onChange={passwordInput => this.setState({ passwordInput })}
            secureTextEntry={true}
          />
        </View>
        <View style={{padding: 8}}>
          <RoundedButton
            text="login"
            onPress={() => 0}
            rectStyle={{
              width: 240,
              height: 40,
              backgroundColor: "#257EB7",
            }}
            textStyle={{
              color: "white",
              fontSize: 16,
            }}
            />
        </View>

        <View>
        <TableView items={[
          {type: InfoRowItem, left: "Nazwa projektu", right: "Projekt UI"},
          {type: InfoRowItem, left: "Data rozpoczęcia", right: "22 października 2018"}
        ]}/>
    </View>
      <View style={{marginTop: 44}}>
        <TableView items={[
            {left: "Hello world", value: {toggleValue}, onValueChange: (toggleValue) => {return this.setState({ toggleValue })}, type: ToggleRowItem}
        ]}/>
      </View>
      <View style={{marginTop: 44}}>
        <TableView items={[
            {type: MoreInfoRowItem, main: "Projekt UI", second: "w trakcie realizacji", rightItem: <TimeWidget text="1 dzień" />, onPress: ()=>(0) },
            {type: MoreInfoRowItem, main: "Backend", second: "Zaplanowane", rightItem: <TimeWidget text="30 dni" />, onPress: ()=>(0) },
            {type: MoreInfoRowItem, main: "Frontend", second: "Zaplanowane", rightItem: <TimeWidget text="40 dni" />, onPress: ()=>(0) },
            {type: MoreInfoRowItem, main: "Dokumentacja", second: "Zaplanowane", rightItem: <TimeWidget text="50 dni" />, onPress: ()=>(0) }
          ]} innerSeparatorWidth="90%"
        />
      </View>

      </View>
    );
  }
}

const TimeWidget = ({text}) => (
  <RoundedRect
    rectStyle={{
      backgroundColor: "#94C470",
      width: 80,
      height: 35,
    }}
    textStyle={{
      fontWeight: "bold",
      fontSize: 16,
      color: "white",
    }}
    text={text}
  />
)
