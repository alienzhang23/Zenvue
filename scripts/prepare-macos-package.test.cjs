const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");

function loadHook({ rejectArchitecture = false } = {}) {
	const calls = [];
	const sandbox = {
		module: { exports: {} }, process,
		require(name) {
			if (name === "node:path") return path;
			if (name === "builder-util") return { Arch: { 1: "x64", 3: "arm64", 4: "universal" } };
			if (name.endsWith(path.join("ffmpeg-static", "package.json"))) return { version: "5.3.0" };
			if (name === "node:fs") return Object.fromEntries(["chmodSync", "copyFileSync", "mkdirSync"].map(key =>
				[key, (...args) => calls.push([key, ...args])]));
			if (name === "node:child_process") return { execFileSync(...args) {
				calls.push(["exec", ...args]);
				if (rejectArchitecture && args[0] === "lipo") throw new Error("wrong architecture");
			} };
			throw new Error(`Unexpected module: ${name}`);
		},
	};
	vm.runInNewContext(fs.readFileSync(path.join(__dirname, "prepare-macos-package.cjs"), "utf8"), sandbox);
	return { hook: sandbox.module.exports, calls };
}

function context(platform, arch) {
	return { electronPlatformName: platform, arch, appOutDir: "/output", packager: {
		projectDir: "/project", appInfo: { productFilename: "Zenvue" },
	} };
}

test("leaves Windows packaging untouched", async () => {
	const { hook, calls } = loadHook();
	await hook(context("win32", 1));
	assert.equal(calls.length, 0);
});
for (const [arch, target, macho] of [[1, "x64", "x86_64"], [3, "arm64", "arm64"]]) {
	test(`stages and verifies target ${target} independently of host architecture`, async () => {
		const { hook, calls } = loadHook();
		await hook(context("darwin", arch));
		const install = calls.find(call => call[0] === "exec");
		assert.equal(install[3].env.npm_config_arch, target);
		assert.equal(install[3].env.npm_config_platform, "darwin");
		assert.ok(install[3].env.FFMPEG_BIN.includes(path.join("5.3.0", target, "ffmpeg")));
		const copy = calls.find(call => call[0] === "copyFileSync");
		assert.equal(copy[1], install[3].env.FFMPEG_BIN);
		assert.ok(copy[2].includes("app.asar.unpacked"));
		const checks = calls.filter(call => call[1] === "lipo");
		assert.equal(checks.length, 2);
		assert.ok(checks.every(call => call[2][1] === "-verify_arch" && call[2][2] === macho));
		assert.ok(checks[1][2][0].includes(path.join("darwin", target, "ffprobe")));
	});
}
test("fails packaging when a binary has the wrong architecture", async () => {
	const { hook } = loadHook({ rejectArchitecture: true });
	await assert.rejects(hook(context("darwin", 3)), /wrong architecture/);
});
test("rejects unsupported universal packaging", async () => {
	const { hook } = loadHook();
	await assert.rejects(hook(context("darwin", 4)), /Unsupported/);
});
