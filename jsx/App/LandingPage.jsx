import React from 'react';
import { ENGLISH } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'

const landingPageJSX = {
  [ENGLISH]:
    <div>
      <p>Welcome to the Tukanoan Language Website</p>
      <p>To get started exploring, navigate the words on the task bar above.</p>
    </div>
};

export function LandingPage() {
  return <TranslatableText dictionary={landingPageJSX} />;
}
