import { isDemo } from '../views/init';
const urlBase = "YOUR_SERVER_URL";

function sendRequest(type, url, data, callback) {
  if (!isDemo) {
    var request = new XMLHttpRequest();
    var response;

    request.open(type, url, true);
    request.setRequestHeader("Content-type", "application/json");
    request.withCredentials = true;
    request.send(data!==null ? JSON.stringify(data) : null);

    request.onreadystatechange = function() {
      if (request.readyState==4 && request.status==200) {
        if (/^\s*[{\[]/.test(request.responseText)) {
          callback(JSON.parse(request.responseText));
        }
        else {
          callback(request.responseText)
        }
      }
    }
    request.timeout = 5000;
    request.ontimeout = function (e) {
      alert("Unable to fetch data from our server");
    };
  }
}

export function fetchLatestTask(callback) {
  const url = `${urlBase}/tasks/latest`;
  sendRequest('GET', url, null, callback);
}

export function fetchRecentWorktime(numberOfDays, callback) {
  const url = `${urlBase}/summary/${numberOfDays}`;
  sendRequest('GET', url, null, callback);
}

export function fetchUserData(callback) {
  const url = `${urlBase}/user`;
  sendRequest('GET', url, null, callback);
}

export function fetchProjectData(projectID, callback) {
  const url = `${urlBase}/projects/${projectID}`;
  sendRequest('GET', url, null, callback);
}

export function fetchTaskData(taskID, callback) {
  const url = `${urlBase}/tasks/${taskID}`;
  sendRequest('GET', url, null, callback);
}

export function addProject(data, callback) {
  const url = `${urlBase}/projects`;
  sendRequest('POST',url, data, callback);
}

export function login(data, callback) {
  const url = `${urlBase}/login`;
  sendRequest('POST',url, data, callback);
}

export function resetPassword(email, callback) {
  const url = `${urlBase}/password/reset`;
  sendRequest('GET', url, email, callback);
}

export function signUp(data, callback) {
  const url = `${urlBase}/users`;
  sendRequest('POST', url, data, callback);
}

export function updateUser(data, email, callback) {
  const url = `${urlBase}/users/${email}`;
  sendRequest('PUT', url, data, callback);
}

export function updateProject(data, projectID, callback) {
  const url = `${urlBase}/projects/${projectID}`;
  sendRequest('PUT', url, data, callback);
}

export function updateTask(data, taskID, callback) {
  const url = `${urlBase}/tasks/${taskID}`;
  sendRequest('PUT', url, data, callback);
}

export function addTask(data, callback) {
  const url = `${urlBase}/tasks`;
  sendRequest('POST',url, data, callback);
}

export function startTask(taskID, callback) {
  const url = `${urlBase}/tasks/${taskID}/start`;
  sendRequest('GET',url, null, callback);
}

export function stopTask(taskID, callback) {
  const url = `${urlBase}/tasks/${taskID}/stop`;
  sendRequest('GET',url, null, callback);
}

export function deleteTask(taskID, callback) {
  const url = `${urlBase}/tasks/${taskID}`;
  sendRequest('DELETE', url, null, callback);
}

export function deleteProject(projectID, callback) {
  const url = `${urlBase}/projects/${projectID}`;
  sendRequest('DELETE', url, null, callback);
}

export function fetchProjectSummary(projectID, callback) {
  const url = `${urlBase}/projects/${projectID}/summary`;
  sendRequest('GET', url, null, callback);
}

export function fetchTaskSummary(taskID, callback) {
  const url = `${urlBase}/tasks/${taskID}/summary`;
  sendRequest('GET', url, null, callback);
}

export function sendTaskNotification(data, callback) {
  const url = `${urlBase}/notify/task`;
  sendRequest('POST', url, data, callback);
}

export function sendProjectNotification(data, callback) {
  const url = `${urlBase}/notify/project`;
  sendRequest('POST', url, data, callback);
}
