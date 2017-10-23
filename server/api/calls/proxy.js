const request = require('request')

function proxyCall({
    calleePhoneNumber,
    callerPhoneNumber,
    endpointPhoneNumber,
    direction,
    startedAt,
    createdAt,
    answeredAt = null,
    status,
    watingDuration = 0,
    callDuration = 0,
    conversationDuration = 0,
    recordFile = null,
    crm_call_id = false
}) {


    const payload = {
        customerNumber: callerPhoneNumber,
        trunkNumber: calleePhoneNumber,
        managerNumber: endpointPhoneNumber,
        waitingDuration: watingDuration,
        conversationDuration: conversationDuration,
        record: recordFile,
        isCallback: !!crm_call_id
    }

    request({ url: 'http://hooks.mindsales.crm/test', method: 'POST', json: payload }, 
      function(error, response, body) {
        if (error) return console.log(error.message)
        console.log(response.statusCode, body)  
    })

}

module.exports = proxyCall;