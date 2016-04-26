chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('cuscar.html', {frame: 'chrome', bounds: { width: 1000, height: 800}, minWidth:1280, minHeight: 700});
});