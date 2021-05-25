const axios = require('axios');
// This is your new function. To start, set the name and path on the left.
//const API_ENDPOINT = 'https://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_Main_IVR_SIF/Home';
let API_ENDPOINT="";
console.log("getAccount_task");
exports.getAccount_task = async function (context, event, callback, RB) {
  let Say;
  let Prompt;
  let Listen = false;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  API_ENDPOINT = context.API_URL;
  const Memory = JSON.parse(event.Memory);
  Remember.userData = "";

  Remember.FullName = "";
  Remember.ZipCd = "";
  Remember.SSNLastFour = "";
  Remember.accountNumber = "";
  Remember.accountStatus = "";
  Remember.TotalBalance = "";
  Remember.RouteBalance = "";
  Remember.AutomatedCCFlag = "";
  Remember.AutomatedCCFee = "";
  Remember.AutomatedACHFlag = "";
  Remember.AutomatedACHFee = "";
  Remember.ClientClass = "";
  Remember.ClientAcct = "";
  Remember.ClientID = "";
  Remember.PhoneNum = "";
  Remember.Disposition = "";
  Remember.LastPayDate = "";
  Remember.LastPayAmnt = "";
  Remember.SeedAcct = "";
  Remember.ADD1 = "";
  Remember.ADD2 = "";
  Remember.CITY = "";
  Remember.STATE = "";
  Remember.Status = "";
  Remember.PayArrangeFlag = "";
  Remember.SIFAmount = "";

  //Remember.clientData = Memory.clientData;
  Remember.CurrentTask = "getAccount_task";

  if (Memory.AccountFailed_Counter === undefined) {
    Remember.AccountFailed_Counter = 0;
  }
  else {
    Remember.AccountFailed_Counter = parseInt(Memory.AccountFailed_Counter) + 1;
  }

  let userPhoneNumber = Memory.user_phone_number;
  let AccountNo = null;
  Remember.user_phone_number = Memory.user_phone_number;

  let sMsg = "";
  if (Memory.channel == 'SMS')
    sMsg = "in the body of the SMS you received";
  else if (Memory.channel == 'SendGrid Email')
    sMsg = "in the upper right hand corner of the Email you received";
  else
    sMsg = "in the upper right hand corner of the letter you received";

    

  //let squestion = `Please Say or enter your account number , located ${sMsg}. Enter the numbers .`;
  let squestion = `Please say or enter your statement number located on the upper right-hand corner of your statement.`;
  let bPhone = false;
  // if (Memory.AccountFrom == "Phone") {
  //   squestion = `We could not find your account number from the phone you are calling. Please Say or enter your account number , located ${sMsg}.`;
  //   Remember.AccountFrom = "";
  //   bPhone = true;
  // }
  // else {
  if (Memory.Fallback_getAccount_task == true) {
    AccountNo = null;
    Remember.Fallback_getAccount_task = false;
    console.log("Fallback_getAccount_task : " + Memory.Fallback_getAccount_task);
  }
  else {
    try {
      console.log("collected_dataACCT : " + Memory.twilio.collected_data.collect_Accountnumber.answers.NumberOfacct.answer);
      AccountNo = Memory.twilio.collected_data.collect_Accountnumber.answers.NumberOfacct.answer;
    }
    catch {
      console.log("Catch collected_dataACCT : ");
      AccountNo = null;
    }
  }
  //}

  let Collect_Json = {
    "name": "collect_Accountnumber",
    "questions": [
      {
        "question": `${squestion}`,
        "name": "NumberOfacct",
        "type": "Twilio.NUMBER_SEQUENCE",
        "voice_digits": {
          "num_digits": 20,
          "finish_on_key": "#"
        },
      }
    ],
    "on_complete": {
      "redirect": "task://getAccount"
    }
  }


  let YesNo = null;
  if (Memory.check_name_task_yesno != undefined) {
    YesNo = Memory.check_name_task_yesno;
  }

  if (YesNo == 'No') {
    console.log("YesNo: " + YesNo);
    Remember.check_name_task_yesno = "";
    Memory.twilio = {};
    event.Memory.twilio = {};
    AccountNo = null;
  }

  console.log("AccountNo:" + AccountNo);

  if (AccountNo) {
    console.log("ifAccountNo:" + AccountNo);
    const reqData = {
      accountNumber: AccountNo,
      namespace: Memory.namespace,
      host: Memory.host,
      callerPhoneNumber: Memory.user_phone_number, // we need to pass bad phone number so that we lookup the account using the account number
      TFN: Memory.TFN
    };
    console.log("reqData: " + JSON.stringify(reqData));
    const { success, userRespData } = await GetInboundAccountInfo(reqData);

    if (success) {
      console.log("userRespData:" + JSON.stringify(userRespData));
      const userData = {
        userName: userRespData.FullName,
        userZip: userRespData.ZipCd,
        userSsnLastFour: userRespData.SSNLastFour,
        accountNumber: userRespData.SeedAcct,
        accountStatus: userRespData.AccStatus === '1' ? true : false,
        userTotalBalance: userRespData.TotalBalance,
        RouteBalance: userRespData.RouteBalance,
        AutomatedCCFlag: userRespData.AutomatedCCFlag,
        AutomatedCCFee: userRespData.AutomatedCCFee,
        AutomatedACHFlag: userRespData.AutomatedACHFlag,
        AutomatedACHFee: userRespData.AutomatedACHFee,
        ClientClass: userRespData.ClientClass,
        ClientAcct: userRespData.ClientAcct,
        ClientID: userRespData.ClientID,
        PhoneNum: userRespData.PhoneNum,
        Disposition: userRespData.Disposition,
        LastPayDate: userRespData.LastPayDate,
        LastPayAmnt: userRespData.LastPayAmnt,
        SeedAcct: userRespData.SeedAcct,
        ADD1: userRespData.Address1,
        ADD2: userRespData.Address2,
        CITY: userRespData.City,
        STATE: userRespData.State,
        Status: userRespData.Status,
        PayArrangeFlag: userRespData.PayArrangeFlag,
        SIFAmount: userRespData.SIFAmount
      };
      // filling the  getaccountinfo response in remember 
      console.log("userData:" + JSON.stringify(userData));
      Remember.userData = userData;
      Remember.FullName = userRespData.FullName;
      Remember.ZipCd = userRespData.ZipCd;
      Remember.SSNLastFour = userRespData.SSNLastFour;
      Remember.accountNumber = userRespData.SeedAcct;
      Remember.accountStatus = userRespData.AccStatus === '1' ? true : false;
      Remember.TotalBalance = userRespData.TotalBalance;
      Remember.RouteBalance = userRespData.RouteBalance;
      Remember.AutomatedCCFlag = userRespData.AutomatedCCFlag;
      Remember.AutomatedCCFee = userRespData.AutomatedCCFee;
      Remember.AutomatedACHFlag = userRespData.AutomatedACHFlag;
      Remember.AutomatedACHFee = userRespData.AutomatedACHFee;
      Remember.ClientClass = userRespData.ClientClass;
      Remember.ClientAcct = userRespData.ClientAcct;
      Remember.ClientID = userRespData.ClientID;
      Remember.PhoneNum = userRespData.PhoneNum;
      Remember.Disposition = userRespData.Disposition;
      Remember.LastPayDate = userRespData.LastPayDate;
      Remember.LastPayAmnt = userRespData.LastPayAmnt;
      Remember.SeedAcct = userRespData.SeedAcct;
      Remember.ADD1 = userRespData.Address1;
      Remember.ADD2 = userRespData.Address2;
      Remember.CITY = userRespData.City;
      Remember.STATE = userRespData.State;
      Remember.Status = userRespData.Status;
      Remember.PayArrangeFlag = userRespData.PayArrangeFlag;
      Remember.SIFAmount = userRespData.SIFAmount

      Say = false;
      Listen = false;
      Redirect = true;
      Remember.AccountFailed_Counter = 0;

      if (userData.accountStatus) {
        if (userData.RouteBalance == "0.00" || userData.RouteBalance == "0") {
          Say = `We need to transfer you to an agent for account number, <say-as interpret-as='digits'>${AccountNo}</say-as>.`;
          console.log("Zero Balance:");
          Redirect = "task://agent_transfer";
        }
        else {
          console.log("accountStatus true:");
          Redirect = "task://check_name_task";
        }
        if(!(userData.userZip.length===5 || userData.userSsnLastFour.length===4))
        {
          Say = `We need to transfer you to an agent for account number, <say-as interpret-as='digits'>${AccountNo}</say-as>.`;
          console.log("Not Valid Zip and SSN");
          Redirect = "task://agent_transfer";
        }//
      }
      else // if account not active
      {
        console.log("accountStatus false:");
        Collect = false;
        Redirect = true;
        Say = `We need to transfer you to an agent for account number, <say-as interpret-as='digits'>${AccountNo}</say-as>.`;
        Redirect = "task://agent_transfer";
      }

      
    }
    else // if api not holding success result
    {
      console.log("is account is wrong : " + Memory.AccountFailed_Counter);
      if (Memory.AccountFailed_Counter >= 2) {
        console.log("AccountFailed_Counter wrong input");
        Say = false;
        Listen = false;
        Collect = false;
        Redirect = true;
        Redirect = "task://agent_transfer";
        RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
        return;
      }

      Remember.AccountFrom = "Manual";
      //if (!bPhone)
      Say = `The account number, <say-as interpret-as='digits'>${AccountNo}</say-as> you entered is not correct.`;

      Collect = true;
      Remember.question = "getAccount_task";
      Collect = Collect_Json;
    }
  }
  // account is null because user did not gave any input.
  else {
    console.log("is account is null : " + Memory.AccountFailed_Counter);
    Collect = true;
    Remember.question = "getAccount_task";
    Collect = Collect_Json;
  }

  console.log("Say: " + Say + "Listen: " + Listen + "Remember: " + Remember + "Collect: " + Collect + "Tasks: " + Tasks + "Redirect: " + Redirect + "Handoff: " + Handoff);

  RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

const GetInboundAccountInfo = async (reqData) => {
  let userRespData;
  let success;

  try {
    const requestObj = {
      'AccountNo': reqData.accountNumber,  // A/C number the caller entered. Or the caller’s phone number
      'NameSpace': reqData.namespace,  // coming from the result of TFN_LookUp
      'AccountType': 'F', // hard coded for facs account
      'NameType': 'P',  // hard coded
      'SeedFlag': '1',  // hard coded
      'Host': reqData.host, // coming from the result of TFN_LookUp
      'PhoneNumber': reqData.callerPhoneNumber, // caller’s phone number
      'PhoneNumberTo': reqData.TFN, // the phone number they are calling to
      'IVRUsed': 'MainAutoIVR10'
    };

    const responseObj = await axios.post(`${API_ENDPOINT}/GetInboundAccountInfoAuto`, requestObj);
    userRespData = responseObj.data;

    success = userRespData.Returns === '1' ? true : false;

  } catch (error) {
    console.error(error.response);
    success = false;
  }

  return { success, userRespData };

};
