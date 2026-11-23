/* eslint-disable no-trailing-spaces,line-comment-position,no-inline-comments,indent,no-multi-spaces,no-multiple-empty-lines,no-tabs */
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

  /* note */  
/* one *//* two */
/* one */ 	/* two */
/* one */ // two
/* one */ console.log(ratio); /* two */
console.log(ratio); /* note */
/* note */console.log(ratio);
/* one */ /* multi
  
  line */  /* next */  

console.log(ratio); /* first
  first ends */
/* next */ console.log(ratio); /* last
  last ends */  


