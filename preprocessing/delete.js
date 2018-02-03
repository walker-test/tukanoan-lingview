const fs = require("fs");
const inquirer = require("inquirer");
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
	audio_filename = "";
	video_filename = "";
	// Get associated media:
	media = obj[filename]["media"]
	if (media.hasOwnProperty('audio') && media['audio'] != '') {
		audio_filename = "data/media_files/" +  media['audio'];
	}
	if (media.hasOwnProperty('video') && media['video'] != '') {
		video_filename = "data/media_files/" +  media['video'];
	}
	console.log(audio_filename);
	console.log(video_filename);

	///////////////////////////////////
	// Ask to delete video/audio files:
	///////////////////////////////////
	inquirer.prompt([
		// mp3
		{
			"type": "confirm", 
			"name": "delete_audio",
			"message": "Found matching audio file: " + media['audio'] + ". Do you want to delete this file? If this audio file is used by other FLEx/ELAN files, it will be deleted there, too.",
			"default": false,
			"when": 
				function(answers) {
					if (audio_filename != "") {
						return true;
					} else {
						return false;
					}
				}
		},
		{
			"type": "confirm", 
			"name": "delete_video",
			"message": "Found matching video file: " + media['video'] + ". Do you want to delete this file? If this video file is used by other FLEx/ELAN files, it will be deleted there, too.",
			"default": false,
			"when": 
				function(answers) {
					if (video_filename != "") {
						return true;
					} else {
						return false;
					}
				}
		}
	]).then(function (answers) {
		if (answers["delete_audio"]) {
			fs.unlink(audio_filename, function(){}); 
		}
		if (answers["delete_video"]) {
			fs.unlink(video_filename, function(){}); 
		}
	});
	///////////////////////////////////
	// End inquirer
	///////////////////////////////////


	// Removes the index:
	delete obj[filename];
	
	// Removes story gloss from the database:
	stories = DB["stories"];
	for (i=0; i<stories.length; i++) {
		story = stories[i];
		if (story["metadata"]["story ID"] == filename) {
			delete DB["stories"][i];
		}
	}

	// Deletes the JSON file
	json_path = "data/json_files/" + filename + ".json";
	fs.unlink(json_path, function(){});
	
	fs.writeFileSync("data/index.json", JSON.stringify(obj, null, 2));
	DB["index"] = obj;
	fs.writeFileSync("data/database.json", JSON.stringify(DB, null, 2));
	console.log("✅" + "  " + "File successfully deleted!");
} catch(err) {
	console.log("❌" + "  " + "Deletion failed.");
}

