chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getSelection") {
      console.log([window.getSelection().toString(), request.difficulty]);
        // sendResponse({'data': window.getSelection().toString()});
        // ^ placeholder response for development without api calls

        const url = 'https://p6era4zq99.execute-api.us-west-2.amazonaws.com/ServerlessHuggingFaceStack-testAF53AC38-8FVJp5hIbnMU';
        // replace ^ with your own url api. above url will not work. 
        const options = {
        method: 'POST'}

        fetch(url + '?' + 'difficulty=' + request.difficulty.toString() + '&text=' + window.getSelection().toString(), options)
        .then(function(response) { // response is a ReadableStream. convert to string
            return response.text();
          }).then(function(data) {
            console.log(data);  
            sendResponse({'data': data});
          });

    }
    else
      sendResponse({}); // snub them.
    return true;
});