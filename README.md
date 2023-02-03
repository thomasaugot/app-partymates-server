# Partymates | Full stack MERN application | REST API

![app logo screenshot](/partymates-logo.PNG)

NB: this repository only shows the BACK-END part of the project, for the front-end code, please go to: https://github.com/thomasaugot/app-partymates-client

I developed this application as my third and last project during a full stack web development program at Ironhack.
The application uses all MERN stack technologies:
- Front-End: HTML, CSS, Bootstrap, React
- Back-End: Express, Node.js, MongoDB
The app is interacting with a REST API that I builded.

## What is the app about?

The application is a social media platform that connects users looking for party mates. Users are able to:
- Sign up, log in, log out
- Browse available events
- Indicate that they will be attending specific events.
- Post publicly and interact with other users through private messaging.

## Instructions to run this app in your computer

- clone
- install dependencies: `npm install`
- create a .env file with the following environment variables:
  - PORT (example, PORT=5005)
  - ORIGIN, with the location of your frontend app (example, ORIGIN=https://mycoolapp.netlify.com)
  - TOKEN_SECRET: used to sign auth tokens (example, TOKEN_SECRET=yOuR$EcRetToKEn)
- run the application: `npm run dev`

## API Endpoints

**Auth endpoints**

| HTTP verb   | Path | Request Headers | Request body  | Description |
| ------------- | ------------- | ------------- |------------- | ------------- |
| POST  | /api/auth/signup  | –  | { email: String, password: String, name: String }  | Create an account  |
| POST  | /api/auth/login  | –  | { email: String, password: String }  | Login  |
| GET  | /api/auth/verify  | Authorization: Bearer `<jwt>`  | –  | Verify jwt  |

**User endpoints**

| HTTP verb   | Path | Request Headers | Request body  | Description |
| ------------- | ------------- | ------------- |------------- | ------------- |
| GET  | /api/profile/:userId  | –  | -  | access user profile  |

**Trips endpoints**

| HTTP verb   | Path | Request Headers | Request body  | Description |
| ------------- | ------------- | ------------- |------------- | ------------- |
| POST  | /api/trips  | Authorization: Bearer `<jwt>`  | { description: String }  | Create new trip/post  |
| GET  | /api/trips  | –  | –  | Get all trips  |
| PUT  | /api/trips/:tripId  | Authorization: Bearer `<jwt>` | { description: String }  | Update a trip/post  |
| DELETE  | /api/trips/:tripId  | Authorization: Bearer `<jwt>` | – | Delete a project  |

**Events endpoints**

| HTTP verb   | Path | Request Headers | Request body  | Description |
| ------------- | ------------- | ------------- |------------- | ------------- |
| POST  | /api/events  | Authorization: Bearer `<jwt>`  | { N/A }  | Create new project (Not implemented yet)  |
| GET  | /api/events  | –  | –  | Get all events  |
| GET  | /api/events/:eventId  | –  | – | Get project details  |
| PUT  | /api/events/:eventId  | Authorization: Bearer `<jwt>` | { N/A }  | Update a project (Not implemented yet)  |
| DELETE  | /api/events/:eventId  | Authorization: Bearer `<jwt>`  | – | Delete a project (Not implemented yet) |

**Messages endpoints**

| HTTP verb   | Path | Request Headers | Request body  | Description |
| ------------- | ------------- | ------------- |------------- | ------------- |
| POST  | /api/messages  | Authorization: Bearer `<jwt>` | { recipient: ObjectId, creator: ObjectId, content: String }  | Create new message |
| GET  | /api/messages  | Authorization: Bearer `<jwt>` | –  | Get all messages  |


## Demo

- A demo of the REST API can be found here: https://partymates-server.adaptable.app/
- You can check the deployed project at https://partymates.netlify.app
