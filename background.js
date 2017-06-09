chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('cuscar.html', {frame: 'chrome', bounds: { width: 1000, height: 750}, minWidth:1000, minHeight: 750});
});