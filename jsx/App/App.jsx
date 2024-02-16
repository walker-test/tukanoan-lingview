import React from 'react';
import id from 'shortid';
import { Route } from 'react-router-dom';
import { LandingPage } from './LandingPage.jsx';
import { StoryIndex } from './StoryIndex.jsx';
import { Stories } from './Stories/Stories.jsx';
import { About } from './About.jsx';
import { Contact } from './Contact.jsx';
import { Mapview } from './Mapview.jsx';

export function App({ data }) {
    return (
        <div>
            <Route exact path="/LandingPage" render={props => <LandingPage/>} />
            <Route exact path="/index" render={props => <StoryIndex index={data.index} />} />
            <Route exact path="/about" render={props => <About/>} />
            <Route exact path="/contact" render={props => <Contact/>} />
            <Route exact path="/mapview" render={props => <Mapview/>} />
            <Route path="/story" render={props => <Stories stories={data.stories} />} />
        </div>
    );
}
