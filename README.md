# Bamsemi: Find 24 hours cafe in Seoul (ver 0.0.2)

This web app is for the designers, developers, students, and all the people who need to find nearby 24-hour cafes in Seoul. There are a couple of apps providing location data to people like Google map and Naver map & Daum map (Big search engine companies in the South korea). I realized that they doesn't provide options for searching 24 hour cafes by their services. That's why I decided to make this for some people who want to find them.

## Online

<a href="https://bamsemi-efb21.firebaseapp.com" target="_blank">Bamsemi</a>


## Features

* Find nearby 24-cafe by clicking geolocation button
* Filter by brands
* Get a tip of good place around 24-hour cafe with the Foursquare API
* Mobile first design
* Provide general info of cafe

## Get started

1. Download or clone the repository
2. Install dependecis for setting up the task runner, Gulp.
  * Type following command in your terminal. It will set up all required dependencies for your development and production by package.json files
'''
npm install
'''
3. Next, type following command to set up automated workflow using the Grunt.
'''
grunt
'''
4. Cool! Everything for starting your work is set up. Just make changes in the src directory, then the changes automatically applied to files in the dist directory.
5. Run the app locally in simple way.
  * Move to dist directory to use optimized version of the app, and type following command.
'''
python -m SimpleHTTPServer
'''
  * Now, you can access the app via "localhost:8000" (This port number can be varied, pay attention to the terminal)
6. That's it. Have fun!


## Environments

1. **Knockout JS** - MVVM framework
2. **Google map API** - Map API used to give main information
3. **Material bootstrap** - UI framework for material design
4. **Bootstrap** - UI framework used to render UI component
5. **Jquery** - JS library used to use AJAX for API Request
6. **Foursquare API** - API for getting location information
7. **Gulp** - Task runner used to make workflow automated
8. **Bower** - Package manager used to manage dependencies
6. **Firebase** - BaaS cloud service used to handle with back-end


## To be updated

1. Make korean version
2. Remove bootstrap and material kit for optimization
3. Add filter by district


## Reflection

It's been way more difficult than I expected so that I come to learn a lot.

1. I got used to use MV* pattern framework.
  + I became to want to use other frameworks like Angular, React.
2. Optimization should be considered before cosmetic problems.
  + It's too heavy now so that It takes a lot of time to load up the page.
3. Learning gulp and bower to make my workflow simple
  + Let's make these a way of life
4. Deploying apps with firebase
  + It's simple and fast, but hosting custom domain.


## Update log

2016 - 09 - 09 : Release ver 0.0.2
