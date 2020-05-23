var tagsJsonGlobal = null;
var tagsJsonDisplay = null;

function ShortenBoxTo500(){
    var currentTags = document.getElementById("tagsBox").value;
    var trimmedString = currentTags.substring(0, 500);
    document.getElementById("tagsBox").value = trimmedString
    document.getElementById("charCount").innerText = "Number of characters: " + document.getElementById("tagsBox").value.length.toString();
}

function getValues(id) {
    return new Promise(async function (resolve, reject) {
        var tempVar = '';
        var dataVar = String(id);//'id=' + id;
        var csrftoken = getCookie('csrftoken');

        console.log("getValues()")

        let successValue = await makeAjax(dataVar, csrftoken);

        console.log("getValues(), successValue = " + successValue)

        //var decodedStr = decodeURIComponent(escape(successValue));

        //var parsed = JSON.parse(decodedStr)

        //var parsed = JSON.parse(successValue)

        //console.log("ppppppppppppppppppppparsed = " + parsed)

        resolve(successValue)

    });

}


function makeAjax(dataVar, csrftoken) {
    return new Promise(function (resolve, reject) {
        console.log("making ajax reqeust to get data. header set")
        $.ajax({
            type: "POST",
            url: '/my-ajax-test/',
            headers: { 'ACookieAvailableCrossSite': 'SameSite=None' },
            data: { csrfmiddlewaretoken: 'eVuWLw96AwPdJcQSdgv8kpxGuhhZ1ReP35D0g7mx3PnDiNgeuuaCnaWInKuSUK30', data: dataVar }, //new csrf
        }).done(function callback(response) {
            console.log("ajax request to /my-ajax-test/ was a success !")
            console.log("response = ", response)
            
            console.log("JSON.parse(response) = ", JSON.parse(response))
            //console.log("JSON.stringify(response) = ", JSON.stringify(response))
            //console.log("JSON.loads(response) = ", JSON.loads(response))       //no json.loads function
            //console.log("json.dumps(response, ensure_ascii=False) = ", JSON.dumps(response, ensure_ascii='False'))
            
            resolve(JSON.parse(response))
            //resolve(JSON.stringify(JSON.parse(response)))
            //resolve(JSON.stringify(response))

        }).fail(function (error) {
            console.log("ajax request to /my-ajax-test/ failed!");
            console.log(error)
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
    return cookieValue;
}

function getAllTags(jsonObj) {
    console.log("getAllTags(), jsonObj = " + jsonObj)
    console.log("getAllTags(), jsonObj = " + JSON.stringify(jsonObj))
    //get count of elements in 'tags'
    var count = Object.keys(jsonObj.tags).length;
    var allTags = "";
    for (var key in jsonObj.tags) {
        if (jsonObj.tags.hasOwnProperty(key)) {
            //console.log(key + " -> " + jsonObj.tags[key]);
            if (allTags.includes(jsonObj.tags[key])) {

            } else {
                allTags = allTags + jsonObj.tags[key] + ",";
            }
        }
    }
    return allTags;
}

async function getTags(input) {
    console.log("getTags, input = ", input)

    //parse release id from url
    var urlArr = input.split('/');
    var discogsListingType = urlArr[urlArr.length - 2];
    var discogsListingCode = urlArr[urlArr.length - 1];

    //get tracklistData from discogs API
    let discogsData = await discogsAPIQuery(discogsListingType, discogsListingCode) 
    console.log("discogsData = ", discogsData)

    // ~~~~~~~~ old below ~~~~~~~~~~~~~~~ //
    /*

    //parse release id from url
    var index = input.indexOf("release/");
    var releaseID = input.substring(index + 8, input.length);

    //make ajax request to python for tags based on passed in release id
    let results = await getValues(releaseID);
    console.log("getTags(), results = ", results)

    //convert to json
    var jsonResults = results;

    //store as global variable?
    tagsJsonGlobal = jsonResults;
    tagsJsonDisplay = jsonResults;

    var tagsAll = getAllTags(jsonResults);
    console.log("tagsAll = ", tagsAll);

    var releaseArtistsCheckboxValue = $('.releaseArtistsCheckbox:checked').val();
    var releaseArtistsSliderValue = $('.releaseArtistsSlider').val();

    var releaseInfoCheckboxValue = $('.releaseInfoCheckbox:checked').val();
    var releaseInfoSliderValue = $('.releaseInfoSlider').val();

    var tracklistCheckboxValue = $('.tracklistCheckbox:checked').val();
    var tracklistSliderValue = $('.tracklistSlider').val();

    //var publisherNotesCheckboxValue = $('.publisherNotesCheckbox:checked').val();
    //var publisherNotesSliderValue = $('.publisherNotesSlider').val();

    var combinationsCheckboxValue = $('.combinationsCheckbox:checked').val();
    var combinationsSliderValue = $('.combinationsSlider').val();

    //updateTagsBox(releaseArtistsCheckboxValue, releaseArtistsSliderValue, releaseInfoCheckboxValue, releaseInfoSliderValue, tracklistCheckboxValue, tracklistSliderValue, publisherNotesCheckboxValue, publisherNotesSliderValue, combinationsCheckboxValue, combinationsSliderValue);
    updateTagsBox(releaseArtistsCheckboxValue, releaseArtistsSliderValue, releaseInfoCheckboxValue, releaseInfoSliderValue, tracklistCheckboxValue, tracklistSliderValue, combinationsCheckboxValue, combinationsSliderValue);

    //set tags
    document.getElementById("tagsBox").value = tagsAll;
    //reveal helper stuff
    //document.getElementById("tagsHelperStuff").style.visibility = "visible";
*/
    return false;
}


async function discogsAPIQuery(discogsListingType, discogsListingCode) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "https://api.discogs.com/" + discogsListingType + 's/' + discogsListingCode,
            type: 'GET',
            contentType: "application/json",
            success: function (data) {
                resolve(data)
            },
            error: function (error) { 
                resolve("error")
            }
        })
    });
}


