var Helper = require('./utils');
var axiosAPI = require('../libs').axios;


var default_opts = {
	endpoint: 'https://a.4cdn.org/'
}

var helper = new Helper();

class Chan {
	constructor(obj) {
		if(arguments[0] && typeof arguments[0] === 'object') {
			this.opts = helper.extend({},default_opts);
      		helper.extend(this.opts, obj);
		}
		else {
			this.opts = default_opts;
		}
	}
	async get_boards() {
		var boards = await axiosAPI.get(this.opts.endpoint+'boards.json', { responseType: 'json' })

		console.log('boards', boards.data)
	}
	async get_image(query) {
		var all_images = new Array();
		var index = 0;
    var url = this.opts.endpoint + query +'/catalog.json';
		var axios = await axiosAPI.get(url, { responseType: 'json' })
		.then(function(response) {

			// console.log(response.data)

			response.data.forEach(function(page) {
				// console.log('page ?', page)
				page.threads.forEach(function(thread) {
					console.log('thread on page '+ page.page  +'', thread)
					all_images.push('http://i.4cdn.org/'+ query.toLowerCase() +'/'+ thread.tim +''+thread.ext+'')
					// console.log('thread.last_replies',thread.last_replies)
					if(thread.replies > 0) {
						thread.last_replies.forEach(function(reply) {
							if(reply.tim) {
								all_images.push('http://i.4cdn.org/'+ query.toLowerCase() +'/'+ reply.tim +''+reply.ext+'');
							}

						})

					}

				})
			})
      index = Math.floor(Math.random() * (all_images.length - 1));
			// console.log('all_images', all_images);
			// console.log('image selected', all_images[index]);



		})

		return all_images[index]
	}
	async get_list(query) {
		// https://api.4chan.org/b/catalog.json
	}
}

module.exports = Chan;
