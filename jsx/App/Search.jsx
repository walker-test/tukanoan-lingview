import React from 'react';
import Fuse from 'fuse.js';
import { Sentence } from './Stories/Story/Display/Sentence.jsx';


export class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {searchResults: []};
        this.list = this.props.search_index;
        this.handleInput = this.handleInput.bind(this);
    }

    runSearch (query) {
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
        var fuse = new Fuse(this.list, options); // "list" is the item array
        console.log("Made a fuse...")
        return fuse.search(query);
    }

    handleInput(event) {
        console.log("This?");
        console.log(this);
        console.log("Query:");
        console.log(event.target.value);
        const searchResult = this.runSearch(event.target.value);
        console.log("Search result:");
        console.log(searchResult);
        const displayTable = document.getElementById("searchResults");
        // displayTable.innerHTML = ""; (DON'T DO THIS)
        searchResults = [];
        for (var i = 0, j = searchResult.length; i < j; i++) {
            if ('speaker' in searchResult[i]) {
                let component = (<Sentence sentence={searchResult[i]} true />);
                searchResults.push(component);
            } else {
                let component = (<Sentence sentence={searchResult[i]} false />);
                searchResults.push(component);
            }
        }
        this.setState({searchResults: searchResults});
    }
    render() {
        console.log("rendering...");
        let results = this.state.searchResults;
        return (
          <div>
            <label for="searchInput">Search database:</label> <input id="searchInput" onInput={this.handleInput} type="text"/>
            <div id="searchResults">{results}</div>
          </div>
      )
    };
}

