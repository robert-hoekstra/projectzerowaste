# projectzerowaste
College project for visualizing waste data in Amsterdam

## Members
Oemar, Stella & Robert

## Concept
The concept op the zero waste project is to visualize a given dataset. We combine the dataset with rich open data sets available at [Amsterdam Open Data](https://maps.amsterdam.nl/open_geodata).

We aim to create a dashboard that provides new insights to the waste problem in Amsterdam. The dashboard will read and present data in a way the user wants it to.

The dashboard comes with a detailed postalcode area map of Amsterdam and a dateselector.

The user chooses a date and the dashboard will show the waste that was produced within each postalcode area on that given day.
More rubbish means a darker color of the spectrum and vice versa.

Click on an area to learn more about the top ten companies that are based in that area!

Get to know the details of the company. The application provides a lot of information about the #1 company!

## Getting Started

### Live Demo
Follow the GitHub Pages link at the top of this repository.

* Select an area to learn more about.

By clicking on an area you get more details about that specific area

**Note to user:**  Some features are yet to be implemented.

### Local Demo

* 1. Clone this repo
* 2. Navigate to the docs folder
* 3. Open index.html on a localhost.

I use the Live Server Extension in Visual Studio Code
But you can use whatever you prefer to run a localhost!


### Change Data to your own!
It is possible to run the application with your own data!

* Put your csv or json files in the datasets folder within the docs folder.
* Rename your files exactly to the once already in the folder and replace them.



## Features
The application contains a lot of information based on a given dataset.

* Tooltip
  - An interactive way to discover the postal area and rubbish per postal area.

* Day Selector
  - Select any day of your likings. The tooltip will display the proper data the postal area. The data being displayed is the total amount of rubbish produced on that specific day.
  
* Postal Area Selection
  - The surface of the area in square kilometres
  - Total amount of rubbish for the whole week
  - Ratio of the amount of rubbish. (Surface / (Rubbish / Companies))
  - The amount of companies in the selected area
  - The company with the highest amount of rubbish
  
* Future Updates
  - Postal Area's being colored in based on the amount of rubbish it contains compared to the other area's. This way you can easily see if a area is interesting or not.
  - Add functionality of the Evenementen en Markten buttons. Display which area contain an event.
  - When you select a day the map get's refilled with the proper colors. Part of the first nice to have feature.
  - Top 10 companies displayed in a bar chart.


## Resources
* [D3.js](https://d3js.org/)
* [Amsterdam Open Data](https://maps.amsterdam.nl/open_geodata)

## Disclaimer
The data provided on this git is fake and made up. However you can insert any of your local files to the program once you cloned the repo!
