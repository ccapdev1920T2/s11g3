# TheShop by S11-G3
This is a shopping application. As a user, you may register and log in as a buyer.  
Complete details and features of the application may be found in the program specifications, which may be found [here](https://github.com/ccapdev1920T2/s11g3/blob/master/%5BREVISED%5D%20Group3%20S11%20MP%20Specifications.pdf.pdf).

## Important Notes
1. Make sure that MongoDB is installed in your system (for ease of access, ensure that the `.exe` files are installed in the PATH environment variable)
2. Make sure that Node.js is installed in your system
3. Before running the application, make sure to have `mongod.exe` running in the background

## Setting Up and Running
1. Clone the repository through Git with `git clone`
2. Run `mongod.exe` in the background
3. To import the data, run `mongorestore -d TheShop \model\db_import` (or wherever the directory is stored)
4. Prepare the npm modules by running `npm install`
5. Set up the Node.js server with `node app.js`
6. Access the application through localhost at port 3000

## On Logging In
The following users may be used to log in:
| E-mail | Password |
|:-----------:|:--------:|
|  |  |
|  |  |
|  |  |
|  |  |

## Current Dependencies
- Express
- Express-Handlebars
- Express-Session
- Body-Parser
- Cookie-Parser
- Dotenv
- Mongoose
- validator.js
- express-validator
- bcryptjs
- Nodemon (for developmental purposes)

## Members of the Group
- Estella, Julia
- Ho, Shannon
- Lim, Matthew Neal
