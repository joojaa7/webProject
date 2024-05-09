# webProject

Mikael Asikainen, Johannes Liikanen, Jimi Pettilä

## API documentation

[API](https://users.metropolia.fi/~mikaelea/API/)

## Installation

Clone the git repository to a local folder
```
git clone https://github.com/joojaa7/webProject.git

```
Install [Node.js](https://nodejs.org/en) LTS version

Go to the folder you cloned the repository to and run
```
npm init -y
```
Install all the dependencies by running

```
npm i bcrypt cors dotenv express jsonwebtoken multer mysql2 nodemon
```
Create a database using the web_project.sql script

Create a .env file in the root of the folder and add the following lines

```
DB_HOST=yourdatabasename
DB_USER=userforthedatabase
DB_PASSWORD=password
DB_NAME=nameofthedatabase
JWT_SECRET=arandomsetofcharacters
```
Go to main.js, login.js and variables.js and change the baseUrl

```
from:

//const baseUrl = 'http://127.0.0.1:3001/';
const baseUrl = "https://10.120.32.51/web/";

to:

const baseUrl = 'http://127.0.0.1:3001/';
//const baseUrl = "https://10.120.32.51/web/";
```

To start up the backend run

```
npm start

OR

npm run dev
```

Alternatively clone the [backend](https://github.com/joojaa7/webProject_backend) separately and run
```
npm start

OR

npm run dev
```
in the backend folder.

Open the webpage by opening index.html file.

## Project Scope

The application is a restaurants' web page, intended to be used by both customers and staff of the restaurant.

After entering the page a user can browse the menus for different days.

User can click the register button to create an account and log in.

Once logged in, the user can add items to the shopping cart and choose 'checkout' to finalize the purchase.

The logged in user can also set and manage their profile picture, update contact information, view their ordery history and delete their account.

The staff of the restaurant will be granted the admin role, with access to additional features:

- Manage table reservations
- Add and remove burgers
- Add menus to different dates
- Manage pending orders
- Post special offers that will be displayed on the main page


