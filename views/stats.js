import React, {Component} from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Dimensions, ScrollView, RefreshControl } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { RoundedButton } from '../components/roundedButton';
import { Gear } from '../icons/navigationIcons';
import { Style } from '../style';
import { VictoryChart, VictoryBar, Bar, VictoryLabel, VictoryAxis, LineSegment } from "victory-native";
import { LoadingScreen } from './loading';
import { fetchRecentWorktime,fetchLatestTask, fetchUserData } from '../config/dataFetch';
import { FrequencyGraph } from '../components/frequencyGraph';
import { LargeLabel } from '../components/largeLabel';
import { isDemo } from './init';
import { getUserData, getRecentWorkTime } from '../demo/dataGateway.js';
import { getWeekDayLabel, getWidgetTimeLabel, getShortDateLabel } from '../config/formatData';

function getPercentOfDailyWorkDone(workTime, dailyTarget) {
  return Math.floor((workTime/(dailyTarget*60*60))*100)
}

export class StatsScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      workTime: [],
      userData: {},
      isLoaded: false,
      refreshing: false,
    }
    // this.fetchData();
  }

  componentDidMount() {
    this.fetchData()
  }
  static navigationOptions = ({ navigation }) => {
   return {
     headerTitle: "Stats",
     headerRight:
       <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
         <Gear />
       </TouchableOpacity>,
      headerTintColor: Style.colors.primary,
   };

 };

 fetchData = async () => {
   if (!isDemo) {
     fetchRecentWorktime(32, async (workTimeResp) => {
       await this.setState({workTime: workTimeResp})
       fetchUserData(async (userResp) => {
          await this.setState({userData: userResp})
       })
     });
   }
   else {
     await this.setState({workTime: getRecentWorkTime(new Date(2019, 0, 20), 34)})
     await this.setState({userData: getUserData()})
     console.log(this.state.workTime)
     this.setState({isLoaded: true})
     this.setState({refreshing: false})
   }
 }

 onRefresh = () => {
   this.setState({refreshing: true});
   this.fetchData();
 }

 getBarChartData = (amount, array, dailyTarget) => {
   var chartData = []
   var date = new Date()

   for (var i=0; i<amount; i++) {
     date = yesterday = new Date(new Date().setDate(new Date().getDate()-i));
     if (i<array.length) {
       chartData.push({
         x: getWeekDayLabel(date.toString()),
         y: getPercentOfDailyWorkDone(array[i].timeSpent,dailyTarget),
       })
     }
     else {
       chartData.push({
         x: "XX",
         y: 0,
       })
     }
   }
   return chartData
 }

 getBarChartLabel = (array) => {
   var labels = []
   for (var i=0; i<array.length; i++) {
     labels.push(array[i].y)
   }
   return labels
 }

 getFrequencyChartData = (amount, array, dailyTarget) => {
   var chartData = []
   for (var i=0; i<amount; i++) {
     if (i<array.length) {
       chartData.push(getPercentOfDailyWorkDone(array[i].timeSpent,dailyTarget))
     }
     else {
       chartData.push(0)
     }
   }
   return chartData
 }

 sumOfWork(amount, workArray) {
   var sum = 0
   for (var i=0; i<amount; i++) {
     if (i<workArray.length) {
       sum += workArray[i].timeSpent
     }
     else { break }
   }
   return sum
 }


  getPercentOfWorkTarget(amount, timeSpent, weeklyTarget) {
    return Math.floor(1000*timeSpent/((weeklyTarget*60*60)*(amount/7)))/10
  }

 navigateTo = (destination) => {
    this.props.navigation.navigate(destination);
  };

  render() {
    let date = new Date()

    if (!this.state.isLoaded) {
      return (<LoadingScreen />)
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

          <View>
            <View style={{marginLeft: 40, marginRight: 40, marginTop: 20}}>
              <View style={{flex:1, flexDirection: "row"}}>
                <View style={{flex:1, alignItems: "flex-start" }}>
                  <View>
                    <Text style={{color: Style.colors.primary, fontSize:30, fontWeight: "800"}}>
                      {this.getPercentOfWorkTarget(7, this.sumOfWork(7,this.state.workTime), this.state.userData.workingDays*this.state.userData.workingHours)+"%"}
                    </Text>
                    <Text style={{color: Style.colors.primaryText, fontSize:14}}>{"of weekly goal"}</Text>
                  </View>
                </View>
                <View style={{flex:1, paddingTop: 5, flexDirection: "column", alignItems:"flex-end"}}>
                  <Text style={{color: Style.colors.primaryText, fontSize:20, fontWeight: "600"}}>{getWidgetTimeLabel(this.sumOfWork(7,this.state.workTime))}</Text>
                  <Text style={{color: Style.colors.primaryText, fontSize:14}}>{`${getShortDateLabel(new Date(new Date().setDate(new Date().getDate()-7)))} - today`}</Text>
                </View>
              </View>
            </View>
          <View>
            <View style={{marginLeft: 0}}>
              <VictoryChart height={250} width={375}
                domainPadding={{ x: 50, y: [0, 10] }}
                scale={{ x: "time" }}
              >
              <VictoryAxis
                gridComponent={<LineSegment type={"grid"}/>}
                axisLabelComponent={<View></View>}
                tickLabelComponent={<View></View>}
                dependentAxis={true}
                style={{
                  axis: {stroke: "#FFFFFF"},
                  axisLabel: {fontSize: 20, padding: 30},
                  grid: {
                    stroke: (t) => t == 100 ? "#CCCCCC" : "transparent",
                  },
                  ticks: {stroke: "white", size: 5},
                  tickLabels: {fontSize: 15, padding: 5}
                }}
              />
              <VictoryAxis
                gridComponent={<LineSegment type={"grid"}/>}
                axisLabelComponent={<View></View>}
                dependentAxis={false}
                style={{
                  axis: {stroke: "#FFFFFF"},
                  axisLabel: {fontSize: 20, padding: 30},
                  tickLabels: {fontSize: 10, fontColor: "grey", grepadding: 5}
                }}
              />
                <VictoryBar
                  barWidth={30}
                  dataComponent={
                    <Bar events={{ onMouseOver: () => 0 }}/>
                  }
                  labels={this.getBarChartLabel(this.getBarChartData(7,this.state.workTime,this.state.userData.workingHours))}
                  labelComponent={<VictoryLabel />}
                  cornerRadius={5}
                  style={{
                    labels: { fill: Style.colors.primary },
                    data: {
                      fill: Style.colors.primary,
                      borderRadius: 5,
                    },
                    grid: {
                      fill: "#000000"
                    }
                  }}
                  data={this.getBarChartData(7,this.state.workTime,this.state.userData.workingHours)}
                />
              </VictoryChart>
            </View>
            <View style={{marginLeft: 40, marginRight: 40, marginBottom: 20}}>
              <View style={{flex:1, flexDirection: "row"}}>
                <View style={{flex:1, alignItems: "flex-start" }}>
                  <View>
                    <Text style={{color: Style.colors.primary, fontSize:30, fontWeight: "800"}}>
                      {this.getPercentOfWorkTarget(30, this.sumOfWork(30,this.state.workTime), this.state.userData.workingDays*this.state.userData.workingHours)+"%"}
                    </Text>
                    <Text style={{color: Style.colors.primaryText, fontSize:14}}>{"of monthly goal"}</Text>
                  </View>
                </View>
                <View style={{flex:1, paddingTop: 5, flexDirection: "column", alignItems:"flex-end"}}>
                  <View style={{marginTop: "auto", marginBottom: "auto"}}>
                    <Text style={{color: Style.colors.primary, fontSize:20, fontWeight: "700"}}>{"last month"}</Text>
                  </View>

                </View>
              </View>
            </View>
              <View style={{width: "100%", alignItems: "center"}}>
                <FrequencyGraph size={300} rows={4} cols={8} spaceBetween={1} data={this.getFrequencyChartData(30,this.state.workTime,this.state.userData.workingHours)}/>
              </View>
            </View>
        </View>
        </ScrollView>
      </SafeAreaView>
      );
    }
  }
}
