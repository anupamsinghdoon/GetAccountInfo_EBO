const axios = require('axios');
// This is your new function. To start, set the name and path on the left.
const API_ENDPOINT = 'https://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_Main_IVR_SIF/Home';

exports.greeting_task = async function (context, event, callback, RB) {
  let Say;
  let Prompt;
  let Listen = false;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);
  Remember.Agent = false;
  //Remember.userData = "";
  Remember.channel = "";
  Remember.host = "";
  Remember.namespace = "";

  let userPhoneNumber;
  let TFN;
  try {
    userPhoneNumber = Memory.twilio.voice.From;
  }
  catch {
    userPhoneNumber = "+13109025157";
  }

  try {
    TFN = Memory.twilio.voice.To;
  }
  catch {
    TFN = "8777215502";
  }

  if (Memory.channel != undefined)
    Remember.channel = Memory.channel;
  else
    Remember.channel = "SendGrid Email";

  if (Memory.Host != undefined)
    Remember.host = Memory.Host;
  else
    Remember.host = "FACS";

  if (Memory.NameSpace != undefined) {
    Remember.namespace = Memory.NameSpace.toUpperCase();
  }
  else {
    Remember.namespace = "ebo".toUpperCase();
    
  }

  console.log("userPhoneNumber :" + userPhoneNumber);
  Remember.CurrentTask = "greeting";
  //Remember.AccountFrom = "-1";
  Remember.TFN = TFN;
  Remember.user_phone_number = userPhoneNumber;
  userPhoneNumber = userPhoneNumber.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  //Remember.AccountFrom = "Phone";

  // if (userPhoneNumber != null && userPhoneNumber != "") {
  //   const reqData = {
  //     accountNumber: userPhoneNumber,
  //     namespace: Remember.namespace,
  //     host: Remember.host,
  //     callerPhoneNumber: Remember.user_phone_number,
  //     TFN: TFN
  //   };
  //   console.log("Remember.user_phone_number : " + Remember.user_phone_number);
  //   console.log("RequestData:" + JSON.stringify(reqData));
  //   const { success, userRespData } = await GetInboundAccountInfoWithPhone(reqData);
  //   console.log("Accountsuccess:" + success);
  //   if (success) {
  //     const userData = {
  //       userName: userRespData.FullName,
  //       userZip: userRespData.ZipCd,
  //       userSsnLastFour: userRespData.SSNLastFour,
  //       accountNumber: userRespData.SeedAcct,
  //       accountStatus: userRespData.AccStatus === '1' ? true : false,
  //       TotalBalance: userRespData.TotalBalance,
  //       RouteBalance: userRespData.RouteBalance,
  //       AutomatedCCFlag: userRespData.AutomatedCCFlag,
  //       AutomatedCCFee: userRespData.AutomatedCCFee,
  //       AutomatedACHFlag: userRespData.AutomatedACHFlag,
  //       AutomatedACHFee: userRespData.AutomatedACHFee,
  //       ClientClass: userRespData.ClientClass,
  //       ClientAcct: userRespData.ClientAcct,
  //       ClientID: userRespData.ClientID,
  //       PhoneNum: userRespData.PhoneNum,
  //       Disposition: userRespData.Disposition,
  //       LastPayDate: userRespData.LastPayDate,
  //       LastPayAmnt: userRespData.LastPayAmnt,
  //       SeedAcct: userRespData.SeedAcct,
  //       ADD1: userRespData.Address1,
  //       ADD2: userRespData.Address2,
  //       CITY: userRespData.City,
  //       STATE: userRespData.State,
  //       Status: userRespData.Status,
  //       PayArrangeFlag: userRespData.PayArrangeFlag,
  //       SIFAmount: userRespData.SIFAmount

  //     };
  //     console.log("userData:" + JSON.stringify(userData));
  //     Remember.userData = userData;
  //     Remember.FullName = userRespData.FullName;
  //     Remember.ZipCd = userRespData.ZipCd;
  //     Remember.SSNLastFour = userRespData.SSNLastFour;
  //     Remember.accountNumber = userRespData.SeedAcct;
  //     Remember.accountStatus = userRespData.AccStatus === '1' ? true : false;
  //     Remember.userTotalBalance = userRespData.TotalBalance;
  //     Remember.RouteBalance = userRespData.RouteBalance;
  //     Remember.AutomatedCCFlag = userRespData.AutomatedCCFlag;
  //     Remember.AutomatedCCFee = userRespData.AutomatedCCFee;
  //     Remember.AutomatedACHFlag = userRespData.AutomatedACHFlag;
  //     Remember.AutomatedACHFee = userRespData.AutomatedACHFee;
  //     Remember.ClientClass = userRespData.ClientClass;
  //     Remember.ClientAcct = userRespData.ClientAcct;
  //     Remember.ClientID = userRespData.ClientID;
  //     Remember.PhoneNum = userRespData.PhoneNum;
  //     Remember.Disposition = userRespData.Disposition;
  //     Remember.LastPayDate = userRespData.LastPayDate;
  //     Remember.LastPayAmnt = userRespData.LastPayAmnt;
  //     Remember.SeedAcct = userRespData.SeedAcct;
  //     Remember.ADD1 = userRespData.Address1;
  //     Remember.ADD2 = userRespData.Address2;
  //     Remember.CITY = userRespData.City;
  //     Remember.STATE = userRespData.State;
  //     Remember.Status = userRespData.Status.toString();
  //     Remember.PayArrangeFlag = userRespData.PayArrangeFlag;
  //     Remember.SIFAmount = userRespData.SIFAmount;

  //     if (userData.accountStatus) {
  //       if (userData.RouteBalance == "0.00" || userData.RouteBalance == "0") {
  //         console.log("Zero Balance:");
  //         Redirect = "task://agent_transfer";
  //       }
  //       else {
  //         console.log("accountStatus true:");
  //         Redirect = "task://check_name_task";
  //       }
  //     }
  //     else {
  //       console.log("accountStatus false:");
  //       Redirect = "task://getAccount";
  //     }
  //   }
  //   else {
  //     console.log("phone number :" + Remember.user_phone_number + " Status : " + userRespData.Status.toString());
  //     Remember.Status_PhoneNotFound = userRespData.Status.toString();
  //     Redirect = "task://getAccount";
  //   }
  // }
  // else {
  //   // we need to agent transfer if phone number null
  //   console.log("phone number not found record :");
  //   Redirect = "task://getAccount";
  // }

  Redirect = "task://getAccount";
  RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

// const GetInboundAccountInfoWithPhone = async (reqData) => {
//   let userRespData;
//   let success;

//   try {
//     const requestObj = {
//       'AccountNo': reqData.callerPhoneNumber,  // A/C number the caller entered. Or the caller’s phone number
//       'NameSpace': reqData.namespace,  // coming from the result of TFN_LookUp
//       'AccountType': 'P', // hard coded  for phone number as accpunaccount number
//       'NameType': 'P',  // hard coded
//       'SeedFlag': '1',  // hard coded
//       'Host': reqData.host, // coming from the result of TFN_LookUp
//       'PhoneNumber': reqData.callerPhoneNumber, // caller’s phone number
//       'PhoneNumberTo': reqData.TFN, // the phone number they are calling to
//       'IVRUsed': 'MainAutoIVR10'
//     };
//     console.log("requestObj: " + JSON.stringify(requestObj));

//     const responseObj = await axios.post(`${API_ENDPOINT}/GetInboundAccountInfoAuto`, requestObj);
//     userRespData = responseObj.data;

//     success = userRespData.Returns === '1' ? true : false;

//   } catch (error) {
//     console.error(error.response);
//     success = false;
//   }

//   return { success, userRespData };

// };


