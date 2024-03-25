## Problem Statement
Tourism and City Exploration: Design a website or mobile app using HERE Location Services and Mobile SDKs that offers guided tours, historical information, and interactive maps for tourists exploring a city

## Solution

The application provides a one stop solution for users to access all the nearby points of interest for a given location, which can be automatically detected or manually entered to help the user plan out their trip much more easily. The application provides historical data for each landmark present nearby and also specifies the nearest healthcare centers in case of emergencies. The most distinguishing feature of our web application is the presence of a guided tour, which allows users to choose the points of interest they would like to visit and include them in a list. The final output will be the optimal path for the entire trip in  order to efficiently visit all the points, keeping in mind the routes taking the minimum time. It also takes into consideration the closing time for each point, outputting the places that can be visited based on the user's preferred amount of time spent at each location.

## Link to the Solution : 
https://urbandiscover.vercel.app/

## Map Rendering: 

We used the React component for Leaflet, an open-source JavaScript library for mobile-friendly interactive maps, offering users to choose their map providers from either HERE maps or OpenStreetMap depending on their use case. Dark mode and light on mode on the maps was achieved by simple CSS on the Tile Layer, providing a clean and interactive map experience for the users.

## APIs used:
1. The ‘discover’ endpoint of Geocoding and Search API v7 to get the locations of tourist places and also basic information about them. We used the searching for a place using category method to get a list of tourist places.
2. The ‘autosuggest’ endpoint to get the autosuggest work in the search bar. We filtered the suggestions we got to just display the countries, major cities and districts.

