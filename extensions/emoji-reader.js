var axiosAPI = require('../libs').axios;
var cheerioAPI = require('../libs').cheerio;


function emojiReader() {}
emojiReader.prototype = {
	fetch: async function() {
       var parsedArticles = new Array();
       var wait = await axiosAPI.get('https://www.webpagefx.com/tools/emoji-cheat-sheet/', { responseType: 'json' })


    	const $ = cheerioAPI.load(wait.data);
    // console.log('$ ?', $);


    	const emojis = $('#emoji-people li');

	    emojis.each(function(i, emoji) {
	      var text = $(emoji).find('span.name').text();
	      var id = i;
	      var slug = text

	      parsedArticles[i] = new Object();
      	  parsedArticles[i].id = id;
          parsedArticles[i].name = ':'+text+':';
          parsedArticles[i].slug = slug;
	    })

	   // return wait.data

    	return parsedArticles
	},
	name: async function(query, array) {
    // console.log('wait response ?', response)

      var allResponses = new Array();

	    // return response;
	    array.forEach(function(element) {

	      if(element.name === ':'+query+':') {
	        allResponses.push(element)
	        // console.log('el ?', element)
	      }
	    })
      return allResponses;
	},
}


module.exports = emojiReader
