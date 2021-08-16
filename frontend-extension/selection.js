chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(window.getSelection().toString());
    if (request.method == "getSelection") {
        sendResponse({'data': window.getSelection().toString()});

        // const url = 'https://p6era4zq99.execute-api.us-west-2.amazonaws.com/ServerlessHuggingFaceStack-testAF53AC38-8FVJp5hIbnMU';
        // const options = {
        // method: 'POST'}

        // fetch(url + '?' + 'difficulty=5&text=' + window.getSelection().toString(), options)
        // .then(function(response) { // response is a ReadableStream
        //     return response.text();
        //   }).then(function(data) {
        //     console.log(data);  
        //     sendResponse({'data': data});
        //   });

    }
    else
      sendResponse({}); // snub them.
    return true;
});