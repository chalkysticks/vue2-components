const { defineConfig } = require('@vue/cli-service');
const version = require('./package.json').version;
const webpack = require('webpack');

// Setup process env
// ---------------------------------------------------------------------------

process.env.VUE_APP_VERSION = version;

// Config
// ---------------------------------------------------------------------------

module.exports = {
	chainWebpack: (config) => {
		config.module.rules.delete('eslint');
	},
	configureWebpack: {
		cache: {
			buildDependencies: {
				config: [__filename],
			},
			type: 'filesystem',
		},
		devServer: {
			client: {
				overlay: false,
			},
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			hot: process.env.NODE_ENV == 'development',
			https: false,
			liveReload: process.env.NODE_ENV == 'development',
		},
		plugins: [],
		resolve: {
			fallback: {
				// 'crypto-browserify': require.resolve('crypto-browserify'), // if you want to use this module also don't forget npm i crypto-browserify
				crypto: false,
				fs: false,
				http: false,
				https: false,
				net: false,
				path: false,
				stream: false,
				tls: false,
				url: false,
				util: require.resolve('util/'),
				zlib: false,
			},
			mainFields: ['main', 'module'],
		},
	},
	css: {
		extract: false,
	},
	publicPath: process.env.VUE_APP_PUBLIC_PATH || '/',

	// transpileDependencies: true,
	// transpileDependencies: ['@chalkysticks/sdk', '@chalkysticks/sass'],
	transpileDependencies: [],
};
