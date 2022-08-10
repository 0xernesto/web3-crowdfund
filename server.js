/**
 * The purpose of this file is to manually start up our Next.js application
 * and specifically tell it to use all the routes that we defined in routes.js.
 */

const { createServer } = require("http");
const next = require("next");

const app = next({
	// NODE_ENV is a global environment variable.
	// If NODE_ENV is not "production", we will run our app in "development" mode.
	dev: process.env.NODE_ENV !== "production",
});

const routes = require("./routes");

// Define our custom handler
const handler = routes.getRequestHandler(app);

// Set custom dev server and listen to a specific port
app.prepare().then(() => {
	createServer(handler).listen(3000, (err) => {
		if (err) throw err;
		console.log("Ready on localhost:3000);");
	});
});
