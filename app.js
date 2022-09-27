const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const app = express();
const dbPath = path.join(__dirname, "covid19India.db");
app.use(express.json());
let database = null;
const initializeDbAndServer = async () => {
  try {
    database = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("Server Is running on http://localhost:3000");
    });
  } catch (error) {
    console.log(`Data base Error is ${error}`);
    process.exit(1);
  }
};
initializeDbAndServer();

const convertDbObject = (objectItem) => {
  return {
    stateId: objectItem.state_id,
    stateName: objectItem.state_name,
    population: objectItem.population,
    districtId: objectItem.district_id,
    districtName: objectItem.district_name,
    cases: objectItem.cases,
    cured: objectItem.cured,
    active: objectItem.active,
    deaths: objectItem.active,
  };
};

app.get("/states/", async (request, response) => {
  const getStatesQuery = `
    select * from state `;
  const getStatesQueryResponse = await database.all(getStatesQuery);
  response.send(
    getStatesQueryResponse.map((eachState) => convertDbObject(eachState))
  );
});

app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;
  const getStateDetailsQuery = `
    select * from state 
    where state_id = ${state_id};
    `;
  const getStateDetailsResponse = await database.all(getStateDetailsQuery);
  response.send(convertDbObject(getStateDetailsResponse));
});

app.post("/districts/", async (request, response) => {
  const { districtName, stateId, cases, cured, active, deaths } = request.body;
  const createDistrictQuery = `
    insert into district(district_name, state_id, cases, cured, active, deaths)
    values ('${district_name}', '${state_id}', '${cases}', '${cured}', 
    '${active}', '${deaths}');
    `;
  const createDistrictResponse = await database.run(createDistrictQuery);
  response.send(`District Successfully Added`);
});

module.exports = app;
