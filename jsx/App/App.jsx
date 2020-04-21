import React from 'react';
import id from 'shortid';
import { Route } from 'react-router-dom';
import { LandingPage } from './LandingPage.jsx';
import { StoryIndex } from './StoryIndex.jsx';
import { Stories } from './Stories/Stories.jsx';
import { AboutPage } from './AboutPage.jsx';
import { GlossingAbbrevsRefPage } from './GlossingAbbrevsRefPage.jsx';

export function App({ data }) {
    return (
        <div>
            <Route exact path="/" render={props => <LandingPage/>} />
            <Route exact path="/index" render={props => <StoryIndex index={data.index} />} />
            <Route path="/story" render={props => <Stories stories={data.stories} />} />
            <Route path="/about" render={props => <AboutPage />} />
            <Route path="/abbrevs" render={props => <GlossingAbbrevsRefPage />} />
        </div>
    );
}