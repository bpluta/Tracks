
export function getWidgetTimeLabel(timeStamp) {
  let hours=Math.floor(timeStamp/3600);
  let minutes=Math.floor((timeStamp%3600)/60);
  return `${hours}h ${minutes}min`;
}

export function workingDaysLabel(days) {
  return `${days} ${days==1 ? "day" : "days"}`;
}

export function workingHoursLabel(hours) {
  return `${hours} ${hours==1 ? "hour" : "hours"}`;
}

export function getCounterLabel(timeStamp) {
  let time=Math.abs(timeStamp)
  let hours=Math.floor(time/3600);
  let minutes=Math.floor((time%3600)/60);
  let seconds=Math.floor(time%60);
  return `${hours}:${minutes<10 ? "0"+minutes : minutes}.${seconds<10 ? "0"+seconds : seconds}`;
}

export function getTimeLabel(time) {
  time /= (1000*60)
  if (Math.floor(time/60) == 0) {
    return `${Math.floor(time)} min`
  }
  time /= 60;
  if (Math.floor(time/24) == 0) {
    if (Math.floor(time) == 1) {
      return `${Math.floor(time)} hour`
    }
    return `${Math.floor(time)} hours`
  }
  time /= 24;
  if (Math.floor(time/365) == 0) {
    if (Math.floor(time) == 1) {
      return `${Math.floor(time)} day`
    }
    else {
      return `${Math.floor(time)} days`
    }
  }
  time /= 365
  if (Math.floor(time) == 1) {
    return `${Math.floor(time)} year`
  }
  else {
    return `${Math.floor(time)} years`
  }

}

export function getValueOfTimeLabel(timeSpent,pricePerHour) {
  let value=Math.floor(timeSpent*pricePerHour/3600);
  return getCurrencyLabel(value,'USD');
}

export function getPreciseValueOfTimeLabel(timeSpent, pricePerHour) {
  characteristic=Math.floor(timeSpent*pricePerHour/3600);
  mantissa=Math.floor((timeSpent*pricePerHour/3600)*100)%100;
  value = `${characteristic < 10 ? "0"+characteristic : characteristic}.${mantissa < 10 ? "0"+mantissa : mantissa}`
  return getCurrencyLabel(value,'USD');
}

export function getCurrencyLabel(value,currency) {
  return `${value} ${currency}`;
}

export function getTimeLeftLabel(deadline) {
  let now = new Date()
  deadline = stringToDate(deadline)
  let timeLeft = deadline-now

  return getTimeLabel(Math.abs(timeLeft))
}

export function convertDate(dateString) {
  if (/[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}/.test(dateString)) {
    dateString = dateString.replace(' ','T')
    dateString = dateString+"Z"

    return dateString
  }
  else {
    return new Date().toString();
  }
}

export function getWeekDayLabel(dateString) {
  var date = new Date(dateString);
  let weekDay = date.getDay();
  let weekDays = ["SU","MO","TU","WE","TH","FR","SA"];
  return weekDays[weekDay];
}

export function getPreciseDateLabel(dateString) {
  var date = new Date(dateString);
  const minute = date.getMinutes().toString().length == 1 ? `0${date.getMinutes()}` : date.getMinutes();
  const hour = date.getHours();
  const day = date.getDate();
  const month = date.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const year = date.getFullYear();

  return `${day} ${monthNames[month]} ${year}, ${hour}:${minute}`;
}

export function stringToDate(dateString) {
  if (/[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}/.test(dateString)) {
    dateString = dateString.replace(' ','T')
    dateString = dateString+"Z"

    return new Date(dateString)
  }
  else {
    return new Date();
  }
}

export function getShortDateLabel(dateString) {
  const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

  if (/[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}/.test(dateString)) {
    date = dateString.match(/[0-9]{4}|[0-9]{2}/g);

    return `${date[2]} ${monthNames[date[1]-1]}`;
  }
  else {
    var date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth();

    return `${day} ${monthNames[month]}`;
  }
}

export function getDateLabel(dateString) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  if (/[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}/.test(dateString)) {
    date = dateString.match(/[0-9]{4}|[0-9]{2}/g);

    return `${date[2]} ${monthNames[date[1]-1]} ${date[0]}`;
  }
  else {
    var date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${day} ${monthNames[month]} ${year}`;
  }
}

export function getTaskState(state) {
  switch(state) {
    case "open":
      return "Open";
    case "closed":
      return "Closed";
    case "pending":
      return "Pending";
    case "planned":
      return "Planned";
    default:
        return "Open";
  }
}

export function verifyHourlywage(hourlyWageValue, callback) {
  if (/^[0-9]*\.?[0-9]*$/.test(hourlyWageValue)) {
    callback(hourlyWageValue);
    return true
  }
  return false
}

export function verifyPhoneNumber(phoneNumber, callback) {
  if (/^\+?([0-9\s\.\(\)\-])*$/.test(phoneNumber)) {
    callback(phoneNumber);
    return true
  }
  return false
}
