import data from './demodata.json';
import { convertDate } from '../config/formatData';

export function getProject(projectID) {
  var filtered = data.projects.filter(a=>a.id==projectID);
  if (filtered.length == 0) {
    return {}
  }
  return filtered[0]
}

export function getProjectList() {
  console.log(data.projects)
  return data.projects
}

export function getTask(taskID) {
  for (project of data.projects) {
    for (task of project.tasks) {
      if (task.id == taskID) {
        return task
      }
    }
  }
  return {}
}

export function getUserData(userID) {
  return data
}

export function getLatestTask() {
  return getTask(data.latestTask)
}

export function getRecentWorkTime(sinceDate,numberOfDays) {
  var currentDate = new Date(sinceDate)
  var tomorrowDate = new Date(sinceDate)
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  var workTime = []

  for (var i=0; i<numberOfDays; i++) {
    var timeSpent = 0
    let year = currentDate.getFullYear()
    let month = currentDate.getMonth()+1 >= 10 ? currentDate.getMonth()+1 : '0'+(currentDate.getMonth()+1)
    let day = currentDate.getDate() >= 10 ? currentDate.getDate() : '0'+currentDate.getDate()
    let dateString = `${year}-${month}-${day}`

    for (project of data.projects) {
      for (task of project.tasks) {
        for (work of task.working) {
          let start = new Date(convertDate(work.start))
          let end = new Date(convertDate(work.end))
          if (start > currentDate && end < tomorrowDate) {
            timeSpent += toSeconds(end-start)
          }
          else if (start >= currentDate && start <= tomorrowDate) {
            timeSpent += toSeconds(tomorrowDate-start)
          }
          else if (end >= currentDate && end <= tomorrowDate) {
            timeSpent += toSeconds(end-currentDate)
          }
        }
      }
    }

    workTime.push({date: dateString, timeSpent: timeSpent})
    currentDate.setDate(currentDate.getDate() - 1);
    tomorrowDate.setDate(tomorrowDate.getDate() - 1);
  }

  return workTime
}

function toSeconds(timeIneMiliseconds) {
  return Math.round(timeIneMiliseconds/1000)
}
