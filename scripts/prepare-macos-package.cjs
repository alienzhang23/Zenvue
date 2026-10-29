const { execFileSync } = require("node:child_process");
const { chmodSync, copyFileSync, mkdirSync, readFileSync } = require("node:fs");
const { createHash } = require("node:crypto");
const path = require("node:path");

// ffmpeg-static installs for the build host. Each app must instead contain
// the binary for its target architecture, including when cross-packaging.
module.exports = async function prepareMacosPackage(context) {
	if (context.electronPlatformName !== "darwin") return;
	const arch = require("builder-util").Arch[context.arch];
	if (arch !== "arm64" && arch !== "x64") {
		throw new Error(`Unsupported macOS package architecture: ${arch}`);
	}
	const projectRoot = context.packager.projectDir;
	const ffmpegVersion = require(path.join(projectRoot, "node_modules/ffmpeg-static/package.json")).version;
	const cacheDir = path.join(projectRoot, ".tmp", "macos-ffmpeg", ffmpegVersion, arch);
	mkdirSync(cacheDir, { recursive: true });
	const cachedBinary = path.join(cacheDir, "ffmpeg");
	execFileSync(process.execPath, [path.join(projectRoot, "node_modules/ffmpeg-static/install.js")], {
		stdio: "inherit",
		timeout: 300000,
		env: { ...process.env, npm_config_platform: "darwin", npm_config_arch: arch, FFMPEG_BIN: cachedBinary },
	});
	const unpacked = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`,
		"Contents", "Resources", "app.asar.unpacked");
	const ffmpeg = path.join(unpacked, "node_modules/ffmpeg-static/ffmpeg");
	copyFileSync(cachedBinary, ffmpeg);
	chmodSync(ffmpeg, 0o755);
	const ffprobe = path.join(unpacked, "node_modules/ffprobe-static/bin/darwin", arch, "ffprobe");
	if (arch === "arm64") {
		// ffprobe-static 3.1.0's darwin/arm64 file is actually x86_64.
		// Pin the native binary from the same release used by ffmpeg-static.
		const probeCache = path.join(cacheDir, "ffprobe");
		execFileSync("curl", ["--fail", "--location", "--retry", "3", "--output", probeCache,
			"https://github.com/eugeneware/ffmpeg-static/releases/download/b6.1.1/ffprobe-darwin-arm64"],
			{ stdio: "inherit", timeout: 300000 });
		const checksum = createHash("sha256").update(readFileSync(probeCache)).digest("hex");
		if (checksum !== "bb2db6f5d8cef919da12fbf592119a987202a8c060a886f3cab091f9cab90b64") {
			throw new Error("macOS arm64 FFprobe SHA-256 integrity check failed");
		}
		copyFileSync(probeCache, ffprobe);
	}
	chmodSync(ffprobe, 0o755);
	for (const binary of [ffmpeg, ffprobe]) {
		execFileSync("lipo", [binary, "-verify_arch", arch === "x64" ? "x86_64" : "arm64"], { stdio: "inherit" });
	}
};
