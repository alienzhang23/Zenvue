const { execFileSync } = require("node:child_process");
const { chmodSync, copyFileSync, mkdirSync } = require("node:fs");
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
	chmodSync(ffprobe, 0o755);
	for (const binary of [ffmpeg, ffprobe]) {
		execFileSync("lipo", ["-verify_arch", arch === "x64" ? "x86_64" : "arm64", binary], { stdio: "inherit" });
	}
};
