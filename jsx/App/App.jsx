import React from 'react';
import id from 'shortid';
import { Route } from 'react-router-dom';
import { LandingPage } from './LandingPage.jsx';
import { AboutPage } from './AboutPage.jsx';
import { GlossaryPage } from './GlossaryPage.jsx';
import { StoryIndex } from './StoryIndex.jsx';
import { Stories } from './Stories/Stories.jsx';

export function App({ data }) {
    return (
        <div>
            <Route exact path="/" render={props => <LandingPage/>} />
            <Route exact path="/about" render={props => <AboutPage/>} />
            <Route exact path="/glossary" render={props => <GlossaryPage/>} />
            <Route exact path="/index" render={props => <StoryIndex index={data.index} />} />
            <Route path="/story" render={props => <Stories stories={data.stories} />} />
        </div>
    );
}
