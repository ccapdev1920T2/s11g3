# TheShop by S11-G3
This is a shopping application. As a user, you may register and log in as a buyer.  
Complete details and features of the application may be found in the program specifications, which may be found [here](https://github.com/ccapdev1920T2/s11g3/blob/master/%5BREVISED%5D%20Group3%20S11%20MP%20Specifications.pdf.pdf).

## Heroku Deployed App
Status: **OFFLINE**  
Link: https://theshoplive.herokuapp.com/

## Important Notes
1. Make sure that MongoDB is installed in your system (for ease of access, ensure that the `.exe` files are installed in the PATH environment variable)
2. Make sure that Node.js is installed in your system
3. Before running the application, make sure to have `mongod.exe` running in the background

## Setting Up and Running Locally
1. Clone the repository through Git with `git clone`
2. In `cmd.exe`, run `mongod.exe` in the background
3. In another `cmd.exe` window, to import the data, run `mongorestore -d TheShop \model\db_import` (or locate the directory is stored)
4. Prepare the npm modules by running `npm install`
5. Set up the Node.js server with `node app.js`
6. Access the application through localhost at port 3000 (`localhost:3000`)
7. Enjoy.

## On Logging In
The following users may be used to log in:
| Username | Password |
|:-----------:|:--------:|
| neallithic64 | helloTesting |
| hoolyuuh | parkJimin143 |
| shannonpooper | hohoho123 |
| joejoejoe | stoopeed |

## Current Dependencies
- [express](https://www.npmjs.com/package/express)
- [express-handlebars](https://www.npmjs.com/package/express-handlebars)
- [express-session](https://www.npmjs.com/package/express-session)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [validator](https://www.npmjs.com/package/validator)
- [express-validator](https://www.npmjs.com/package/express-validator)
- [bcryptjs](https://www.npmjs.com/package/bcrypt)
- [nodemailer](https://www.npmjs.com/package/nodemailer)
- [rand-token](https://www.npmjs.com/package/rand-token)
- [nodemon](https://www.npmjs.com/package/nodemon) (for developmental purposes)

## Members of the Group
- Estella, Julia
- Ho, Shannon
- Lim, Matthew Neal
