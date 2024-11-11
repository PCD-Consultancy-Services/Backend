# NodeJS


## Installation Steps

### 1. Install Node.js and npm
To run this project, you need Node.js and npm. Follow these steps:

- **Download and Install Node.js**: Visit https://nodejs.org/ and download the installer for your OS. Run the installer and follow the instructions.
  
- **Verify Installation**: After installation, open a terminal or command prompt and run:
  bash
  node -v


### 2. Clone the Repository
Clone this GitHub repository and navigate into the project folder:

git clone <repository-url>
cd <project-directory>


### 3. Install Dependencies
Install the project’s required npm packages:

npm install


### 4. Create a .env File
In the project root, create a .env file and populate it with the following environment variables:

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



### 5. Setup MongoDB