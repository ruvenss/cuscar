chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('cuscar.html', {frame: 'chrome', bounds: { width: 800, height: 750}, minWidth:800, minHeight: 750});
});