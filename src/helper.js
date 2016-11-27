const substringMatcher = (strs) => {
     return (q, cb) => {
         let matches, substringRegex;

         // an array that will be populated with substring matches
         matches = [];

         // regex used to determine if a string contains the substring `q`
         substrRegex = new RegExp(q, 'i');

         // iterate through the pool of strings and for any string that
         // contains the substring `q`, add it to the `matches` array
         $.each(strs, (i, str) => {
             if (substrRegex.test(str)) {
                 matches.push(str);
             }
         });
         cb(matches);
     };
 };

 Array.prototype.remove = () => {
     let what, a = arguments,
         L = a.length,
         ax;
     while (L && this.length) {
         what = a[--L];
         while ((ax = this.indexOf(what)) !== -1) {
             this.splice(ax, 1);
         }
     }
     return this;
 };