function prepUpdateTagsBox() {
    var releaseArtistsCheckboxValue = $('.releaseArtistsCheckbox:checked').val();
    var releaseArtistsSliderValue = $('.releaseArtistsSlider').val();

    var releaseInfoCheckboxValue = $('.releaseInfoCheckbox:checked').val();
    var releaseInfoSliderValue = $('.releaseInfoSlider').val();

    var tracklistCheckboxValue = $('.tracklistCheckbox:checked').val();
    var tracklistSliderValue = $('.tracklistSlider').val();

    //var publisherNotesCheckboxValue = $('.publisherNotesCheckbox:checked').val();
    //var publisherNotesSliderValue = $('.publisherNotesSlider').val();

    var combinationsCheckboxValue = $('.combinationsCheckbox:checked').val();
    var combinationsSliderValue = $('.combinationsSlider').val();

    //updateTagsBox(releaseArtistsCheckboxValue, releaseArtistsSliderValue, releaseInfoCheckboxValue, releaseInfoSliderValue, tracklistCheckboxValue, tracklistSliderValue, publisherNotesCheckboxValue, publisherNotesSliderValue, combinationsCheckboxValue, combinationsSliderValue);
    updateTagsBox(releaseArtistsCheckboxValue, releaseArtistsSliderValue, releaseInfoCheckboxValue, releaseInfoSliderValue, tracklistCheckboxValue, tracklistSliderValue, combinationsCheckboxValue, combinationsSliderValue);

}

