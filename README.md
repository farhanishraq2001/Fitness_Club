Create a dev.env file in the ..\Fiteness_Club\Application directory with the following values
  USER=postgres
  HOST=localhost
  DATABASE=YOUR Database Name
  PASSWORD=YOUR Database Password
  PORT=5432 <-- default port, yours may be different

ER Diagram and Schema explanation
https://youtu.be/7M7PKK0ilXY

Required softwares: For all the software bellow go through the setup process with default/preselected settings

PostgreSQL/pgAdmin4: https://www.postgresql.org/download/

node.js : https://nodejs.org/en

Git : https://git-scm.com/downloads

VSCode : https://code.visualstudio.com/download

Folders:
Application: Contains the files for the CRUD web application utilizing REST API to query the PostgreSQL DB

SQL : Contains the DDL and DML files to setup the student table

Run instructions:

Have all the tables created in the SQL DB using the DDL file and populate it using the DML file
In your desired folder, open git bash and run the following command: git clone https://github.com/farhanishraq2001/Fitness_Club.git
Inside the Application folder create the dev.env file, add appropriate fields as stated above and hit save. 
While having pgAdmin4 open, open the Student-SQLDB-Application folder in the VSCode, then open the Application folder integrated terminal and then type node server.js and hit enter as shown in the video You can do this step using other terminals as well, you just have to make sure to be in the ..\Fitness_Club\Application directory
Now the server should be running at localhost:3000/members You can now interact with the server
To end the server, simply head back to the terminal where you typed node server.js. Here hold control + c (for Windows) or command + c (for Mac) on your keyboard
Video Demo showcasing the application being run: (https://youtu.be/mtuBgUhp274)
