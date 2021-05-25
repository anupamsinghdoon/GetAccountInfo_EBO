const axios = require('axios');
// This is your new function. To start, set the name and path on the left.

exports.fallback_task = async function (context, event, callback, RB) {
  try {
    let Listen = false;
    let Remember = {};
    let Collect = false;
    let Tasks = false;
    let Redirect = true;
    let Handoff = false;
    let Say = "";

    const Memory = JSON.parse(event.Memory);

    console.log("Question:" + Memory.question);
    switch (Memory.question) {
      case 'getAccount_task':
        Remember.Fallback_getAccount_task = true;
        if (Memory.AccountFailed_Counter >= 2) {
          Redirect = "task://agent_transfer";
        }
        else {
          Redirect = "task://getAccount";
        }
        break;

      case 'check_name_task':
        if (Memory.check_name_task_counter === undefined)
          Remember.check_name_task_counter = 1;
        else
          Remember.check_name_task_counter = parseInt(Memory.check_name_task_counter) + 1;

        if (Memory.check_name_task_counter >= 2)
          Redirect = "task://agent_transfer";
        else {
          Say = "I did not understand.";
          Redirect = "task://check_name_task";
        }
        break;

      case 'ZipOrSSN_Task':
        if (Memory.ZipOrSSN_Task_counter === undefined)
          Remember.ZipOrSSN_Task_counter = 1;
        else
          Remember.ZipOrSSN_Task_counter = parseInt(Memory.ZipOrSSN_Task_counter) + 1;

        if (Memory.ZipOrSSN_Task_counter >= 1)
          Redirect = "task://agent_transfer";
        else {
          Say = "I did not understand.";
          Redirect = "task://ZipOrSSN_Taks";
        }
        break;

      default:
        Redirect = "task://agent_transfer";
        break;
    }

    RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);

  } catch (error) {
    console.error(error);
    callback(error);
  }
};