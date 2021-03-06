$(document).ready(function () {
    //function to make sure hitting 'enter' key submits input box
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            document.getElementById("urlInputButton").click();
            return false;
        }
    });

    //file functions
$("#file").change(async function (e) {
    var file = e.currentTarget.files[0];
    var songs = e.currentTarget.files;
    var numberOfSongs = songs.length;
    var htmlFinalTracklistView = "";

    var startTime = "x"
    var endTime = "z"
    var startTimeSeconds = 0
    var endTimeSeconds = 0
    var taggerData = []
    for (i = 0; i < numberOfSongs; i++) {
        let songLength = await getSongLength(songs[i], i);
        let songTitle = await getSongTitle(songs[i], i);
        
        var endTimeSeconds = startTimeSeconds + songLength

        //convert seconds to minutes 
        startTime = convertSecondsToTimestamp(startTimeSeconds);

        //convert seconds to minutes
        endTime = convertSecondsToTimestamp(endTimeSeconds);

        var trackData = { title: songTitle, startTime: startTime, endTime: endTime }
        taggerData.push(trackData)

        var startTimeSeconds = endTimeSeconds
    }
    
    displayData(taggerData)

});

});


function copyToClipboard(element) {

    /* Get the text field */
    var copyText = document.getElementById("inputBox");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");

  }
  

async function inputOption2(input) {
    //get file info
    var file = input.currentTarget.files[0];
    var songs = input.currentTarget.files;
    //get tracklistData
    let tracklistData = await convertFileInfoToTracklistData(songs)
    //get taggerData
    let taggerData = await getTaggerData(tracklistData)
}

async function convertFileInfoToTracklistData(songs) {
    return new Promise(async function (resolve, reject) {
        try {
            var tracklistData = []
            for (i = 0; i < songs.length; i++) {
                let songLength = await getSongLength(songs[i], i);
                let songTitle = await getSongTitle(songs[i], i);
                var trackData = { duration: songLength, title: songTitle }
                tracklistData.push(trackData)

            }
         
            resolve(tracklistData)
        } catch{
            resolve('error')
        }
    });
}

async function inputOption1(input) {
    //parse release id from url
    var urlArr = input.split('/');
    var discogsListingType = urlArr[urlArr.length - 2];
    var discogsListingCode = urlArr[urlArr.length - 1];
    //get tracklistData from discogs API
    let tracklistData = await getTracklistFromDiscogs(discogsListingType, discogsListingCode)
    //if tracklistData is valid, get taggerData
    if (tracklistData != 'error') {
        let taggerData = await getTaggerData(tracklistData)
        displayData(taggerData)
    }
    
}

async function displayData(input){
    let textResult = "Tracklist generated by http://tagger.site: &#13;&#10;"
    //select text box to display data
    for (let [key, value] of Object.entries(input)) {
        let startTime = value.startTime
        let endTime = value.endTime
        textResult = textResult + `${startTime} - ${endTime} : ${value.title}` + "&#13;&#10;"
    }
    document.getElementById("inputBox").innerHTML = textResult
}

async function isHeadingTrack(track){
    return new Promise(function (resolve, reject) {
        for (var key in track) {
            if (track.hasOwnProperty(key)) {
                if(key.includes("type") && track[key] == 'heading'){
                    resolve(true)
                }
            }
        }
        resolve(false)
    })
}

/*  getTaggerData(tracklist); receive tracklistData[] and return taggerData[] object with track title / timestamps 
    input: tracklistData[] object looking like this: [ {duration: 234, title: 'track1'}, {duration: 245, title: 'track2'}, {} ... {duration: 03:03, title: 'track1'}]
*/
async function getTaggerData(tracklistData) {
    return new Promise(async function (resolve, reject) {
        var taggerData = []

        var testTime1_seconds = 4344

        var testTime1_minutes_method1 = secondsToTimestamp(testTime1_seconds)

        var testTime1_minutes_method2 = convertSecondsToTimestamp(testTime1_seconds)

        var startTimeSeconds = 0;
        var endTimeSeconds = 0;
        for (var i = 0; i < tracklistData.length; i++) {
            let isHeadingTrackBool = await isHeadingTrack(tracklistData[i])
            //if track is not a discogs 'heading' track
            if(!isHeadingTrackBool){
                if(tracklistData[i].duration == ""){
                    taggerData = []
                    var trackData = { title: "Track durations not availiable on every track for this Discogs URL", startTime: "", endTime: ""}
                    taggerData.push(trackData)
                    break
                }else{
                    
                    if( (tracklistData[i].duration.toString(2)).includes(":") ){
                        var trackTimeSeconds = moment.duration(tracklistData[i].duration).asMinutes()
                    }else{
                        var trackTimeSeconds = tracklistData[i].duration
                    }
        
                    var trackTimeMinutes = new Date(trackTimeSeconds * 1000).toISOString().substr(11, 8);
                    endTimeSeconds = parseFloat(endTimeSeconds) + parseFloat(trackTimeSeconds)
        
                
                    //add data to object
                    var trackData = { title: tracklistData[i].title, startTime: secondsToTimestamp(startTimeSeconds), endTime: secondsToTimestamp(endTimeSeconds) }
                    taggerData.push(trackData)
        
                    //end of for loop cleanup
                    startTimeSeconds = startTimeSeconds + trackTimeSeconds
        
                }
                
            }

        }
        resolve(taggerData)

    });
}



