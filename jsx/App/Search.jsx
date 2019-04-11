import React from 'react';
import Fuse from 'fuse.js';
import { SearchSentence } from './Stories/Story/Display/Sentence.jsx';


export class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = { "searchResults": [] };
        this.list = this.props.search_index;
        this.runSearch = this.throttle(this.search, 300, this);
    }

    throttle(fn, threshhold, scope) {
        /*
        Takes in a function, threshold, and scope and returns a new
        function which will apply fn, at max, once per threshold
        credit: https://remysharp.com/2010/07/21/throttling-function-calls
        */
        var deferTimer;
        return function () {
            var context = scope || this;

            var args = arguments;
            
            if (deferTimer) clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                return fn.apply(context, args);
            }, threshhold);
        };
    }

    build_fuse() {
        let fields = [];
        document.getElementsByName("fields").forEach(function (e) {
            if (e.checked) fields.push(`dependents.${e.id}.value`);
        });
        console.log(fields);
        console.log(this.list);

        var options = {
            shouldSort: true,
            findAllMatches: true,
            tokenize: true,
            matchAllTokens: true,
            threshold: 30,
            distance: 0,
            maxPatternLength: 64,
            minMatchCharLength: 1,
            keys: fields
        };
        
        console.log("running search over: " + fields);
        return new Fuse(this.list, options) // "list" is the item array
    }

    search(rebuild=true) {
        if (rebuild || !this.fuse) this.fuse = this.build_fuse();
        let input = document.getElementById("searchInput");
        if (input) {
            var query = input.value;
        } else {
            return;
        }
        let searchResult = this.fuse.search(query).slice(0, 25);

        console.log("Search result:");
        console.log(searchResult);
        // const displayTable = document.getElementById("searchResults");
        // displayTable.innerHTML = ""; (DON'T DO THIS)
        let searchResults = [];
        for (var i = 0, j = searchResult.length; i < j; i++) {
            if ('speaker' in searchResult[i]) {
                let component = (<SearchSentence sentence={searchResult[i]} true />);
                searchResults.push(component);
            } else {
                let component = (<SearchSentence sentence={searchResult[i]} false />);
                searchResults.push(component);
            }
        }
        this.setState({ "searchResults": searchResults });
    }

    handleInputChange() {
        this.runSearch(false);
    }

    render() {
        let results = this.state.searchResults;
        console.log("rendering...");
        return (
            <div id="searchForm">
                <label for="searchInput">Search database:</label> <input id="searchInput" onChange={this.handleInputChange.bind(this)} type="text" />
                <br />
                <label>Select Fields:   </label>
                <input id="H1_Transcripción" name="fields" type="checkbox" onChange={this.search.bind(this)} defaultChecked />
                <label>H1_Transcripción</label>&nbsp;&nbsp;
                <input id="H2_Trarscripción" name="fields" type="checkbox" onChange={this.search.bind(this)} defaultChecked />
                <label>H2_Transcripción</label>&nbsp;&nbsp;
                <input id="H1_Maya" name="fields" type="checkbox" onChange={this.search.bind(this)} defaultChecked />
                <label>H1_Maya</label>&nbsp;&nbsp;
                <input id="H2_Maya" name="fields" type="checkbox" onChange={this.search.bind(this)} defaultChecked />
                <label>H2_Maya</label>&nbsp;&nbsp;
                <input id="H1_Traducción" name="fields" type="checkbox" onChange={this.search.bind(this)} defaultChecked />
                <label>H1_Traducción</label>&nbsp;&nbsp;
                <input id="H2_Traducción" name="fields" type="checkbox" onChange={this.search.bind(this)} defaultChecked />
                <label>H2_Traducción</label>
                <br />
                <div id="searchResults">{results}</div>
            </div>
        )
    };
}
