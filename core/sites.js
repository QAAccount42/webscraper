var defaults = require('../config/scraper');
var config = require('../config/files');
var _ = require('lodash');
var Promise = require('bluebird');
var url = require('url');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var scrapeWebsite = require('website-scraper');
var format = require('string-template');

function getSiteDirname (siteUrl) {
	var urlObj = url.parse(siteUrl);
	var domain = urlObj.host;
	return domain + '-' + new Date().getTime();
}

function getSiteFullPath (siteDirname) {
	return path.resolve(config.directory, siteDirname);
}

function getSitesDirectories() {
	var root = config.directory;
	var directories = [];
	return fs.readdirAsync(root).then(function(files) {
		return Promise.map(files, function(file) {
			return fs.statAsync(root + '/' + file).then(function(stat){
				if (stat.isDirectory()) {
					directories.push(file);
				}
			});
		}).then(function() {
			return Promise.resolve(directories);
		});
	}).catch(function(err) {
		console.error('Error reading directory:', err);

		const filesDir = path.join(config.publicPath, 'files');

		return fs.mkdir(filesDir, { recursive: true },
			(err) => {
				if (err) {
					return console.error(err);
				}
				console.log('Directory created successfully!');
			})
	});
}

function buildSiteObject(directory) {
	return {
		status: true,
		directory: directory,
		previewPath: format(config.previewPath, {directory: directory}),
		downloadPath: format(config.downloadPath, {directory: directory})
	}
}

function getNotFoundError(directory) {
	return {
		errors: {
			directory: 'Site ' + directory + ' was not found'
		}
	};
}

function scrapeBlocked(res, result) {


	if(result && result.length && result[0].type){
		return res.status(500).json({
			status: false,
			message: "Something went wrong. But you can still find the partially downloaded project files under list menu."
		  })
	} else {
		return res.status(500).json({
			status: false,
			message: "Something went wrong. Try again later."
		  })
	}

	
}

var service = {
	scrape: function scrape(options, req, res) {
		var siteDirname = getSiteDirname(options.url);
		var siteFullPath = getSiteFullPath(siteDirname);

		var scraperOptions = _.extend({}, defaults, {
			urls: [options.url],
			directory: siteFullPath,
			// If defaults object has request property, it will be superseded by options.request
			urlFilter: (url) => url.startsWith(options.url), // Filter links to other websites
			recursive: true,
			maxRecursiveDepth: 10,
			request: options.request,
			ignoreErrors: true,
			// requestConcurrency: 5
		});


		scrapeWebsite(scraperOptions).then(function(result) {
			if(result && result.length && result[0].type){
				console.log("scrape is done 1");
				// return Promise.resolve(buildSiteObject(siteDirname));
			} else {
				console.log("scrape is fail 2");
				// return Promise.reject(scrapeBlocked(res, result));
			}

		});

		return res.status(200).json({
			status: true,
			message: "This task is running in background. Please check the list page after few minutes."
		})


	},

	list: function list() {
		return getSitesDirectories().then(function (directories) {
			if(!directories){
				directories = []
			}
			var list = directories.map(buildSiteObject);
			return Promise.resolve(list);
		})
	},

	find: function find(dirname) {
		return getSitesDirectories().then(function (directories) {
			var found = _.find(directories, function(el) {
				return el === dirname;
			});

			if (!found) {
				return Promise.reject(getNotFoundError(dirname));
			}

			return Promise.resolve(buildSiteObject(found));
		})
	},

	getFullPath: function getFullPath(dirname) {
		return getSitesDirectories().then(function (directories) {
			var exists = directories.indexOf(dirname) > -1;

			if (!exists) {
				return Promise.reject(getNotFoundError(dirname));
			}

			return Promise.resolve(getSiteFullPath(dirname));
		});
	}
};

module.exports = service;
