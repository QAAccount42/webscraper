var Archiver = require('archiver');
var sites = require('../../core/sites');

module.exports = {
	scrape: function(options, req, res){
		return sites.scrape(options, req, res);
	},
	list: function(params, req, res){
		return sites.list(params, req, res)
	},
	find: function(params, req, res) {
		return sites.find(params.dirname).catch((err) => {
			console.log("error occured", err);
            return res.status(500).json({
                status: false,
                message: "Something went wrong. Try again later.",
            });
		});
	},

	download: function scrape(params, req, res) {
		return sites.getFullPath(params.dirname).then(function(fullPath) {
			res.writeHead(200, {
				'Content-Type': 'application/zip',
				'Content-disposition': 'attachment; filename=' + params.dirname + '.zip'
			});

			var zip = Archiver('zip');
			zip.pipe(res);
			zip.directory(fullPath, false).finalize();
		})
		.catch((err) => {
			console.log("error occured", err);
            return res.status(500).json({
                status: false,
                message: "Something went wrong. Try again later.",
            });
		});
	}
};
