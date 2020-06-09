import os
import sys
import os.path
from os import path

import requests
import json
import re
import mutagen
from mutagen.easyid3 import EasyID3
from mutagen.flac import FLAC

#import mutagen
#from mutagen.easyid3 import EasyID3
#from mutagen.id3 import ID3, APIC, ID3NoHeaderError
#from mutagen.mp3 import MP3 

""" Initialize Audacity mod-script-pipe connection: """
if sys.platform == 'win32':
    #print("Initializing mod-script-pipe connection on Windows.")
    TONAME = '\\\\.\\pipe\\ToSrvPipe'
    FROMNAME = '\\\\.\\pipe\\FromSrvPipe'
    EOL = '\r\n\0'
else:
    print("Initializing mod-script-pipe connection on Linux or MAC.")
    TONAME = '/tmp/audacity_script_pipe.to.' + str(os.getuid())
    FROMNAME = '/tmp/audacity_script_pipe.from.' + str(os.getuid())
    EOL = '\n'

""" Audacity mod-script-pipe setup: """
print("Write to  \"" + TONAME +"\"")
if not os.path.exists(TONAME):
    print(" ..does not exist.  Ensure Audacity is running with mod-script-pipe.")
    sys.exit()
print("Read from \"" + FROMNAME +"\"")
if not os.path.exists(FROMNAME):
    print(" ..does not exist.  Ensure Audacity is running with mod-script-pipe.")
    sys.exit()
print("-- Both pipes exist.  Good.")
TOFILE = open(TONAME, 'w')
print("-- File to write to has been opened")
FROMFILE = open(FROMNAME, 'rt')
print("-- File to read from has now been opened too\r\n")

""" Audacity mod-script-pipe functions: """
def do_command(command):
    """ Send one command, and return the response. """
    send_command(command)
    response = get_response()
    #print("Rcvd: <<< \n" + response)
    return response
def send_command(command):
    """Send a single command."""
    #print("Send: >>> \n"+command)
    TOFILE.write(command + EOL)
    TOFILE.flush()
def get_response():
    """Return the command response."""
    result = ''
    line = ''
    while line != '\n':
        result += line
        line = FROMFILE.readline()
    return result

""" Helper functions: """
def begin_bin2dig(flags):
    print("~~ bin2dig ~~ flags = ", flags)
    
    #get input metadata object {}
    if '-i' in flags:
        inputIndex = flags.index('-i')
        inputValueIndex = flags[inputIndex+1]
        if inputValueIndex == 'discogs':
            discogsCode = inputValueIndex = flags[inputIndex+2]
            metadataInput = getDiscogsTags(discogsCode)
            print

        elif inputValueIndex == 'manual':
            metadataInput = getManualTags(True)

    #choose output filepath
    outputFilepath = ""
    if '-o' in flags:
        outputFilepathIndex = flags.index('-o')
        outputFilepath = flags[outputFilepathIndex+1]
    
    #get output format
    outputFormat = ""
    if '-f' in flags:
        outputFormatIndex = flags.index('-f')
        outputFormat = flags[outputFormatIndex+1]
        

    #export Audacity tracks
    print("outputFilepath = ", outputFilepath)
    print("outputFormat = ", outputFormat)
    renderAudacityTracks(metadataInput, outputFilepath, outputFormat)

def renderAudacityTracks(metadataInput, outputLocation, outputFormat):
    #render each track in tracks
    for i in range(1, len(metadataInput["tracks"])):
        title = metadataInput["tracks"][i]
        artist = metadataInput["artist"]
        album = metadataInput["album"]
        year = metadataInput["year"]
        #go to next clip for selection
        do_command('SelNextClip')
        #export selection
        
        #create final output filepath with filename and extension (audacity needs this)
        if sys.platform == 'win32':
            #if outputLocation folder doesn't exist, create it
            if not os.path.exists(outputLocation):
                os.makedirs(outputLocation)
                print('directory created')

            outputFileLocation = outputLocation + '\\' + str(i) + '. ' + title + "." + outputFormat 
        else:
            print('mac/linux option outputfile')
            #if outputLocation folder doesn't exist, create it
            if not os.path.exists(outputLocation):
                os.makedirs(outputLocation)
                print('directory created')
            outputFileLocation = outputLocation + '' + title + "." + outputFormat 
        
        outputFileLocation = os.path.abspath(outputFileLocation)
        print("Rendering file to ", outputFileLocation)
        renderCommand = 'Export2: Mode=Selection Filename="' + outputFileLocation + '" NumChannels=2 '
        cmdResult = do_command(renderCommand)

        #file should be rendered, so now begin tagging process
        if outputFormat == 'flac':
            #wait until file has been completely rendered before tagging
            fileTagged = None 
            while fileTagged is None:
                try:
                    audio = FLAC(outputFileLocation)
                    fileTagged = True
                except:
                    pass
            #title
            audio["title"] = title
            #album
            audio['album'] = album
            #artist
            audio['artist'] = artist
            #year
            audio['date'] = year
            #trackNumber
            audio['tracknumber'] = str(i)
            audio.save()
            

        elif outputFormat == 'mp3':
            print("output format == mp3")
            '''
            #song title
            try:
                audio['title'] = str(metadataInput["tracks"][i])
            except KeyError:
                audio['title'] = ''
            
            #release artist
            try:
                audio['artist'] = str(metadataInput["artist"])
            except KeyError:
                audio['artist'] = ''

            #release title
            try:
                audio['album'] = str(metadataInput["album"])
            except KeyError:
                audio['artist'] = ''

            #release year
            try:
                audio['date'] = str(metadataInput["year"])
            except KeyError:
                audio['date'] = ''

            #release track number
            audio['tracknumber'] = str(i)
            audio.save(outputFileLocation, v1=2)
            
            try:
                audio = EasyID3(outputFileLocation) 
            except mutagen.id3.ID3NoHeaderError:
                print('exception caught')
        
             audio = mutagen.File(outputFileLocation, easy=True)   
            ''' 
        

