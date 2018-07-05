var wpAPI = require('../libs').WP;


var wp = new wpAPI({
    endpoint: 'https://journalducoin.com/wp-json'
});
var config = require('../libs').config
var discordAPI = require('../libs').Discord;
var Helpers = require('../libs').utils;

var helper = new Helpers();


// med jdcoin slug @identifiant
// med jdcoin search query @identifiant
// med jdcoin bitcoin @identifiant
// med jdcoin lastbitcoin @identifiant
// med jdcoin listbitcoin integer @identifiant
// med jdcoin altcoin @identifiant
// med jdcoin lastaltcoin @identifiant
// med jdcoin listaltcoin integer @identifiant
// med jdcoin ico @identifiant
// med jdcoin lastico @identifiant
// med jdcoin listico integer @identifiant
// med jdcoin regulation @identifiant
// med jdcoin lastregulation @identifiant
// med jdcoin listregulation integer @identifiant
// med jdcoin guides @identifiant
// med jdcoin lastguides @identifiant
// med jdcoin listguides integer @identifiant
// med jdcoin trading @identifiant
// med jdcoin lasttrading @identifiant
// med jdcoin listtrading integer @identifiant
// med jdcoin videos @identifiant
// med jdcoin lastvideos @identifiant
// med jdcoin listvideos integer @identifiant

module.exports.run = function(args, message) {
  getPostsWP(args, message);
}

module.exports.help = {
  name: 'jdcoin',
  subcommands: ['search',
                'listaltcoin',
                'listblockchain',
                'listtrading',
                'listvideos',
                'listregulation',
                'listico',
                'listbitcoin',
                'listvideos',
                'lastaltcoin',
                'lastblockchain',
                'lasttrading',
                'lastvideos',
                'lastregulation',
                'lastico',
                'lastbitcoin',
                'lastvideos',
                'altcoin',
                'blockchain',
                'trading',
                'videos',
                'regulation',
                'ico',
                'see',
                'bitcoin',
                'videos'],
  help: './help/jdcoin.txt'
}

function getPostsWP(args, message) {
    getDatasforSearch(args, message)
}

function getEmbedforJournalDuCoin(args, message, post, img) {
    let index = 0;
    var media = img;

    const embed = new discordAPI.RichEmbed()
    // var img;

    // console.log('img ?', img)

    // return img;



    switch (args[0]) {
        case 'listaltcoin':
        case 'listblockchain':
        case 'listtrading':
        case 'listvideos':
        case 'listregulation':
        case 'listico':
        case 'listbitcoin':
        case 'listvideos':
            // statements_1
            break;
        case 'search':
            var tpl = 'Résultats pour ' + args[1] + '\n\n';
            // console.log('search response ?', post)
            post.forEach(function(element) {
                tpl += '' + config.prefix + ' ' + module.exports.help.name + ' see ' + element.slug + '\n';
                // embed.addField(element.title.rendered , tpl)

            })
            // embed.setDescription(tpl);
            // message.channel.send(tpl);

            var instances_dependencies = {
                message : message,
                discord : discordAPI,
                args : args,
                embed: tpl
            }
            helper.sender(instances_dependencies);

            break;


        default:
            // console.log('article ?', post)
            // statements_1
            embed.setTitle(post.title.rendered)
            embed.setURL(post.link)
            embed.setImage(media)
            // message.channel.send({
            //     embed
            // });

            var instances_dependencies = {
                message : message,
                discord : discordAPI,
                args : args,
                embed: embed
            }
            helper.sender(instances_dependencies);



            break;
    }
}


