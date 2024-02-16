import React from 'react';
import { ENGLISH, ESPANOL, FRANCAIS } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'

const contactJSX = {
  [ENGLISH] :
    <div>
        <body>
           <link href="contact.css" type="text/css" rel="stylesheet"/>
            <h1>Contact us </h1>
            <hr/>
            <h2>Wilson De Lima Silva</h2>
            <h3>Team Leader</h3>
            <p>Wilson is an assistant professor at the University of Arizona and the director for the M.A. program in Native American Languages and Linguistics <i>(also known as NAMA)</i>
            He is a field linguist with formal traning in theoretical linguistics and language documentation and revitalization.
            Wilson is the man on scene, helping directly in the Tukanoan communities by documenting language.</p>
            <p><a href="malito:wdelimasilva@arizona.edu"><strong>wdelimasilva@arizona.edu</strong></a></p>
            <hr/>
            <h2>Gus Hahn-Powell</h2>
            <h3>Website Contact</h3>
            <p>Gus is also assistant professor at the University of Arizona. He is the director of the Human Language Technologies masters of science.
            His focus in research centers around machine reading for scientific discovery. However, he is kind enough to lend us his talents to build this website.</p>
            <p><a href="malito:hahnpowell@arizona.edu"><strong>hahnpowell@arizona.edu</strong></a></p>
            <hr/>
            <h2>Oliver Barraza</h2>
            <h3>Assistant</h3>
            <p>Oliver is a Linguist masters student at the University of Arizona.
              He is currently working beside Wilson De Lima Silva to help document the Tukanoan languages.
              Oliver's goal is to become a linguist that can help indigenous communities document and revitalize their languages.</p>
            <p><a href="malito:oliverbarraza@email.arizona.edu"><strong>oliverbarraza@email.arizona.edu</strong></a></p>
         </body>
    </div>};

export function Contact() {
  return <TranslatableText dictionary={contactJSX} />;
}
