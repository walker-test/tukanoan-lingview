import React from 'react';

import { Header } from './Header.jsx';
import { LocaleProvider } from './locale/LocaleContext.jsx'
import { LocaleSelect } from './locale/LocaleSelect.jsx'


export function App() {
  return (
    <LocaleProvider>
        <Header />
        <footer>
        <small> 
        <span translate="yes">This website is powered by <a href='https://github.com/BrownCLPS/LingView/' target="_blank" rel="noopener noreferrer">Lingview</a> © 2022</span>
        </small>
          <LocaleSelect />
        </footer>
    </LocaleProvider>
  );
}
