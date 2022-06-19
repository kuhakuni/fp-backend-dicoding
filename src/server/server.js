const Hapi = require('@hapi/hapi');
const routes = require('../routes/routes');

const init = async () => {
	const server = Hapi.server({
		port: 5000,
		host: 'localhost',
		routes: {
			cors: {
				origin: ['*'],
			},
		},
	});
	server.route(routes);
	await server.start();
	console.log(`Server berjalan pada port ${server.info.uri}`);
};

init();
