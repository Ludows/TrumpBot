var Sequelize = require('../libs').sequelize;
var dbDriver = require('../models/index').timap;
const Timap = require( '../models/timap/user')(dbDriver, Sequelize.DataTypes);

const bot = require('../libs').bot

class timap {
    constructor(opts) {
        this.tasks = [];
        this.currentMessage = '';
    }
    // encrypt users
    async connect(collection) {
        
        
        var connection = await Timap.findOne({ username: collection.username });

        return connection;

        
    }
    register(message, args) {
        this.currentMessage = message;
        var curr_user = bot.users.get( message.author.id );
        console.log('message to connect timap table', curr_user)
        this.connect(curr_user).then((response) => {
            console.log('response from sequelize', response)
            if(response) {
                // user found 
                var attrs = this.getAttributes(args);
                console.log('attrs', attrs)
                
                // check des attributs requis 
                this.mayThrowReplies(attrs);

            }
            else {
                // no user found
            }
            // console.log('args from register', args);


        }).catch((err) => {
            console.log('err', err)
        })
        
    }
    mayThrowReplies(obj) {
        if(!obj.task || !obj.hour || !obj.day) {
            this.currentMessage.reply('Vous devez renseigner les attributes suivants task, hour, day');
        }
    }
    getAttributes(array) {
        var obj = {};
        array.forEach((arg) => {
            if(arg.indexOf('=') > -1) {
               var verbs = arg.split('=');
               obj[verbs[0].trim()] = verbs[1].trim()
            }
        })
        return obj;
    }
    cron() {

    }
    task() {

    }


}
module.exports = timap;