const Twitter = require('twitter-lite');
const config = require('./config');

const client = new Twitter({
  subdomain: "api", 								// "api" is the default (change for other subdomains)
  version: "1.1", 									// version "1.1" is the default (change for other subdomains)
  consumer_key: config.consumer_key, 				// from Twitter.
  consumer_secret: config.consumer_secret, 			// from Twitter.
  access_token_key: config.access_token_key, 		// from your User (oauth_token)
  access_token_secret: config.access_token_secret 	// from your User (oauth_token_secret)
});

client
	// TODO – Pagination 
	// max 200 – https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-followers-list
  	.get("friends/list", { count: 200 })
	.then(results => {

		let _ids = [];
		let _users = [];
		let _dont_tweet_until = "2020-03-31";
		let _delete_flag = false;

	    results.users.forEach(function(val, i){
			_ids.push(val.id);
			_users.push({ id: val.id, screen_name: val.screen_name, status: val.status });
		})
		
		_users.forEach(function(val, i){
			
			if(val.status){
				if( new Date(val.status.created_at) <= new Date(_dont_tweet_until) ){
					if( _delete_flag ) {
						client.post('friendships/destroy', { user_id: val.id })
							.then(resp => { console.log('deleted ', val.screen_name) })
							.catch(console.error)
					}else{
						console.log('DEBUG ACTIVE – Following should be removed: ', val.screen_name)
					}
				}
			}else{
				// Never posted case
				if( _delete_flag ) {
					client.post('friendships/destroy', {user_id: val.id })
						.then(resp => { console.log('deleted ', val.screen_name) })
						.catch(console.error)
				}else{
					console.log('Following but never posted: ', val.screen_name)
				}
			}
		})

	})
	.catch(console.error)


