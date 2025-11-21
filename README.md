Application Startup Procedure

1. Prerequisites
The following software is required to be installed on the local machine:
Node.js (version 14 or higher)
npm (Node Package Manager)



2. Dependency Installation
Navigate to the root directory of the project in a terminal and execute the following command to install all required packages for both the client and server:

- npm install



3. Application Execution
The application’s architecture requires two separate processes to be run concurrently: the backend API server and the frontend client server. This is best executed using two separate terminal instances.

Terminal 1: Backend Server
In the project's root directory, execute the following command to start the backend API:

- npm run server

Upon successful execution, the terminal will display a confirmation message indicating the server is running on port 3001.

Terminal 2: Frontend Client
In a second terminal, also in the project's root directory, execute the following command to start the React development server:

npm start

This will launch the client application, which is accessible via a web browser.



4. Access Points
Once both servers are running, the application can be accessed at the following URLs:
Frontend Application: http://localhost:3000
Backend API Health Check: http://localhost:3001/health