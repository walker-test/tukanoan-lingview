import React from 'react';
const Submission = () => {
    return (
        <div>
           <body>
           <h1>Submit an Entry to the Dictionary Team</h1>
           <p>Did you discover we missed a word in the dictionary? Is there an entry that isn't correct?
               Would you like to submit a new word for a concept your language doesn't have a word for?
           </p>
           <p>Please use the form below to help alert our team of the word or entry in question.</p>
           <form action="https://arizona-linguistics.github.io/tukanoan-languages/#/submission/" method="get">
               <p>What can we help you with?</p>
               <select name="question">
                   <option value="missing">missing word</option>
                   <option value="correction">correct entry</option>
                   <option value="newentry">new word</option>
                   <option value="other">other</option>
               </select>
               <fieldset>
                   <legend>Word Details</legend>
                   <label>Which language are you writing about?</br>
                   <input type="text" name="language"/></label></br>
                   <label>Word:<br/>
                   <input type="text" name="word"/> </label><br/>
                   <label>Description:<br/>
                   <textarea name="description" cols="30" rows="4">Enter your description</textarea> </label><br/>
                </fieldset>
                <fieldset>
                    <legend>Contact Details</legend>
                    <label>Name:<br/>
                    <input type="name" name="name"/> </label><br/>
                    <label>Email:<br/>
                    <input type="email" name="email"/> </label><br/>
                </fieldset>
                <input type="submit" name="submit" value="submit"/>
           </form>
           </body>
        </div>
    );
  }
export default Submission;
