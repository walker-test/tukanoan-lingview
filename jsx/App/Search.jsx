import React from 'react';
import Fuse from 'fuse.js';


export class Search extends React.Component {
    componentDidMount() {
        const list = this.props;
        function runSearch (query) {
            alert(JSON.stringify(list))
            var options = {
                shouldSort: true,
                findAllMatches: true,
                threshold: 0.4,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: ["text"]
            };
            var fuse = new Fuse(list, options); // "list" is the item array
            return fuse.search(query);
        }

        document.getElementById("searchInput").addEventListener("input", function(e){
            const searchResult = runSearch(this.value);
            const displayTable = document.getElementById("displayTable");
            displayTable.innerHTML = "";
            for (sentence in searchResult) {
                displayTable.innerHTML += `<tr>${sentence.text}</tr>`;
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

