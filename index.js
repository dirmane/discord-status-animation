const request = require("request");
const config = require("./config.json");
const STATUS_URL = "https://discordapp.com/api/v8/users/@me/settings";

process.stdin.resume()

async function loop() {
	var tempAnim = [];
	for (let anim of config.animation) {
		await doRequest(anim.text).catch(console.error);
		await new Promise(p => setTimeout(p, anim.timeout));
	}
	loop();
}


async function animLog() {
	let time = 0;
	console.log(`Aplication is working!   |Animation length: ${config.animation.length}|   |Animation:`);
	for(anim of config.animation) {
		await new Promise(resolve => { 
		setTimeout(resolve, anim.timeout)});
		time = time + anim.timeout;
		console.log(`${String(anim.text)}                                                    Execution time: ${Number(anim.timeout) / 1000}s`)
	};
	console.log(`Total execution time: ${time / 1000}s`);
	console.log("To stop press CTRL+C")

}
 
process.on('SIGINT', async() => {
	await doRequest(config.offline).catch(console.error);
	process.exit(2);
});
process.on('exit', async() => {
	await doRequest(config.offline).catch(console.error);
	process.exit(2);
});


animLog();
loop();

function doRequest(text) {
	return new Promise((resolve, reject) => {
		request({
			method: "PATCH",
			uri: STATUS_URL,
			headers: {
				Authorization: config.token
			},
			json: {
				custom_status: {
					text: text
				}
			}
		}, (err, res, body) => {
			if (err) {
				reject(err);
				return;
			}

			if (res.statusCode !== 200) {
				reject(new Error("Blad: " + res.statusCode));
				return;
			}

			resolve(true);
		});
	});
}
