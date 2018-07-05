var axiosAPI = require('../libs').axios;


class Facts {
	constructor(obj) {
		// this.endpoint = 'https://www.chucknorrisfacts.fr/api/';
		if(arguments[0] && typeof arguments[0] === 'object') {
		 // https://www.chucknorrisfacts.fr/api/get?data=
		 this.endpoint = obj.endpoint;
		}
		else {
			this.endpoint = 'https://www.chucknorrisfacts.fr/api/';
		}
	}
    // obj.type , obj.tri, ob.nb
    async url(obj) {
    	if(!obj) {
    		throw new Error('Il faut créer les parameters');
    	}
    	var instance = 0;
        var endpoint = this.endpoint;
        var link;
        // console.log('endpoint ?', this)

        var params = '';

        for (var variable in obj) {
        	// statement
        	if(instance === 0) {
               params += 'get?data='+ variable + ':' + obj[variable]
        	}
        	else {
               params += ';'+variable + ':' + obj[variable]
        	}
        	instance++;
        }

        link = endpoint + params;
        console.log('link facts', link)

        var wait = await axiosAPI.get(link, { responseType: 'json' })

        return wait.data;

    }
}

// console.log('module ?', module.exports = Facts)

module.exports = Facts;