function secondsToTimestamp(input) {
    var temp = new Date(input * 1000).toISOString().substr(11, 8);
    return temp
}

async function getTracklistFromDiscogs(discogsListingType, discogsListingCode) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "https://api.discogs.com/" + discogsListingType + 's/' + discogsListingCode,
            type: 'GET',
            contentType: "application/json",
            success: function (data) {
                resolve(data.tracklist)
            },
            error: function (error) { // error callback 
                resolve("error")
            }
        })
    });
}

function convertSecondsToTimestamp(seconds) {
    var duration = moment.duration(seconds, "seconds");
    var time = "";
    var hours = duration.hours();
    if (hours > 0) { time = hours + ":"; }
    var append_s = ""
    var append_m = ""
    if (duration.seconds() < 10) {
        append_s = "0"
    }
    if (duration.minutes() < 10) {
        append_m = "0"
    }
    total_string = time + append_m + duration.minutes() + ":" + append_s + duration.seconds();
    return total_string;
}

/*
~~~~~~~~~~~~~~~~~~~~ legacy code below ~~~~~~~~~~~~~~~~~~~~~~~



//discogs api functions
async function taggerDotSite(input) {
    console.log("taggerDotSite().")
    //parse release id from url
    var index = input.indexOf("release/");
    var releaseID = input.substring(index + 8, input.length);

    //make post request to python function
    var csrftoken = getCookie('csrftoken');
    console.log("csrftoken = ")
    console.log(csrftoken)
    console.log("ajax time")
    document.getElementById("tracklist").innerHTML = ""
    let successValue = await makeAjax(releaseID, csrftoken);

    console.log("successValue = ", successValue)
    console.log("JSON.stringify(successValue) = ", JSON.stringify(successValue))
    //convert to json
    var successValueJson = JSON.parse(JSON.stringify(successValue));
    var tracklist = successValueJson['tracklist']
    console.log("successValueJson['tracklist'] = ", successValueJson['tracklist'])

    for (var i = 0; i < tracklist.length; i++) {
        console.log("i = ", i, ". ", tracklist[i])
        var node = document.createElement("LI");
        var textnode = document.createTextNode(tracklist[i]);
        node.appendChild(textnode);
        document.getElementById("tracklist").appendChild(node);
    }
    //document.getElementById("demo").innerHTML = successValue;

}

function makeAjax(dataVar, csrftoken) {
    console.log("making ajax for tagger discogs url, csrftoken = ", csrftoken, ". dataVar = ", dataVar)
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: '/tagger/discogsURL',
            data: {
                csrfmiddlewaretoken: 'b2MsXtS0SVLNx2GWm55xFnUab9rhY4hw0cVws45rlejd6D6iDjK1I8jc4CEaRX6H',
                data: dataVar
            },
            headers: { 'ACookieAvailableCrossSite': 'SameSite=None' },
            dataType: 'json',
            success: function (msg) {
                console.log("ajax success, returning msg = " + msg)
                resolve(msg)
            }
        });


    });
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    console.log('cookieValue = ', cookieValue)
    return cookieValue;
}

function blah() {
    //document.getElementById("tracklist").innerHTML = htmlFinalTracklistView;
}



function convertSecondsToTimestamp(seconds) {
    var duration = moment.duration(seconds, "seconds");
    var time = "";
    var hours = duration.hours();
    if (hours > 0) { time = hours + ":"; }
    var append_s = ""
    var append_m = ""
    if (duration.seconds() < 10) {
        append_s = "0"
    }
    if (duration.minutes() < 10) {
        append_m = "0"
    }
    total_string = time + append_m + duration.minutes() + ":" + append_s + duration.seconds();
    return total_string;
}

function getSongTitle(song, i) {
    return new Promise(function (resolve, reject) {

        var filename = song.name;
        var n = 0
        n = song.name.lastIndexOf(".")
        filename = filename.substr(0, filename.lastIndexOf("."))

        resolve(filename)
    });
}

function getSongLength(song, i) {
    return new Promise(function (resolve, reject) {
        //create objectURL and audio object for songs[i]
        objectURL = URL.createObjectURL(song);
        mySound = new Audio([objectURL])
        var filename = song.name;
        //when song metadata is loaded:
        mySound.addEventListener("canplaythrough", function (e) {
            var seconds = e.currentTarget.duration;
            resolve(seconds)
        });

    });
}
*/


function getSongLength(song, i) {
    return new Promise(function (resolve, reject) {
        //create objectURL and audio object for songs[i]
        objectURL = URL.createObjectURL(song);
        mySound = new Audio([objectURL])
        var filename = song.name;
        //when song metadata is loaded:
        mySound.addEventListener("canplaythrough", function (e) {
            var seconds = e.currentTarget.duration;
            resolve(seconds)
        });

    });
}

function getSongTitle(song, i) {
    return new Promise(function (resolve, reject) {

        var filename = song.name;
        var n = 0
        n = song.name.lastIndexOf(".")
        filename = filename.substr(0, filename.lastIndexOf("."))

        resolve(filename)
    });
}
