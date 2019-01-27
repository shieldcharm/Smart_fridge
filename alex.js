
var request = require("request")
// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
        try {
        console.log("event.session.application.applicationId=" + 
event.session.application.applicationId);
        console.log('AWSrequestID = ', context.awsRequestId); 

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

     if (event.session.application.applicationId !== "amzn1.ask.skill.747c2a6b-e2e3-42a6-a6ff-df1aa8d66650") {
         
      }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    getWelcomeResponse(callback)
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    var intent = intentRequest.intent
    var intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == "GetInfoIntent") {
        handleGetInfoIntent(intent, session, callback)
    } else {
         throw "Invalid intent"
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {

}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
    var speechOutput = "Welcome! Do you want to hear about some facts?"

    var reprompt = "Do you want to hear about some facts?"

    var header = "Get Info"
    
    var prompt1 = "What do I have"
    var prompt2 = "What can I make"
    var shouldEndSession = false

    var sessionAttributes = {
        "speechOutput" : speechOutput,
        "repromptText" : reprompt
    }
if(callback==prompt1){
    callback("We have apples and bananas")
}
    callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))

} 

function handleGetInfoIntent(intent, session, callback) {
    var speechOutput = "We have a problem"

    getJSON(function(data){
        if(data != "ERROR"){
            var speechOutput = data
        }
        callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput,"",true))
    })

}

function Get(url){
    var httpserver = new XMLHttpRequest();
    httpserver.open("GET",url,false);
    httpserver.send(null);
    return httpserver.responseText;
}

function url(){
    //yes
    // return "http://www.wolfdelta.com/API.json"
    return "https://smart-fridge-229818.appspot.com/apple"
}

function getJSON(callback){

    
    request.get(url(), function(error, response, body){
        //var json_obj = JSON.parse(body);
        
        //var d = JSON.parse(body)
        //var e = JSON.parse(body)
        //var result = d.query.searchinfo.totalhits;
        //var abc = body;
        
        if(5>0){
            callback('We got them bananas')
            //callback(`Minh Tran is worth $ ${body}${response}`);
        }
        else{
            callback("ERROR")
        }
        
    })
}


// ------- Helper functions to build responses for Alexa -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

function capitalizeFirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}
