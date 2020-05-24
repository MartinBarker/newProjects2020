var tagsJsonGlobal = null;
var tagsJsonDisplay = null;

$(document).ready(function () {
    //function to make sure hitting 'enter' key submits input box
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            document.getElementById("urlInputButton").click();
            return false;
        }
    });

    //when release artist slider changes
    $('#releaseArtistsSlider').on('input', function() {
        prepUpdateTagsBox()
    })
    //when releaseInfo slider changes
    $('#releaseInfoSlider').on('input', function() {
        prepUpdateTagsBox()
    })
    //when tracklist slider changes
    $('#tracklistSlider').on('input', function() {
        prepUpdateTagsBox()
    })
    //when combinations slider changes
    $('#combinationsSlider').on('input', function() {
        prepUpdateTagsBox()
    })


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

})

async function getTags(input) {
    console.log("getTags, input = ", input)

    //reset table slider values
    document.getElementById('releaseArtistsSlider').value = 100;
    document.getElementById('releaseArtistsSliderValue').innerHTML = `100%`;
    document.getElementById('releaseInfoSlider').value = 100;
    document.getElementById('releaseInfoSliderValue').innerHTML = `100%`;
    document.getElementById('tracklistSlider').value = 100;
    document.getElementById('tracklistSliderValue').innerHTML = `100%`;
    document.getElementById('combinationsSlider').value = 100;
    document.getElementById('combinationsSliderValue').innerHTML = `100%`;

    //parse release id from url
    var urlArr = input.split('/');
    var discogsListingType = urlArr[urlArr.length - 2];
    var discogsListingCode = urlArr[urlArr.length - 1];

    //get tracklistData from discogs API
    let discogsData = await discogsAPIQuery(discogsListingType, discogsListingCode) 
    console.log("discogsData = ", discogsData)

    //get releaseArtist tags
    let releaseArtistTags = ['tag1', 'tag2']

    //get releaseInfo tags
    let releaseInfoTags = ['releaseinfo1', 'releaseinfo2']

    //get tracklist tags
    let tracklistTags = ['track1', 'track2', 'track3']

    //get combinations tags
    let combinationsTags = ['combos1', 'combos2', 'combos3']

    var jsonResults = {'tags':{'releaseArtist':['a', 'b', 'rr', 'tt', 'pp', '90'], 'releaseInfo':[], 'tracklist':['e', 'f'], 'combinations':['g', 'h']}};
    console.log("jsonResults = ", jsonResults)

    //store as global variable?
    tagsJsonGlobal = jsonResults;
    tagsJsonDisplay = jsonResults;

    //convert tags json object to comma seperated string var
    var tagsAll = getAllTags(jsonResults);
    console.log("tagsAll = ", tagsAll);

    var releaseArtistsCheckboxValue = $('.releaseArtistsCheckbox:checked').val();
    var releaseArtistsSliderValue = $('.releaseArtistsSlider').val();

    var releaseInfoCheckboxValue = $('.releaseInfoCheckbox:checked').val();
    var releaseInfoSliderValue = $('.releaseInfoSlider').val();

    var tracklistCheckboxValue = $('.tracklistCheckbox:checked').val();
    var tracklistSliderValue = $('.tracklistSlider').val();

    var combinationsCheckboxValue = $('.combinationsCheckbox:checked').val();
    var combinationsSliderValue = $('.combinationsSlider').val();

    updateTagsBox(releaseArtistsCheckboxValue, releaseArtistsSliderValue, releaseInfoCheckboxValue, releaseInfoSliderValue, tracklistCheckboxValue, tracklistSliderValue, combinationsCheckboxValue, combinationsSliderValue);

    //set tags
    document.getElementById("tagsBox").value = tagsAll;

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



// ~~~~~~~~~~~~~~~~~~~~~~~ OLD CODE BELOW ~~~~~~~~~~~~~~~ //

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

function prepUpdateTagsBox() {
    var releaseArtistsCheckboxValue = $('.releaseArtistsCheckbox:checked').val();
    var releaseArtistsSliderValue = $('.releaseArtistsSlider').val();

    var releaseInfoCheckboxValue = $('.releaseInfoCheckbox:checked').val();
    var releaseInfoSliderValue = $('.releaseInfoSlider').val();

    var tracklistCheckboxValue = $('.tracklistCheckbox:checked').val();
    var tracklistSliderValue = $('.tracklistSlider').val();

    var combinationsCheckboxValue = $('.combinationsCheckbox:checked').val();
    var combinationsSliderValue = $('.combinationsSlider').val();

    //updateTagsBox(releaseArtistsCheckboxValue, releaseArtistsSliderValue, releaseInfoCheckboxValue, releaseInfoSliderValue, tracklistCheckboxValue, tracklistSliderValue, publisherNotesCheckboxValue, publisherNotesSliderValue, combinationsCheckboxValue, combinationsSliderValue);
    updateTagsBox(releaseArtistsCheckboxValue, releaseArtistsSliderValue, releaseInfoCheckboxValue, releaseInfoSliderValue, tracklistCheckboxValue, tracklistSliderValue, combinationsCheckboxValue, combinationsSliderValue);

}

function updateTagsBox(releaseArtistsCheckboxValue, releaseArtistsSliderValue, releaseInfoCheckboxValue, releaseInfoSliderValue, tracklistCheckboxValue, tracklistSliderValue, combinationsCheckboxValue, combinationsSliderValue) {
    console.log("releaseArtists checkbox = ", releaseArtistsCheckboxValue, ". slider = ", releaseArtistsSliderValue)
    console.log("releaseInfo checkbox = ", releaseInfoCheckboxValue, ". slider = ", releaseInfoSliderValue)
    console.log("tracklist checkbox = ", tracklistCheckboxValue, ". slider = ", tracklistSliderValue)
    console.log("combinations checkbox = ", combinationsCheckboxValue, ". slider = ", combinationsSliderValue)

    var tags = "";

    if (releaseArtistsCheckboxValue == 'on') {
        tags = tags + addTags(tagsJsonGlobal.tags.releaseArtist, (releaseArtistsSliderValue / 100)).tags;
        document.getElementById('releaseArtistsNumber').innerHTML = addTags(tagsJsonGlobal.tags.releaseArtist, (releaseArtistsSliderValue / 100)).length;
    }else{
        document.getElementById('releaseArtistsNumber').innerHTML = "0"
    }
    
    if (releaseInfoCheckboxValue == 'on') {
        tags = tags + addTags(tagsJsonGlobal.tags.releaseInfo, (releaseInfoSliderValue / 100)).tags;
        document.getElementById('releaseInfoNumber').innerHTML = addTags(tagsJsonGlobal.tags.releaseInfo, (releaseInfoSliderValue / 100)).length;
    }else{
        document.getElementById('releaseInfoNumber').innerHTML = "0"
    }

    if (tracklistCheckboxValue == 'on') {
        tags = tags + addTags(tagsJsonGlobal.tags.tracklist, (tracklistSliderValue / 100)).tags;
        document.getElementById('tracklistNumber').innerHTML = addTags(tagsJsonGlobal.tags.tracklist, (tracklistSliderValue / 100)).length;
    }else{
        document.getElementById('tracklistNumber').innerHTML = "0"
    }

    if (combinationsCheckboxValue == 'on') {
        tags = tags + addTags(tagsJsonGlobal.tags.combinations, (combinationsSliderValue / 100)).tags;
        document.getElementById('combinationsNumber').innerHTML = addTags(tagsJsonGlobal.tags.combinations, (combinationsSliderValue / 100)).length;
    }else{
        document.getElementById('combinationsNumber').innerHTML = "0"
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
    return {tags:tempTags, length:numberOfTagsToDisplay};
}


