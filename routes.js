// This require statement returns a function.
// By placing the second set of parantheses, the returned function
// will be invoked immediately after the require statement executes.
const routes = require("next-routes")();

// We can define a new route mapping with routes.add().
// The ":" indicates a wildcard, which we can name whatever we want.
// .add(<URL Route>, <File Route>)
routes
	.add("/campaigns/new", "campaigns/new")
	.add("/campaigns/:campaignAddress", "/campaigns/show")
	.add("/campaigns/:campaignAddress/requests", "/campaigns/requests/index")
	.add("/campaigns/:campaignAddress/requests/new", "/campaigns/requests/new");

module.exports = routes;
