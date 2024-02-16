import React, { Component } from 'react';

export class Mapview extends React.Component {
  componentDidMount(){ }
  render() {
      return (
          <div>
          <body>
          <figure>
          <iframe
          width="700"
          height="300"
          src="https://www.google.com/maps/place/Colombia,+Mit%C3%BA,+Vaupes,+Colombia/@1.4087,-69.8824448,15z/data=!3m1!4b1!4m5!3m4!1s0x8e049297b880d725:0x401df7210f79a!8m2!3d1.4087!4d-69.87369"
          alt="map of mitu"
          title="map of mitu"></iframe>
          <figcaption>Map of Mitu, Columbia</figcaption></figure>
          <p><i>about</i></p>
          <p>Mitu, Columbia is the home of a subgroup of Tukanoan languages.
            This includes but is not limited to Mutea, which is the current language being researched.
          </p>
          </body>
         </div>
      );
  }
}
