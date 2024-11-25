/**
 * @return void
 */
function nohup(a?: any, b?: any, c?: any): void {
	// Do nothing
}

export default {
	router: {
		back: nohup,
		forward: nohup,
		go: nohup,
		push: nohup,
		replace: nohup,
	},
};
