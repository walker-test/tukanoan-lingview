
export function TextFormatButton({  }) {

    // functions for processing sentences (maps of words to morphemes and glossings, etc)

    // functions for adding the formatter latex code 

    // functions to display these in a popup

    function handleClick(e) {
        e.preventDefault();
        console.log('The link was clicked.');
    }

    return (
        <div>
            <button onClick={handleClick}>
                Format
            </button>
        </div>)
    ; 
}