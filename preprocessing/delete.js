const fs = require("fs");
let obj = JSON.parse(fs.readFileSync("data/index.json", "utf8"));
let DB = JSON.parse(fs.readFileSync("data/database.json", "utf8"));

let filename;
let data;

process.argv.forEach(function (val, index, array) {
  if (index === 2) {
		filename = val;
	} else if (index === 3) {
		console.log("Too many arguments. Continuing anyway...");
	}
});


try {
	delete obj[filename];
	fs.writeFileSync("data/index.json", JSON.stringify(obj, null, 2));
	DB["index"] = obj;
	fs.writeFileSync("data/database.json", JSON.stringify(DB, null, 2));
	console.log("✅" + "  " + "File successfully deleted!");
} catch(err) {
	console.log("❌" + "  " + "Deletion failed.");
}

