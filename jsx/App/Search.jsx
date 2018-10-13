import React from 'react';
import Fuse from 'fuse.js';


export class Search extends React.Component {
    componentDidMount() {
        const list = this.props.search_index;
        function runSearch (query) {
            var options = {
                shouldSort: true,
                findAllMatches: true,
                tokenize: true,
                matchAllTokens: true,  
                threshold: 0,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: ["dependents.values.value"]
            };
            console.log("running search");
            var fuse = new Fuse(list, options); // "list" is the item array
            return fuse.search(query);
        }

        document.getElementById("searchInput").addEventListener("input", function(e){
            const searchResult = runSearch(this.value);
            const displayTable = document.getElementById("displayTable");
            displayTable.innerHTML = "";
            for (var i = 0, j = searchResult.length; i < j; i++) {
                displayTable.innerHTML += `<tr>
                <td>${searchResult[i]["text"]}</td>
                <td>${searchResult[i]["speaker"]}</td>
                </tr>`;
            }
        });
    }
    render() {return (
      <div>
          <label for="searchInput">Search database:</label> <input id="searchInput" type="text"/>
          <table id="displayTable"></table>
      </div>
  )};
}

