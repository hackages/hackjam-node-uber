# HackLift
## Introduction
In this HackJam you'll learn how to use express, the google directions API as well as socket.io for some real time things.

## Getting Started
First, you need to get a directions API key at [developers.google.com/maps/documentation/directions/get-api-key](https://developers.google.com/maps/documentation/directions/get-api-key)

It's free as long as you make under 2500 requests/day.

Then you're gonna need `ngrok`, if you're on OSX and have `homebrew` installed you can just do `brew cask install ngrok` otherwise you can download it from [https://ngrok.com/](https://ngrok.com/)

The next tool you need is [Postman](https://www.getpostman.com/). This tool is used to test APIs.

Finally, to see your app working in real time, you should install the [mobile app](https://expo.io/@nauktis/hacklift) on your phone.

### Unix/Linux
```Bash
git clone https://github.com/hackages/hackjam-hacklift
yarn
TOKEN=<your api key> yarn dev
```

### Windows
```Batch
set TOKEN=<your api key>
yarn dev
```

## Exercise
### Bootstraping the app
In `src/index.js`, create an app object using the `express()` function then make your app listen on port __8080__

Now, create a `/hello` route that just says 'Hello, world'

You can then use __postman__ to make sure your app works by fetching `http://localhost:8080/hello`

Use __ngrok__ to make your app available remotely by running `ngrok http 8080`

You should plug `bodyParser.json()` in your app to allow your clients to send json objects as the body of their requests.

After plugging it in, you'll have access to it in `req.body`. Try it in postman with your hello route! 

### Writing the routes 🚕
Now that your app is up and running, let's create the routes required for the mobile app to work.

For this exercise you're going to use the `carController` and the `tripController` found in `src/controllers`.

You'll have to validate your requests using the `schemaMiddleware` found in `src/middlewares`.

For each one of them, create a separate router

For the cars:

    - GET /cars (return all the cars)
    - GET /cars/:id (return the car with the id the user passes, eg: /cars/52)
        - (you can even combine them in one route 😉)
    - POST /cars (takes a car object and create a new car)
        - You request should be validated using the JOI carSchema
            - Oh, I forgot, you have to write that schema.
            - It should validate `req.body` for the car request and your request should be an object containing a name property.
    - PATCH /cars/:id (updates a car)


For the trips:

    - GET /trips (return all the trips)
    - POST /trips (creates a new trip)
        - Your request should be validated using the JOI tripSchema
        - The client will send you an object containing a coordinate object
        - The coordinate object will have a latitude and longitude property

#### Pimping your cars (bonus)
Examine the Response you get when you successfuly POST to /cars using Postman, you can overwrite any of those properties (except the UUID) when you create your cars. 


### Middlewares
Now that you know what routes are and that you used a pre written middleware let's write one ourselves 👍

Open `src/middlewares/authMiddleware.js` and find instructions there on how to write that one.

Afterward you should plug it in your app in `src/index.js` 

The second middleware you need to write is the requestLogger one, open `src/middlewares/requestsLogger.js` and follow the instructions

### REAL TIME BABY 🎉
#### Socket.io
Socket.io is a library used in many node.js applications.

It's a library used for web-socket communication.

Start by plugging it in your project: [socket.io/docs](https://socket.io/docs/)

#### Updating the cars
Using socket.io, update the cars for the client. In order to do that you should broadcast on /cars all the cars data (CarsController.getall)

Now, create an interval that'll send the cars on that channel every second.

#### Updating the trips
You can do the same for the trips, every 10 seconds, send all the trips on /trips

#### Making your cars move
Here's a rough idea of what's required:

    - Check if there's any trip that doesn't have a car assigned to it yet
    - If no car has been assigned to it:
        - Assign a random car that is not on a trip yet
    - If the trip has a car but doenst have the directions yet
        - use getDirections (src/libs/maps.js) to get the directions from the origin of the car to the destination
        - Update the trip with the end_coordinates and the steps
            - Steps should be an array of coordinates eg: [{latitude: 45, longitude: 5}, {latitude: 45, longitude: 4.95}]   
    - If the trip has a car and directions:
        - Update the position of the car according to where it is in the trip
            - use geolib.computeDestinationPoint to compute the next position of your car
    - If the car reached the last position of the trip:
        - delete the trip to free the car

You should do all that in an interval so that you update the positions of the car every X second (1 second interval works quite well).


#### Updating your solution
1. Instead of sending any random available car, send the closest one
2. Instead of using the steps contained in the object you received from getDestination to navigate your car to the next destination, decode the polyline stocked in each step and use the result of each decoded polylines as your array of steps, this will make your car follow the road and not just go from A to B
