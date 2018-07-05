var axiosAPI = require('../libs').axios;
var cheerioAPI = require('../libs').cheerio;
var Helper = require('./utils');
var config = require('../libs').config

// console.log('helper is ready ?', Helper)

// console.log('config is ready ?', config)


var helper = new Helper();

var options = {
	focusOn: 'title', // or  slug, id
	mode: 'global', //or global
	arraytoSearch: []
}

var fetchArgs = {
	query : '', // string
	results : 20 // int 20 by 20 ex : 2à, 4à, 60, 80, 100...
}


function dealReader() {}
dealReader.prototype = {
  fetch: async function(opts) {

  	if (arguments[0] && typeof arguments[0] == "object") {
        this.opts = helper.extend({}, fetchArgs);
        helper.extend(this.opts, opts);
    }
    else {
        this.opts = fetchArgs;
    }

    const default_number_post = 20;

  	var url_to_search;
  	var ajax_pages;
  	let full_content_data;
  	switch (this.opts.query) {
	    case 'newcodepromo':
	      url_to_search = 'https://www.dealabs.com/codes-promo'
	    break;
	    case 'hotcodepromo':
	      url_to_search = 'https://www.dealabs.com/codes-promo-hot'
	    break;
	    case 'commentcodepromo':
	      url_to_search = 'https://www.dealabs.com/codes-promo-commentes'
	    break;
	    case 'hotfree':
	      url_to_search = 'https://www.dealabs.com/groupe/gratuit'
	    break;
	    case 'newfree':
	      url_to_search = 'https://www.dealabs.com/groupe/gratuit-nouveaux'
	    break;
	    case 'commentfree':
	      url_to_search = 'https://www.dealabs.com/groupe/gratuit-commentes'
	    break;
	    case 'hotgoodplans':
	      url_to_search = 'https://www.dealabs.com/bons-plans'
	    break;
	    case 'newgoodplans':
	      url_to_search = 'https://www.dealabs.com/bons-plans-nouveaux'
	    break;
	    case 'commentgoodplans':
	      url_to_search = 'https://www.dealabs.com/bons-plans-commentes'
	    break;
	    case 'hotalldeals':
	      url_to_search = 'https://www.dealabs.com/hot'
	    break;
	    case 'newalldeals':
	      url_to_search = 'https://www.dealabs.com/nouveaux'
	    break;
	    case 'commentalldeals':
	      url_to_search = 'https://www.dealabs.com/commentes'
	    break;
	    default:
	      // ?page=1&ajax=true
	      url_to_search = 'https://www.dealabs.com'
	      break;

  	}

  	var integer_for_ajax = this.opts.results / default_number_post;
  	var allPages = new Array();
  	var links = new Array();

  	for(var i = 0; i < integer_for_ajax; i++) {
  	  var url = url_to_search +'?page='+ (i + 1) +'&ajax=true';
  	  links.push(url);
  	}
  	var wait = await axiosAPI.all(links.map(val => axiosAPI.get(val, { responseType: 'json' })));

    console.log('links', links)
  	console.log('wait', wait.length);

  	for(var k = 0; k < wait.length; k++) {
  		allPages.push(wait[k].data);
  	}
  	// console.log('allPages', allPages)
	  // @todo numbersearchpages
	  // for (var i = 0; i < array.length; i++) {
	  //   array[i]
	  // }
	  // console.log('good url ?', ''+ url_to_search +'?page=1&ajax=true');



	  return allPages;
  },
  formatDeals: function(content) {
	  var array_src = new Array();
	  var link_src = new Array();
	  var title_src = new Array();
	  var articles_src = new Array();
	  var prices_after_percentage = new Array();
	  var real_prices = new Array();
	  var reductions = new Array();
	  var users_avatar = new Array();
	  var users_names = new Array();

	  var formated_data = new Array();


	  content.forEach(function(val) {
	  	const $ = cheerioAPI.load(val);

	  	  var articles =  $('article.thread').not('.thread--expired');

		  articles.each(function(i, article) {
		  	var price_after = $(article).find('span.thread-price').text();
		  	var real = $(article).find('span.thread-price').parent().next().find('span').eq(0).text();
		  	var reduc = $(article).find('span.thread-price').parent().next().find('span').eq(1).text();
		  	var avatar = $(article).find('.footerMeta-infoSlot .js-avatar').attr('src');
		  	var user = $(article).find('.thread-username').text();

		  	var image = $(article).find('img.thread-image');
		  	var title = $(image).attr('alt');
		  	var link = $(image).parent().attr('href');

		  	prices_after_percentage.push(price_after);
		  	real_prices.push(real);
		  	reductions.push(reduc)
		  	link_src.push(link);
		  	title_src.push(title);
		  	users_avatar.push(avatar);
		  	users_names.push(user);

		  	// console.log('image debug', image);
		  	if($(image).attr('src')) {
		  		array_src.push($(image).attr('src'))
		  	}
		  	else {
		  		var json = JSON.parse($(image).attr('data-lazy-img'));
		        array_src.push(json.src);
		  	}

		  	// if(image.attribs['data-lazy-img']) {
		   //    var json = JSON.parse(image.attribs['data-lazy-img']);
		   //    array_src.push(json.src);
		   //  }
		   //  else {
		   //    array_src.push(image.attribs.src)
		   //  }


		  })
	  })







	  // var test = $('article.thread').find('img.thread-image');
	  // var prices = $('article.thread').find('span.thread-price');
	  // var author_infos = $('article.thread').find('.footerMeta-infoSlot');

	  // prices.each(function(i, price) {
	  //   prices_after_percentage.push($(price).text())
	  //   var real_price = $(price).parent().next().find('.text--lineThrough').text();
	  //   var reduction = $(price).parent().next().find('.space--ml-1').text();

	  //   real_prices.push(real_price);
	  //   reductions.push(reduction);

	  // })

	  // author_infos.each(function(i, info) {
	  //   var avatar = $(info).find('.js-avatar').attr('src');
	  //   var username = $(info).find('.thread-username').text();

	  //   users_avatar.push(avatar);
	  //   users_names.push(username);
	  // })

	  // // console.log(response.data);

	  // test.each(function(i , image) {
	  //   if(image.attribs['data-lazy-img']) {
	  //     var test_json = JSON.parse(image.attribs['data-lazy-img']);
	  //     array_src.push(test_json.src);
	  //   }
	  //   else {
	  //     array_src.push(image.attribs.src)
	  //   }

	  //   link_src.push(image.parent.attribs.href);
	  //   title_src.push(image.attribs.alt);
	  // })

	  // le formatage des données vient seulement ici

	  for (var i = 0; i < title_src.length; i++) {
	    formated_data[i] = new Object();
	    formated_data[i].id = i + 1;
	    formated_data[i].title = title_src[i];
	    formated_data[i].slug = helper.slugify(title_src[i])
	    formated_data[i].img = array_src[i];
	    formated_data[i].link = link_src[i];
	    formated_data[i].avatar = users_avatar[i];
	    formated_data[i].user = users_names[i];
	    formated_data[i].price = prices_after_percentage[i];
	    formated_data[i].realprice = real_prices[i];
	    formated_data[i].reduction = reductions[i];
	  }

	  // console.log('formated', formated_data);

	  return formated_data;
  },
  search: function(query, opts) {
  		if (arguments[1] && typeof arguments[1] == "object") {
            this.options = helper.extend({}, options);
            helper.extend(this.options, opts);
        }
        else {
            this.options = options;
        }

        var array = this.options.arraytoSearch
        // console.log('array', array)
        // console.log('this.options.focusOn', this.options.focusOn)
        var search = 'Résultats pour '+ query +':\n\n'
        switch(this.options.focusOn) {
        	 	case 'title':
        	 		array.forEach(function(val) {
        	 			if(val.title.toLowerCase().includes(query) === true) {
        	 				search += val.link +'\n';
        	 			}
        	 		})
			    break;
			    case 'slug':
                    array.forEach(function(val) {
        	 			if(val.slug.includes(query) === true) {
        	 				search += val.link +'\n';
        	 			}
        	 		})
			    break;
			    default:
			        array.forEach(function(val) {
        	 			if(val.id.includes(query) === true) {
        	 				search += val.link +'\n';
        	 			}
        	 		})
			    break;
        }
        console.log('search', search)
        return search;
  }
}


module.exports = dealReader
