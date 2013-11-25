# Test-Table

Testing grounds for a round robin(TurnTable-like) Spotify App

Guidelines for running a developer app can be found at https://developer.spotify.com/technologies/apps/guidelines/developer/

The gist of it follows below

NOTE: You need to enable your Spotify account as a Developer Account.

## Setup

```sh
# You must have the developer flag enabled on your account.  Go here and towards the bottom of the page you will see the login/enable link https://developer.spotify.com/technologies/apps/

# if you are on a mac, make sure you have the ~/Spotify folder created
mkdir ~/Spotify

# and then clone this repo into that directory
git clone https://github.com/mykebates/test-table.git ~/Spotify/test-table

# if you are windows, do the same but create the Spotify directory in your My Documents folder for your user

# once you have that repo cloned down ensure that you have the new "Develop" menu option when you restart Spotify.

# then run the following command in the search box in Spotify(without quotes)
'spotify:app:test-table'

# you can click on "add" which will add to your sidebar, but I have noticed that dev apps frequently get removed from the sidebar so just be sure to log that open command to memory :)
```


### Todo
- ~~Get Pusher Presence channels running so there is info about room members~~
- ~~Get a rough implementation of drag/drop playlists running~~
- Make playlists function in round robin fashion
- Enable album and track in addition to playlist for drag/drop adding
- Jazz up the design - [@bradhilldesign](https://twitter.com/bradhilldesign) amirite?
