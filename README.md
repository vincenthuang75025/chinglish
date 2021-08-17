# Chinglish Chrome Extension

This is a fun project I worked on to get more experience with NLP, serverless computing, and chrome extension development. It takes selected text in the browser and translates the text into Chinglish (a Chinese-English hybrid): 

https://user-images.githubusercontent.com/23426990/129662869-1e5f8e69-e20c-4f0d-9aa4-ff2c3139ebce.mp4

## How It Works

The translation code in the *chinglish-api* directory is hosted on AWS Lambda, with a public endpoint set up on Amazon API Gateway. The README in that directory has details on how to set it up. 

The current version of the translation algorithm (inspired by conversations with CJ Quines and Franklyn Wang) works as follows: 
- Take the selected text and translate it entirely into Chinese
- Run the Chinese text through a word segmentation process (we use the jiagu library)
- Check if each of the segmented phrases is in a Chinese primary school vocabulary list. If so, it is considered "easy". Otherwise, it is considered "hard"
- Translate the hard phrases back into English

This translation quality could be greatly improved (especially the last step outlined above, which often introduces errors because fragments are taken out of context), but I currently don't have the resources to train a new bilingual model. Let me know if you have suggestions for other approaches to translation improvement!

## How To Use It

Unfortunately, I had to shut down my AWS code to avoid exceeding the free tier limits. To use this or do further testing and development, you will have to deploy your own serverless function (instructions in *chinglish-api*) and paste your API url into line 7 of *frontend-extension/selection.js*. You can also run everything locally if you have a fast computer. 

To actually perform a translation, select some text on a webpage. Open the extension menu (either by clicking it or with the shortcut Ctrl+Shift+F), select the appropriate Chinese difficulty level you want (the options range from Chinese grade 1 to grade 6), and submit the translate button. 
