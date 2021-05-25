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
CurrentInput: 'agent',
CurrentTask: 'fallback',
DialoguePayloadUrl:
'https://autopilot.twilio.com/v1/Assistants/UAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1/Dialogues/UKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1',
 Memory: `{

 }`,

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
