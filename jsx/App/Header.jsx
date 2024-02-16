import React from "react";
import { HashRouter as Router, Route, Link, NavLink } from "react-router-dom";
import { AboutPage } from "./AboutPage.jsx";
import { LandingPage } from "./LandingPage.jsx";
import { Contact } from "./Contact.jsx";
import { StoryIndex } from "./StoryIndex.jsx";
import { Stories } from "./Stories/Stories.jsx";
import { Submissions } from "./Submissions.jsx";
import { Search } from "./Search.jsx";
import { TranslatableText } from "./locale/TranslatableText.jsx";
import {
  navBarTitleText,
  navBarSearchText,
  navBarAboutText,
  navBarIndexText,
  navBarContactText,
  navBarSubmissionsText,
} from "./locale/LocaleConstants.jsx";

export function Header() {
  return (
    <Router>
      <div id="navbar">
        <div id="navTitle">
          <Link to="/">
            <TranslatableText dictionary={navBarTitleText} />
          </Link>
        </div>
        <div id="navLinks">
         <NavLink to="/about">
            <TranslatableText dictionary={navBarAboutText} />
          </NavLink>
          <NavLink to="/contact-us">
            <TranslatableText dictionary={navBarContactText} />
          </NavLink>
          <NavLink to="/index">
            <TranslatableText dictionary={navBarIndexText} />
          </NavLink>
          <NavLink to="/submissions">
            <TranslatableText dictionary={navBarSubmissionsText} />
          </NavLink>
          <NavLink to="/search">
            <TranslatableText dictionary={navBarSearchText} />
          </NavLink>

        </div>
      </div>
      <div className="content">
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route exact path="/index">
          <StoryIndex />
        </Route>
        <Route path="/story">
          <Stories />
        </Route>
       <Route exact path="/about">
          <AboutPage />
        </Route>
        <Route exact path="/contact-us">
          <Contact />
        </Route>
        <Route exact path="/submissions">
          <Submissions />
        </Route>
        <Route exact path="/search">
          <Search />
        </Route>

      </div>
    </Router>
  );
}
