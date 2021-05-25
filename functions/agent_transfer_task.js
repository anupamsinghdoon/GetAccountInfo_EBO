exports.agent_transfer_task =async function(context, event, callback,RB) {
    try {
        let Listen = false;
        let Remember = {};
        let Collect = false;
        let Tasks = false;
        let Redirect = false;
        let Handoff = false;
        let Say = "";
    
        console.log("Agent transfer");
        Say = " ";
        Remember.Agent = true;
         RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
    
    } catch (error) {
    console.error(error);
    callback( error);
    }
};