chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('cuscar.html', {frame: 'chrome', bounds: { width: 400, height: 800}, minWidth:400, minHeight: 700});
});