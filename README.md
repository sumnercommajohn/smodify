# smodify
https://shmotify.sumnercommajohn.now.sh


This is a simple single page app to allow you to clone playlists in your Spotify library and remove multiple songs all at once, rather than one by one.


The original use-case for this project is to let you clone out your Spotify Discover Weekly playlist, a 30-track playlist of songs that Spotify thinks you'll enjoy, refreshed weekly. While this is a great feature, the playlist gets overwritten each week, meaning that if you really like your Discover Weekly playlist on any given week, the only way to save it permanently is to individually add each track to a new playlist.  

Smodify allows you to clone and rename playlists, and perform actions on groups of tracks rather than one at a time. Currently this project allows you to only to clone playlists, edit playlist names and public/private status, and remove songs from playlists. Future versions will include the ability to reorder tracklists and add songs from one playlist to another.


This project is built with React, Webpack and Babel. Follow the link at the top to use the most recently deployed version, or follow the instructions below to install on your own machine.

## Using Smodify
At the landing page, click "Login to Spotify" to be brought to Spotify's authorization page. Smodify needs permission to access your Spotify profile and playlists in order to work with your library.

If you accept, you'll be brought back to the landing page, where your playlists will load in the Sidebar. Click on a playlist to load it into the playlist editor. You can use the buttons under the title to clone or delete/unfollow playlists in your library, as well as to edit the details of playlists owned by you. In the tracklist, select tracks using the checkboxes to bring up the tracklist toolbar. Currently, selected tracks can only be removed from playlists. 

## Setup Smodify on your own machine
Clone or download this repo and install from the command line with `npm install`.
Smodify's authorization flow will only redirect back to whitelisted urls, so if you want to run this client locally it must be served from either `http://localhost:8080/` (dev mode) or `http://localhost:5000/` (production).

## Run in Developer Mode
From the command line, start the webpack development server with `npm run dev`. Smodify should open in a new browser tab.

## Building for Production
You can create a production build of Smodify by running `npm run build` in the command line. The build will output into the public/ directory. Smodify can be served as static files, no backend required.

## Deploying
Serving this app from anywhere other than the two localhost ports listed above requires you to get your own Spotify Client ID. You can do this by creating your own Spotify project at [Spotify for Developers](https://developer.spotify.com/dashboard/). This also requires you to have a Spotify account. 

Once you have created a Project and received a Spotify client ID, open your project in the Spotify Developer Dashboard, and choose 'Edit Settings'. Under 'Redirect URIs', enter the URI where your deployment will be served from. Then, in your local project folder, copy your Spotify Client ID into `src/config/auth.config.js`:

```javascript
export const config = {
  clientId: 'your client ID',
  redirectUri: `${window.location.origin}/`,
};
```

Once you've done this, run the Build script again and Spotify should be able to redirect users back to your deployment after connecting their Spotify account to your client. 

## Deploying to Now
This project is configured to easily deploy to [Zeit's Now platform](https://zeit.co/). 

To deploy to Now, simply install the [Now CLI](https://github.com/zeit/now) globally with `npm i -g now`. Once the CLI is installed, login to your Zeit account with `now login`. Once you've logged in, you can create a deployment with the command `now` for a staging deployment or `now --prod` for a production deployment.
