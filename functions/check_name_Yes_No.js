exports.check_name_Yes_No =async function(context, event, callback,RB) {
  console.log("check_name_Yes_No:");
    let Say;
    let Prompt;
    let Listen = false;
    let Collect = false;
    let Remember = {};
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;

    const Memory = JSON.parse(event.Memory);
    Remember.CurrentTask = "check_name_Yes_No";
    
    Remember.check_name_task_yesno = "No";

    console.log(JSON.stringify(event.Memory));
    if(Memory.check_name_task_cnt >=2){
      Redirect = "task://agent_transfer";
    }
    else{
        Redirect = "task://getAccount";
    }
            
    RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  };

   
    
 