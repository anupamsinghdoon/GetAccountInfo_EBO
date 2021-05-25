// reference to function with exports.handler
// const functions = Runtime.getFunctions();
// let PA = require(functions['PaymentArrangement'].path);
const eventHandler = require('../functions/getAccount_task.js');
const responseBuilder = require('./response_builder.js');
 
const context = {};
const event = {
AccountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1',
AssistantSid: 'UAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1',
DialogueSid: 'UKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1',
date_created: '',
UserIdentifier: '+14151234567',
CurrentInput: 'ABC',
CurrentTask: 'fallback',
DialoguePayloadUrl:
'https://autopilot.twilio.com/v1/Assistants/UAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1/Dialogues/UKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1',
Memory: `
{
    "twilio":{
       "voice":{
          "To":"+19568150378",
          "From":"+13109025157",
          "CallSid":"CA00a961c4af4c6545f531fc7350abffb3",
          "Direction":"inbound"
       }
    },
    "fallback":"",
    "CurrentTask":"greeting",
    "AccountFrom":"Phone",
    "TFN":"8559092691",
    "user_phone_number":"3109025157",
    "clientData":{
       "clientName":"Convergent Outsourcing",
       "mailingAddress":" Convergent Outsourcing Incorporated , P O Box 9 0 0 4 , Renton , Washington , 9 8 0 5 7",
       "webPaymentAddress":"payconvergent.com",
       "transferAgentNumber":"+18334050479",
       "namespace":"RED",
       "channel":"SendGrid Email",
       "host":"FACS",
       "TFN":"8559092691",
       "user_phone_number":"3109025157",
       "F_Letter_Namespace":"R"
    }
 }
`,


Field_yes_no_Value: 'No',
Channel: 'voice',
};
 
function callback(error, data) {
if (error) {
console.log('error: ' + error);
} else {
console.log(JSON.stringify(data));
}
}
 
// call the function
eventHandler.getAccount_task(context, event, callback,responseBuilder.RB);
//PA.PaymentArrangement(context, event, callback);