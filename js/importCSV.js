module.exports = function importCSV() {
	
	//create global vars//
	var questions = [];
	var questionTypes =[];
	
	//start reading in files//
	function handleFiles(files) {
      // Check for the various File API support.
      if (window.FileReader) {
          // FileReader are supported.
          getAsText(files[0]);
      } else {
          alert('FileReader is not supported in this browser.');
      }
    }

	//convert to text//
    function getAsText(fileToRead) {
      var reader = new FileReader();
      // Read file into memory as UTF-8      
      reader.readAsText(fileToRead);
      // Handle errors load
      reader.onload = loadHandler;
      reader.onerror = errorHandler;
    }

	//check for errors//
    function loadHandler(event) {
      var csv = event.target.result;
      processData(csv);
    }

	//loop through data, save to array for later access//
    function processData(csv) {
        var allTextLines = csv.split("\n");
        for (var i=0; i<allTextLines.length; i++) {
            var tempQuestion = allTextLines[i].split(",");
                questions.push(tempQuestion[0]);
				questionTypes.push(tempQuestion[1]);
                }
        }

    }

	//return error if issue//
    function errorHandler(evt) {
      if(evt.target.error.name == "NotReadableError") {
          alert("Canno't read file !");
      }
    }
	
	
	
	
	
	
}