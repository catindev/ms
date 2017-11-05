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
        waitingDuration: watingDuration,
        conversationDuration: conversationDuration,
        isCallback: !!crm_call_id
    }

    crm_call_id && (payload.isCallback = true)
    endpointPhoneNumber && (payload.managerNumber = endpointPhoneNumber)
    recordFile && (payload.record = recordFile)

    const endpoint = crm_call_id ? '/callback' : '/call'

    request({ 
      url: 'http://hooks.mindsales-crm.com' + endpoint, 
      method: 'POST', 
      json: payload 
    }, function(error, response, body) {
        if (error) return console.log(error.message)
        console.log(calleePhoneNumber, response.statusCode, body)  
    })

}

module.exports = proxyCall;