import React from 'react';

const styles = {
  padding: '25px',
  fontSize: '20pt'
};

const About = () => {
  return (
      <div style = {styles}>
          <p>LingView is a web interface for the documentation of Desano language. This interface allows users to view glossed ELAN and FLEx files,
          optionally with time-synced video and audio. Originally developed at Brown University
          as part of the A'ingae Language Documentation initiative.
          <hr />
          Desano is an endangered Eastern Tukanoan language spoken in the
           Vaupés Region of Brazil and Colombia. In the "Texts' tabs are some of the stories from some of the Desano peopke.</p>
      </div>
  );
}

export default About;
