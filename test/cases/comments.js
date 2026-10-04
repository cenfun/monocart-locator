/* eslint-disable no-trailing-spaces,line-comment-position,no-inline-comments,indent,no-multi-spaces,no-multiple-empty-lines */
        // LineComment

console.log('some"//"\\\'thing\\'); // comment /*  

  // comment /* ---
console.log('some//thing/*'); /*  
    ddd
*/
                           console.log('some/*/thing');
//
     console.log(`
        '/*
            "//"
        */'
     `);

/**
    * BlockComment
    
 *
       
        */ console.log('some/*/thing');

console.log('some//thing'); // end of line
                                        
/*
    connected
*/     console.log('some*//thing'); /*
 cross line
 */

console.log('some*//thing'); /*
 cross line

 */

    console.log('some*//thing'); /* inline */ console.log('some*//thing');

/*
 multiple line
//

 */

    /**/ console.log('some*//thing'); /*
        console.log('some//*thing')
 */

const r = /[//]/;
const sourceMapPattern = /[/# sourceMappingURL=ghost.js.map/]/;
const sourceMapCommentLike = /[//# sourceMappingURL=ghost.js.map]/;
const escapedSlashPattern = /https?:\/\/example\.com/;
const ratio = 10 / 2; // division is not a regular expression
console.log(r, sourceMapPattern, sourceMapCommentLike, escapedSlashPattern, ratio);


