# NodeJS


## Installation Steps

### 1. Install Node.js and npm
To run this project, you need Node.js and npm. Follow these steps:

- **Download and Install Node.js**: Visit https://nodejs.org/ and download the installer for your OS. Run the installer and follow the instructions.
  
- **Verify Installation**: After installation, open a terminal or command prompt and run:
  bash
```
  node -v
```

### 2. Clone the Repository
Clone this GitHub repository and navigate into the project folder:
```
git clone <repository-url>
cd <project-directory>
```

### 3. Install Dependencies
Install the project’s required npm packages:
```
npm install
```

### 4. Create a `.env` File
In the project root, create a `.env` file and populate it with the following environment variables:

```env
# Environment
NODE_ENV=production

# React Server Configuration
PORT=4000
SERVER_URL=""
WEB_CLIENT_URL="http://localhost:5173" # Adjust if different

# MongoDB Configuration
MONGODB_URL=mongodb://127.0.0.1:27017/sarla_local

# Encryption
BCRYPT_SALT=10

# Email Configuration
SMTP_EMAIL_SERVICE=1 # (1 => ON, 0 => OFF)
ERROR_REPORT_TO=a@a.com
ERROR_REPORT_CC="a@a.com"

SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=lorine.wintheiser61@ethereal.email
SMTP_PASSWORD=VSMQbbXNhr3hCMrwwT

# JWT Configuration
JWT_SECRET="sarlaSecret@#123"
JWT_DEFAULT_EXPIRATION=7200
JWT_ACCESS_EXPIRATION="2h"
JWT_REFRESH_EXPIRATION="8h"
JWT_RESET_PASSWORD_EXPIRATION="15m"
```


### 4.1 Install MongoDB and Create Database
# Install MongoDB
Follow the official MongoDB installation guide or the video tutorial:

- Documentation: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/
-  YouTube Tutorial: https://www.youtube.com/watch?app=desktop&v=gB6WLkSrtJk

# Create sarla_db Database
- After MongoDB is installed and running, open the MongoDB Shell or a client like MongoDB Compass.

- In the MongoDB Shell, create and switch to the sarla_db database by running:
```
use sarla_db
```
- MongoDB will create the database the first time you insert data into it.

# Update .env with the New Database URL
```
MONGODB_URL=mongodb://127.0.0.1:27017/sarla_db
```


### 4.2. Set Up SMTP Email with Ethereal
To use SMTP for email services, follow these steps:

- Go to Ethereal Email Creation Page - https://ethereal.email/create.

- Fill out the form with a name and password to generate an email account. After creating the account, you’ll receive SMTP details (SMTP server, port, username, and password).

- Copy the generated SMTP details and update the .env file with the new credentials:
```
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=<your-ethereal-email>@ethereal.email
SMTP_PASSWORD=<your-ethereal-email-password>
```

### 4.3 Change Email IDs in .env File
In the .env file, update the ERROR_REPORT_TO and ERROR_REPORT_CC with your email addresses:
```
ERROR_REPORT_TO=a@a.com
ERROR_REPORT_CC="a@a.com"
```

Replace a@a.com with the appropriate email addresses you want to use for error reporting.


### 5. Start the Application
To start the server, run: goto root direct of backend
```
node src/app.js

```