function getDatasforSearch(args, message) {

    let index = 0;
    var media_by_id;
    var default_number_post = 25;


    var img;



    switch (args[0]) {
        case 'search':
            var id_categories = new Array();
            var all_content = new Array();

            wp.posts().search(args[1]).perPage(20).get(function(err, data) {

                getEmbedforJournalDuCoin(args, message, data, undefined)
            })

            break;
        case 'bitcoin':
            // statements_1
            wp.posts().param('categories', 8).perPage(default_number_post).then(function(post) {

                if (post != undefined && post.length > 1) {
                    index = Math.floor(Math.random() * (post.length - 1));
                }

                media_by_id = wp.media().id(post[index].featured_media).then(function(media) {
                    // console.log('media', media.media_details.sizes.full.source_url)
                    getEmbedforJournalDuCoin(args, message, post[index], media.media_details.sizes.full.source_url)
                })

            })

            break;
        case 'lastbitcoin':
            // statements_1
            wp.posts().param('categories', 8).perPage(1).then(function(post) {

                if (post != undefined && post.length > 1) {
                    index = Math.floor(Math.random() * (post.length - 1));
                }

                media_by_id = wp.media().id(post[index].featured_media).then(function(media) {
                    getEmbedforJournalDuCoin(args, message, post[index], media.media_details.sizes.full.source_url)
                })
            })

            break;
        case 'altcoin':
            // statements_1
            wp.posts().param('categories', 6).perPage(default_number_post).then(function(post) {


                if (post != undefined && post.length > 1) {
                    index = Math.floor(Math.random() * (post.length - 1));
                }

                media_by_id = wp.media().id(post[index].featured_media).then(function(media) {
                    getEmbedforJournalDuCoin(args, message, post[index], media.media_details.sizes.full.source_url)
                })
            })

            break;
        case 'lastaltcoin':
            // statements_1
            wp.posts().param('categories', 6).perPage(1).then(function(post) {
                if (post != undefined && post.length > 1) {
                    index = Math.floor(Math.random() * (post.length - 1));
                }
                media_by_id = wp.media().id(post[index].featured_media).then(function(media) {
                    getEmbedforJournalDuCoin(args, message, post[index], media.media_details.sizes.full.source_url)
                })
            })

            break;
        case 'ico':
            // statements_1
            wp.posts().category(88).perPage(default_number_post).then(function(post) {
                if (post != undefined && post.length > 1) {
                    index = Math.floor(Math.random() * (post.length - 1));
                }
                media_by_id = wp.media().id(post[index].featured_media).then(function(media) {
                    getEmbedforJournalDuCoin(args, message, post[index], media.media_details.sizes.full.source_url)
                })
            })

            break;
        case 'lastico':
            // statements_1
            wp.posts().category(88).perPage(1).then(function(post) {
                if (post != undefined && post.length > 1) {
                    index = Math.floor(Math.random() * (post.length - 1));
                }
                media_by_id = wp.media().id(post[index].featured_media).then(function(media) {
                    getEmbedforJournalDuCoin(args, message, post[index], media.media_details.sizes.full.source_url)
                })
            })

            break;
        case 'regulation':
            // statements_1
            wp.posts().param('categories', 47).perPage(default_number_post).then(function(post) {
                if (post != undefined && post.length > 1) {
                    index = Math.floor(Math.random() * (post.length - 1));
                }
                media_by_id = wp.media().id(post[index].featured_media).then(function(media) {
                    getEmbedforJournalDuCoin(args, message, post[index], media.media_details.sizes.full.source_url)
                })
            })

            break;
        case 'lastregulation':
            // statements_1
            wp.posts().param('categories', 47).perPage(1).then(function(post) {
                if (post != undefined && post.length > 1) {
                    index = Math.floor(Math.random() * (post.length - 1));
                }
                media_by_id = wp.media().id(post[index].featured_media).then(function(media) {
                    getEmbedforJournalDuCoin(args, message, post[index], media.media_details.sizes.full.source_url)
                })
            })

            break;
        case 'blockchain':
            // statements_1
            wp.posts().param('categories', 34).perPage(default_number_post).then(function(post) {
                if (post != undefined && post.length > 1) {
                    index = Math.floor(Math.random() * (post.length - 1));
                }
                media_by_id = wp.media().id(post[index].featured_media).then(function(media) {
                    getEmbedforJournalDuCoin(args, message, post[index], media.media_details.sizes.full.source_url)
                })

            })
            break;
        case 'lastblockchain':
            // statements_1
            wp.posts().param('categories', 34).perPage(1).then(function(post) {
                if (post != undefined && post.length > 1) {
                    index = Math.floor(Math.random() * (post.length - 1));
                }
                media_by_id = wp.media().id(post[index].featured_media).then(function(media) {
                    getEmbedforJournalDuCoin(args, message, post[index], media.media_details.sizes.full.source_url)
                })

            })

            break;
        case 'guides':
            // statements_1
            wp.posts().param('categories', 72).perPage(default_number_post).then(function(post) {
                if (post != undefined && post.length > 1) {
                    index = Math.floor(Math.random() * (post.length - 1));
                }
                media_by_id = wp.media().id(post[index].featured_media).then(function(media) {
                    getEmbedforJournalDuCoin(args, message, post[index], media.media_details.sizes.full.source_url)
                })

            })

            break;
        case 'lastguides':
            // statements_1
            wp.posts().param('categories', 72).perPage(1).then(function(post) {
                if (post != undefined && post.length > 1) {
                    index = Math.floor(Math.random() * (post.length - 1));
                }
                media_by_id = wp.media().id(post[index].featured_media).then(function(media) {
                    getEmbedforJournalDuCoin(args, message, post[index], media.media_details.sizes.full.source_url)
                })

            })

            break;
        case 'trading':
            // statements_1
            wp.posts().param('categories', 7).perPage(default_number_post).then(function(post) {
                if (post != undefined && post.length > 1) {
                    index = Math.floor(Math.random() * (post.length - 1));
                }
                media_by_id = wp.media().id(post[index].featured_media).then(function(media) {
                    getEmbedforJournalDuCoin(args, message, post[index], media.media_details.sizes.full.source_url)
                })

            })
            break;
        case 'lasttrading':
            // statements_1
            wp.posts().param('categories', 7).perPage(1).then(function(post) {
                if (post != undefined && post.length > 1) {
                    index = Math.floor(Math.random() * (post.length - 1));
                }
                media_by_id = wp.media().id(post[index].featured_media).then(function(media) {
                    getEmbedforJournalDuCoin(args, message, post[index], media.media_details.sizes.full.source_url)
                })

            })
            break;
        case 'videos':
            // statements_1
            wp.posts().param('categories', 58).perPage(default_number_post).then(function(post) {
                if (post != undefined && post.length > 1) {
                    index = Math.floor(Math.random() * (post.length - 1));
                }
                media_by_id = wp.media().id(post[index].featured_media).then(function(media) {
                    getEmbedforJournalDuCoin(args, message, post[index], media.media_details.sizes.full.source_url)
                })

            })
            break;
        case 'lastvideos':
            // statements_1
            wp.posts().param('categories', 58).perPage(1).then(function(post) {
                if (post != undefined && post.length > 1) {
                    index = Math.floor(Math.random() * (post.length - 1));
                }
                media_by_id = wp.media().id(post[index].featured_media).then(function(media) {
                    getEmbedforJournalDuCoin(args, message, post[index], media.media_details.sizes.full.source_url)
                })

            })

            break;
        case 'see':
           wp.posts().slug(args[1]).perPage(1).then(function(post) {
                if (post != undefined && post.length > 1) {
                    index = Math.floor(Math.random() * (post.length - 1));
                }
                media_by_id = wp.media().id(post[index].featured_media).then(function(media) {
                    getEmbedforJournalDuCoin(args, message, post[index], media.media_details.sizes.full.source_url)
                })

            })
        break;

        default:
            //ici prévoir un get list des subcommands de jdc @todo
            // statements_def
            // wp.posts().slug(args[0]).perPage(1).then(function(post) {
            //     if (post != undefined && post.length > 1) {
            //         index = Math.floor(Math.random() * (post.length - 1));
            //     }
            //     console.log('images attached ?', post[index].featured_media)
            //     media_by_id = wp.media().id(post[index].featured_media).then(function(media) {
            //         getEmbedforJournalDuCoin(args, message, post[index], media.media_details.sizes.full.source_url)
            //     })

            // })


            break;
    }
}
