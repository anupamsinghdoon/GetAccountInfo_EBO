const responseBuilder = require('./response_builder.js');
    
    let Say;
    let Prompt;
    let Listen = false;
    let Collect = false;
    let Remember = {};
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;
    let callback;

    Say = " ";
    Collect = false;
    Listen = false;
    Redirect = true;
    Redirect = "task://agent_transfer";
    responseBuilder.RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff);
