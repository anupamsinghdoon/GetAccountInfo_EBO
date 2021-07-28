exports.ZipOrSSN_Task = async function (context, event, callback, RB) {
  let Say;
  let Prompt;
  let Listen = false;
  let Collect = true;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  Remember.CurrentTask = "ZipOrSSN_Task";
  let Zipcode = Memory.userData.userZip;
  let SSNCode = Memory.userData.userSsnLastFour;
  let enterdigit = "";
  let MSG = "";


  try {
    enterdigit = Memory.twilio.collected_data.collect_ziporssn.answers.ziporssn.answer;
  }
  catch {
    enterdigit = null
  }
  let squestion = "";
  let enterCodeType = "";
  if (Zipcode.length >= 5 && SSNCode.length === 4) {
    squestion = `For your account verification please say or enter your Zip Code or the Last 4 digits of your Social Security number.`;

  }
  else if (Zipcode.length >= 5) {
    squestion = `For your account verification please say or enter your Zip Code.`;
    enterCodeType = "zip";
  }
  else if (SSNCode.length === 4) {
    squestion = `For your account verification please say or enter the Last 4 digits of your Social Security number.`;
    enterCodeType = "ssn";
  }

  let Collect_Json = {
    "name": "collect_ziporssn",
    "questions": [
      {
        "question": `${squestion}`,
        "name": "ziporssn",
        "type": "Twilio.NUMBER_SEQUENCE",
        "voice_digits": {
          "num_digits": 10,
          "finish_on_key": "#"

        },
      }

    ],
    "on_complete": {
      "redirect": "task://ZipOrSSN_Taks"
    }
  };

  if (enterdigit == "" || enterdigit == null) {
    Remember.question = "ZipOrSSN_Task";
    Collect = Collect_Json;
  }
  else {
    if (enterdigit == SSNCode) {
      Collect = false;
      //Redirect = true;
      Say = `Thank you for verifying your account with social security number.`;
      // if (Memory.namespace != 'EBO')
      //     Redirect = "task://set_MM";

    }
    else if (enterdigit == Zipcode) {
      Collect = false;
      //Redirect = true;
      Say = `Thank you for verifying your account with Zip Code.`;
      // if (Memory.namespace != 'EBO')
      //     Redirect = "task://set_MM";

    }
    else if (enterdigit == Zipcode.substring(0, 5)) // if we have zip+4 in FACS
    {
      Collect = false;
      //Redirect = true;
      Say = `Thank you for verifying your account with Zip Code.`;
      // if (Memory.namespace != 'EBO')
      //     Redirect = "task://set_MM";
    }
    else {
      if (Memory.ZipSSNFailed_Counter >= 2) {
        Collect = false;
        Redirect = true;
        Say = " ";
        Redirect = "task://agent_transfer";
        RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
        return;
      }

      if (Memory.ZipSSNFailed_Counter === undefined)
        Remember.ZipSSNFailed_Counter = 1;
      else
        Remember.ZipSSNFailed_Counter = parseInt(Memory.ZipSSNFailed_Counter) + 1;

      if (enterCodeType === "zip" && enterdigit.length != 5) {
        Say = `The  Zip Code, <say-as interpret-as='digits'>${enterdigit}</say-as> you entered is not correct.`;
      }
      else if (enterCodeType === "ssn" && enterdigit.length != 4) {
        Say = `The  Zip Code, <say-as interpret-as='digits'>${enterdigit}</say-as> you entered is not correct.`;
      }
      else {
        if (enterdigit.length >= 5)
          Say = `The  Zip Code, <say-as interpret-as='digits'>${enterdigit}</say-as> you entered is not correct.`;
        else
          Say = `The  Last 4 digits of your social security number, <say-as interpret-as='digits'>${enterdigit}</say-as> you entered is not correct.`;


      }


      Remember.question = "ZipOrSSN_Task";
      Collect = Collect_Json;


    }
  }

  RB(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};