def slugify(value):
    """
    Remove any chars from string that arent english characters or numbers
    I intend on improving this in the future
    """
    valStr = re.sub('[^A-Za-z0-9()]+', ' ', value)
    return valStr

def getDiscogsTags(discogsURL):
    metadataTags = {}
    #get ID and type from discogsURL
    discogsSplit = discogsURL.rsplit('/', 2)
    discogsID = discogsSplit[-1]
    discogsType = discogsSplit[-2]

    #make discogs api call
    requestURL = 'https://api.discogs.com/' + discogsType + 's/' + discogsID
    print("api request URL = ")
    response = requests.get(requestURL)
    discogsAPIResponse_status_code = response.status_code
    if discogsAPIResponse_status_code == 200:
        print("discogsAPIResponse_status_code == 200")
        #get artist name string
        jsonData = json.loads(response.text)
        #get artist(s) name as string
        artistString = ""
        artistNum = 0
        for artist in jsonData['artists']:
            if artistNum == 0:
                artistString = artist['name']
            else:
                artistString = artistString + ', ' + artist['name']
                artistNum = artistNum + 1
        #remove any int between parenthesis
        artistString = re.sub(r'\(([\d)]+)\)', '', artistString)
        print("artistString = ", artistString)

        #get tracklist
        tracks = []
        tracklist = jsonData['tracklist']
        trackNum = 1
        for track in tracklist:
            if track['type_'] == 'track':
                trackTitle = track['title']
                #sanitize tracktitle
                trackTitle = slugify(trackTitle)
                print("track ", trackNum, ", title = ", trackTitle)
                tracks.append(trackTitle)
                trackNum = trackNum + 1
        
        #get album title
        albumTitle = jsonData['title']
        #get releaseDate
        releaseDate = jsonData['released']
        
    metadataTags = {'album':albumTitle, 'artist':artistString, 'year':releaseDate, 'tracks':tracks }    
    return metadataTags


def getManualTags(debug):
    metadataTags = {}
    if debug:
        metadataTags = {'album':'Circean', 'artist':'Circean', 'year':'1996', 'tracks':['Limbo Land', 'Miles Away', 'Hide and Seek', 'Canvas', 'His Holographic Image', 'Action Pose', 'Paper boat race', 'Quintet and Snow', 'Unintrestable Clous', 'Sonorous', 'Faraway So Close', 'Bloody Hands'] }    
    else:  
        #prompt for album title
        album = input("Enter album title: ")
        #prompt for artist name
        artistName = input("Enter artist name: ")
        #prompt for year
        year = input("Enter release date year: ")
        #prompt for number of tracks
        numberOfTracks = input("Number of tracks for this album: ")
        #get trackTitle for each track
        trackTitles = []
        for i in range(1, int(numberOfTracks)+1):
            trackTitle = input('Enter track (%d) title: ' % i)    
            trackTitles.append(trackTitle)
        #contruct metadataTags
        metadataTags = {'album':album, 'artist':artistName, 'year':year, 'tracks':trackTitles }

    return metadataTags


""" Begin script: """
if '-bin2dig' or '-dig2vid' in sys.argv:
    #set default indexes
    bin2digIndex = len(sys.argv)
    bin2digFlags = []

    dig2vidIndex = len(sys.argv)
    dig2vidFlags = []

    #get flags / args for bin2dig or dig2vid
    if '-bin2dig' in sys.argv:
        bin2digStartIndex = sys.argv.index('-bin2dig')
        argsSplice1 = sys.argv[bin2digStartIndex:len(sys.argv)]
        if '-dig2vid' in argsSplice1:
            dig2vidIndex = argsSplice1.index('-dig2vid')
            bin2digFlags = argsSplice1[0:dig2vidIndex]
        else:
            bin2digFlags = argsSplice1[0:len(argsSplice1)]
        #execute flags
        begin_bin2dig(bin2digFlags)

    if '-dig2vid' in sys.argv:
        dig2vidStartIndex = sys.argv.index('-dig2vid')
        argsSplice1 = sys.argv[dig2vidStartIndex:len(sys.argv)]
        if '-bin2dig' in argsSplice1:
            bin2digIndex = argsSplice1.index('-bin2dig')
            dig2vidFlags = argsSplice1[0:bin2digIndex]
        else:
            dig2vidFlags = argsSplice1[0:len(argsSplice1)]
        #execute flags
        #begin_dig2vid(dig2vidFlags)

if '-t' in sys.argv:
    print("Test Audacity mod-script-pipe connection:")
    do_command('Help: Command=Help')
    do_command('Help: Command="GetInfo"') 




