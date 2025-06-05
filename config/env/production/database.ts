export default ({ env }) => ({
	connection: {
		client: 'postgres',
		connection: {
		host: env('DATABASE_HOST', 'localhost'),
			port: env.int('DATABASE_PORT', 5432),
			database: env('DATABASE_NAME', 'amvvs'),
			user: env('DATABASE_USERNAME', 'amvvs'),
			password: env('DATABASE_PASSWORD', '1]$e333u8[t~x|S$h(0+'),
			ssl: env.bool('DATABASE_SSL', false)
		}
	}
});
