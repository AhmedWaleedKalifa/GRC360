# GRC360

A centralized platform for Governance, Risk, and Compliance management. It replaces fragmented spreadsheets and tools with an integrated system to manage governance documents, track risks, monitor compliance, and record incidents, all in one place.

Setup:

1. cd GRC360

2. Front-End setup
   cd FrontEnd
   npm install
   make .env file
   and put VITE_API_URL and it's value is Back-End url
   npm run dev

3. Back-End setup
   cd BackEnd
   npm install
   make .env file
   and put PORT it's value is Back-End port
   FRONTEND_URL it's value is Front-End url
   DEPLOYED_CONNECTION_STRING it's value is Database connection string value
   npm run db
   npm start
