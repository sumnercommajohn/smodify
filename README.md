# smodify
https://shmotify.sumnercommajohn.now.sh


This is a simple single page app to allow you to clone playlists in your Spotify library and remove multiple songs all at once, rather than one by one.


The original use-case for this project is to let you clone out your Spotify Discover Weekly playlist, a 30-track playlist of songs that Spotify thinks you'll enjoy, refreshed weekly. While this is a great feature, the playlist gets overwritten each week, meaning that if you really like your Discover Weekly playlist on any given week, the only way to save it permanently is to individually add each track to a new playlist.  

Smodify allows you to clone and rename playlists, and perform actions on groups of tracks rather than one at a time. Currently this project allows you to only to clone playlists, edit playlist names and public/private status, and remove songs from playlists. Future versions will include the ability to reorder tracklists and add songs from one playlist to another.


This project is built with React, Webpack and Babel. Follow the link at the top to use the most recently deployed version, or follow the instructions below to install on your own machine.

## Setup
Clone or download this repo and install from the command line with `npm install`.

## Run in Developer Mode
From the command line, start the webpack development server with `npm run dev`. Smodify should open in a new browser tab.

## Getting Started
At the landing page, click "Login to Spotify" to be brought to Spotify's authorization page. Smodify needs permission to access your Spotify profile and playlists in order to work with your library.

If you accept, you'll be brought back to the landing page, where your playlists will load in the Sidebar. Click on a playlist to load it into the playlist editor. 

## Building for Production
You can create a production build of Smodify by running `npm run build` in the command line. The build will output into the public/ directory. Smodify can be served as static files, no backend required.

## Deploying to Now
This project is configured to easily deploy to [Zeit's Now platform](https://zeit.co/). 

To deploy to Now, simply install the Now CLI globally with `npm i -g now`. Once the CLI is installed, login to your Zeit account with `now login`. Once you've logged in, you can create a deployment with the command `now` for a staging deployment or `now --prod` for a production deployment.