function updateTagsBox(releaseArtistsCheckboxValue, releaseArtistsSliderValue, releaseInfoCheckboxValue, releaseInfoSliderValue, tracklistCheckboxValue, tracklistSliderValue, combinationsCheckboxValue, combinationsSliderValue) {
    //function updateTagsBox(releaseArtistsCheckboxValue, releaseArtistsSliderValue, releaseInfoCheckboxValue, releaseInfoSliderValue, tracklistCheckboxValue, tracklistSliderValue, publisherNotesCheckboxValue, publisherNotesSliderValue, combinationsCheckboxValue, combinationsSliderValue){
    console.log("releaseArtists checkbox = ", releaseArtistsCheckboxValue, ". slider = ", releaseArtistsSliderValue)
    console.log("releaseInfo checkbox = ", releaseInfoCheckboxValue, ". slider = ", releaseInfoSliderValue)
    console.log("tracklist checkbox = ", tracklistCheckboxValue, ". slider = ", tracklistSliderValue)
    //console.log("publisherNotes checkbox = ", publisherNotesCheckboxValue, ". slider = ", publisherNotesSliderValue)
    console.log("combinations checkbox = ", combinationsCheckboxValue, ". slider = ", combinationsSliderValue)

    var tags = "";

    if (releaseArtistsCheckboxValue == 'on') {
        tags = tags + addTags(tagsJsonGlobal.tags.releaseArtist, (releaseArtistsSliderValue / 100));
    }

    if (releaseInfoCheckboxValue == 'on') {
        tags = tags + addTags(tagsJsonGlobal.tags.releaseInfo, (releaseInfoSliderValue / 100));
    }

    if (tracklistCheckboxValue == 'on') {
        tags = tags + addTags(tagsJsonGlobal.tags.tracklist, (tracklistSliderValue / 100));
    }

    //if(publisherNotesCheckboxValue == 'on'){
    //    tags = tags + addTags(tagsJsonGlobal.tags.publisherNotes, (publisherNotesSliderValue / 100));
    //}

    if (combinationsCheckboxValue == 'on') {
        tags = tags + addTags(tagsJsonGlobal.tags.combinations, (combinationsSliderValue / 100));
    }

    document.getElementById("tagsBox").value = tags;
    document.getElementById("charCount").innerText = "Number of characters: " + tags.length.toString();
}

function addTags(tags, percentToInclude) {
    var tempTags = "";

    var numberOfTagsAvailiable = tags.length;
    var numberOfTagsToDisplay = numberOfTagsAvailiable * percentToInclude;
    numberOfTagsToDisplay = ~~numberOfTagsToDisplay;
    for (var i = 0; i < numberOfTagsToDisplay; i++) {
        tempTags = tempTags + tags[i] + ","
    }
    return tempTags;
}

/*
//releaseArtist precentage update : declarations
releaseArtist_i = document.getElementById('releaseArtistsSlider');
releaseArtist_o = document.getElementById('releaseArtistsSliderValue');
releaseArtist_o.innerHTML = releaseArtist_i.value;
//setting initial value
releaseArtist_o.innerHTML = releaseArtist_i.value.toString() + "%";
//listening and setting when slider changes
releaseArtist_i.addEventListener('input', function () {
    releaseArtist_o.innerHTML = releaseArtist_i.value.toString() + "%";
}, false);

//releaseInfo precentage update : declarations
releaseInfo_i = document.getElementById('releaseInfoSlider');
releaseInfo_o = document.getElementById('releaseInfoSliderValue');
releaseInfo_o.innerHTML = releaseInfo_i.value;
//setting initial value
releaseInfo_o.innerHTML = releaseInfo_i.value.toString() + "%";
//listening and setting when slider changes
releaseInfo_i.addEventListener('input', function () {
    releaseInfo_o.innerHTML = releaseInfo_i.value.toString() + "%";
}, false);

//tracklist precentage update : declarations
tracklist_i = document.getElementById('tracklistSlider');
tracklist_o = document.getElementById('tracklistSliderValue');
tracklist_o.innerHTML = tracklist_i.value;
//setting initial value
tracklist_o.innerHTML = tracklist_i.value.toString() + "%";
//listening and setting when slider changes
tracklist_i.addEventListener('input', function () {
    tracklist_o.innerHTML = tracklist_i.value.toString() + "%";
}, false);

//combinations precentage update : declarations
combinations_i = document.getElementById('combinationsSlider');
combinations_o = document.getElementById('combinationsSliderValue');
combinations_o.innerHTML = combinations_i.value;
//setting initial value
combinations_o.innerHTML = combinations_i.value.toString() + "%";
//listening and setting when slider changes
combinations_i.addEventListener('input', function () {
    combinations_o.innerHTML = combinations_i.value.toString() + "%";
}, false);

*/