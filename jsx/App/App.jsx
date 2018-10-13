import React from 'react';
import id from 'shortid';
import { Route } from 'react-router-dom';
import { LandingPage } from './LandingPage.jsx';
import { StoryIndex } from './StoryIndex.jsx';
import { Search } from './Search.jsx';
import { Stories } from './Stories/Stories.jsx';

export function App({ data }) {
    return (
        <div>
            <Route exact path="/" render={props => <LandingPage/>} />
            <Route exact path="/index" render={props => <StoryIndex index={data.index} />} />
            <Route path="/story" render={props => <Stories stories={data.stories} />} />
            <Route path="/search" render={props => <Search search_index={data.search_index} />} />
        </div>
    );
}