var axiosAPI = require('../libs').axios;
var cheerioAPI = require('../libs').cheerio;


function jDoc(opts) {}


function extend(a, b) {
   for (var key in b) {
     	if (b.hasOwnProperty(key)) {
         	a[key] = b[key];
     	}
 	}
 	// console.log('return a', a);
 	return a;
 }

// @faire en sorte que le Bot puisse détecter les dépendances qui ont besoin d'une clé
//faire en sorte de formater les variables

jDoc.prototype = {
  fetch: async function() {
    var parsedArticles = new Array();
    var wait = await axiosAPI.get('http://api.jquery.com/', { responseType: 'json' })
    // console.log('wait axios ?', wait)
    // console.log('fetch data buggy ?', jDoc.prototype.fetch())


    const $ = cheerioAPI.load(wait.data);
    // console.log('$ ?', $);


    const articles = $('article');

    articles.each(function(i, article) {
      var link = $(article).find('.entry-title a').attr('href');
      var text = $(article).find('.entry-title a').text();
      var description = $(article).find('.entry-summary p').text();
      var id = i;
      var slug = text.toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
      parsedArticles[i] = new Object();
      parsedArticles[i].id = id;
      parsedArticles[i].text = text;
      parsedArticles[i].link = 'http:'+link;
      parsedArticles[i].description = description;
      parsedArticles[i].slug = slug;
    })
    // console.log('all Datas', parsedArticles)
    return parsedArticles

  },
  byText: function(string) {
    //format data is here and return a object
    var response = jDoc.prototype.fetch();
    // console.log('wait ?', response)
    var allResponses = new Array();
    response.forEach(function(element) {
      if(element.text === string) {
        allResponses.push(element)
      }
    })

    // return this;
  },
  byId: async function(int) {
    //format data is here and return a object
    var response = await jDoc.prototype.fetch();
    var allResponses = new Array();
    response.forEach(function(element) {
      if(element.id === int) {
        allResponses.push(element)
      }
    })

    // return this;
  },
  bySlug: async function(slug) {
    //format data is here and return a object
    // console.log('calling');
    // console.log('slug', slug)
    var response = await jDoc.prototype.fetch();
    // console.log('wait response ?', response)

    var allResponses = new Array();

    // return response;
    response.forEach(function(element) {

      if(element.slug === slug) {
        allResponses.push(element)
        // console.log('el ?', element)
      }
    })
    return allResponses;
    // console.log('allResponses', allResponses)

    // return this;
  },
  global: async function(query) {
    var response = await jDoc.prototype.fetch();
    // console.log('wait response ?', response)

    var allResponses = new Array();

    // return response;
    response.forEach(function(element) {

      if(element.slug.includes(query)) {
        allResponses.push(element)
        // console.log('el ?', element)
      }
    })
    return allResponses;

  }

}


module.exports = jDoc;
