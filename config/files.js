var path = require('path');

module.exports = {
	directory: path.resolve(__dirname, '../public/files/'),
	previewPath: '/static/folders/{directory}',
	downloadPath: '/sites/{directory}/download',
	publicPath: path.resolve(__dirname, '../public/'),
	folderDirectory: path.resolve(__dirname, '../public/folders/')
};
