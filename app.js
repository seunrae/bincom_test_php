const { createPool } = require("mysql");
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");


//connect to database
const pool = createPool({
  host: "localhost",
  user: "root",
  password: "Bluecoder_65",
  database: "bincomphptest",
  connectionLimit: 10,
});



app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));



// app.listen(3000, () => {
//   console.log("listening on port 3000");
// });

app.get('/', (req, res) => {
	res.render('index', { selectedOption: null });
  });

app.get("/", (req, res) => {
  const sqlStatement = `Select uniqueid, polling_unit_name from polling_unit`;
  pool.query(sqlStatement, (err, result) => {
    if (err) return console.log(err);
    const data = result;
    console.log(data);
    res.render("index", {data, selectedOption: null, query: null });
  });
});


app.post("/submit", (req, res) => {
  const selectedOption = req.body.selectInput;
  const sqlStatement = `Select party_abbreviation, party_score from announced_pu_results where polling_unit_uniqueid = (?)`;
  pool.query(sqlStatement, [selectedOption], (err, query) => {
	console.log(selectedOption);
    if (err) return console.log(err);
    const sql = `Select uniqueid, polling_unit_name from polling_unit`;
    pool.query(sql, (err, result) => {
      if (err) return console.log(err);
	  const data = result;
      res.render('index', {data, selectedOption, query});
    });
  });
});

app.get("/LGA", (req, res)=>{
	const sql = `SELECT lga_id, lga_name FROM lga`;
	pool.query(sql, (err, data)=>{
		if (err) return console.log(err);
		console.log(data);
		res.render("lga", {data, selectedOption: null, queryResult: null});
	})
});

app.post("/poll", (req, res)=>{
	const selectedOption = req.body.selectInput;
	const sqlStatement = `Select Count('uniqueid') AS record_count FROM polling_unit WHERE lga_id = (?);`
	console.log(selectedOption);
	pool.query(sqlStatement, [selectedOption], (err, queryResult)=>{
		if (err) return console.log(err);
		
		const sql = `SELECT lga_id, lga_name FROM lga`;
		pool.query(sql, (err, data)=>{
			if (err) return console.log(err);
			console.log(data);
			res.render("lga", {data, selectedOption, queryResult});
		});
	})
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
