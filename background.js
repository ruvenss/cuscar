chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('cuscar.html', {frame: 'chrome', bounds: { width: 800, height: 650}, minWidth:800, minHeight: 650});
});