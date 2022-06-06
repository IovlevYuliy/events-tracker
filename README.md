# Events tracker — Fundraise Up Job Test

## How to build and run service

```sh
git clone git@github.com:IovlevYuliy/events-tracker.git
cd events-tracker
npm install
```

Override local enviroment variables in ```.env``` file if it necessary.

```
DATABASE_URL="mongodb://127.0.0.1:27017/test?authSource=admin" // database connection URL
PORT=8000                                                      // listening port
```

Then run service with command ```npm start``` and open http://localhost:8000/.
