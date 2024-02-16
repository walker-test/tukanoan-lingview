import React from 'react';
import { ENGLISH } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'

const aboutPageJSX = {
  [ENGLISH]:
    <div>
       <p>LingView is a web interface for the documentation of Desano language.
          This interface allows users to view glossed ELAN and FLEx files,
          optionally with time-synced video and audio. Originally developed at 
          Brown University as part of the A'ingae Language Documentation initiative.
          <hr />
          Desano is an endangered Eastern Tukanoan language spoken in the
           Vaupés Region of Brazil and Colombia. In the "Texts' tabs are some of the stories from some of the Desano peopke.</p>
    </div>};

export function AboutPage() {
  return <TranslatableText dictionary={aboutPageJSX} />;
}
