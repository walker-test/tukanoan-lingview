// import React from 'react';
// import Fuse from 'fuse';


// export function LandingPage() {
//     function search (query) {
//         var options = {
//             shouldSort: true,
//             findAllMatches: true,
//             threshold: 0.4,
//             location: 0,
//             distance: 100,
//             maxPatternLength: 32,
//             minMatchCharLength: 1,
//             keys: [
//               "title",
//               "author.firstName"
//           ]
//           };
//           var fuse = new Fuse(list, options); // "list" is the item array
//           return fuse.search(query);
//     }

//     window.onload = function () {
//         $("#searchInput").change(function(){
//             const searchResult = search(this.value)
//             const displayTable = $("#displayTable")
//             displayTable.innerHTML = ""
//             for (sentence in searchResult) {
//                 displayTable.append(
//                     `<tr>${sentence.text}</tr>`
//                 );
//             }
//         })
//     }
//     return (
//       <div>
//           <label for="searchInput">Search database</label> <input id="searchInput" type="text"/>
//           <table id="displayTable"></table>
//       </div>
//   );
// }