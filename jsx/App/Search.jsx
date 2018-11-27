import React from 'react';
import Fuse from 'fuse.js';
import { Sentence } from './Stories/Story/Display/Sentence.jsx';
import { notDeepEqual } from 'assert';


export class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {searchResults: [],
                      showFields: []};
        this.list = this.props.search_index;
        this.handleSearchInput = this.handleSearchInput.bind(this);
    }
    getFields() {
        let fields = []
        document.getElementsByName("fields").forEach(function (e) {
            if (e.checked) fields.push(`dependents.${e.id}.value`);
        });
        return fields
    }

    runSearch (query) {
        const fields = this.getFields();
        console.log(fields);
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
            keys: fields
        };
        console.log("running search");
        var fuse = new Fuse(this.list, options); // "list" is the item array
        console.log("Made a fuse...")
        return fuse.search(query);
    }

    handleSearchInput(event) {
        // console.log("This?");
        // console.log(this);
        // console.log("Query:");
        // console.log(event.target.value);
        const searchResult = this.runSearch(event.target.value);
        // console.log("Search result:");
        // console.log(searchResult);
        const displayTable = document.getElementById("searchResults");
        displayTable.innerHTML = ""; //(DON'T DO THIS)
        // searchResults = [];
        for (var i = 0, j = searchResult.length; i < j; i++) {
                // const speaker = 'speaker' in searchResult[i]
                displayTable.innerHTML += `<p>${JSON.stringify(searchResult[i].text)}</p>`;
        }
        // this.setState({searchResults: searchResults});
    }

    render() {
        console.log("rendering...");
        let results = this.state.searchResults;
        return (
          <div>
            <label for="searchInput">Search database:</label>
                <input id="searchInput" onInput={this.handleSearchInput} type="text"/>
            <br />
            <label>Select Fields   </label>
            <label>Tier 1</label>
                <input id="T1" onChange={this.handleSearchInput} name="fields" type="checkbox" />
            <label>Tier 2</label>
                <input id="T2" onChange={this.handleSearchInput} name="fields" type="checkbox" />
            <label>Tier 3</label>
                <input id="T3" onChange={this.handleSearchInput} name="fields" type="checkbox" />
            <label>Tier 4</label>
                <input id="T4" onChange={this.handleSearchInput} name="fields" type="checkbox" />
            <label>Tier 5</label>
                <input id="T5" onChange={this.handleSearchInput} name="fields" type="checkbox" />
            <label>Tier 6</label>
                <input id="T6" onChange={this.handleSearchInput} name="fields" type="checkbox" />
            <div id="searchResults">{results}</div>
          </div>
      )
    };
}

