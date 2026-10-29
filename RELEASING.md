# Building and releasing Zenvue

This repository has its own identity and does not publish to Recordly's releases, update servers or Homebrew tap. The upstream publishing guide and Homebrew cask are preserved under docs/upstream/ only as historical reference. The macOS workflow builds unsigned artifacts for validation and download; publishing a GitHub Release remains a deliberate maintainer action.

## Build prerequisites

- Node.js 22 or later and npm.
- Windows: Visual Studio C++ Build Tools, Windows SDK and CMake.
- macOS: Xcode Command Line Tools and CMake; platform-specific code still needs validation on a Mac.
- Optional NVIDIA export compositor: CUDA Toolkit and NVIDIA Video Codec SDK. Supply the latter via RECORDLY_NVIDIA_VIDEO_CODEC_SDK_ROOT according to its license; it is not included in Git.
- Internet access for npm dependencies, Whisper runtime/model downloads when requested, Electron and packaging tools.

## Windows source build

Run npm ci, npm run build:platform-native-helpers, npm run typecheck, npm test and npm run package:local. The package is written to release/zenvue/win-unpacked. Keep the complete folder together.

The npm install hook prepares native modules and helpers. If diagnosing an installation failure, npm ci --ignore-scripts installs source dependencies without running those steps; explicitly run npm run rebuild:native and npm run build:platform-native-helpers afterward. Ignoring install scripts alone does not produce a runnable native recording build.

Generated native helpers, build caches and packaged executables are excluded from Git. Follow errors from each helper build script to install missing toolchains. An optional component that cannot be built on a fresh machine must not be represented as validated.

## macOS source build

On an Apple Silicon or Intel Mac, install Node.js 22 or later, npm, CMake and Xcode Command Line Tools. From the repository root:

```sh
npm ci
npm run build:mac
```

The builder writes both architectures to `release/`: `Zenvue-arm64.dmg`, `Zenvue-arm64.zip`, `Zenvue-x64.dmg` and `Zenvue-x64.zip`. Run `npm run checksums:release` after a successful build to create `release/SHA256SUMS.txt`. The macOS build is unsigned and unnotarized unless the maintainer supplies signing credentials; do not describe a local artifact as an official release.

Local builds require CMake to build the Whisper runtime. If CMake is unavailable and you explicitly accept a package without local automatic captions, run `WHISPER_RUNTIME_ALLOW_MISSING=1 npm run build:mac`. Models are downloaded separately; a missing model does not prevent packaging. Record any runtime limitation with the artifact and keep the source and license notices for the exact version.

For both caption-runtime architectures, set `WHISPER_RUNTIME_ARCHS=all` for both `npm ci` and `npm run build:mac`. The workflow sets this automatically and checks the packaged runtime files, FFmpeg/FFprobe target architectures, and DMG/ZIP integrity before uploading artifacts. These checks do not replace recording and export acceptance on physical Macs.

The `macos-build.yml` workflow runs the same source build on GitHub-hosted macOS and uploads DMG, ZIP and checksum artifacts for review. It does not publish a release automatically.

## Before distributing

- Retain LICENSE.md, NOTICE.md, THIRD_PARTY_NOTICES.md and the application's visible attribution.
- Provide recipients with the complete corresponding source for the exact released version, including build scripts and your modifications, in a form meeting AGPLv3. A private repository link is not sufficient for recipients without access. Review section 13 for modified programs used over a network.
- Preserve dependency and asset license notices. Review FFmpeg build configuration and licensing, codecs, model/runtime terms, NVIDIA SDK terms and platform signing requirements for the particular binaries being distributed. Downloadable dependencies are not automatically covered by Zenvue's license.
- Test recording, source selection, pause/resume, stopping, cursor/typing zoom, microphone/webcam sync, project reopening and export. No new end-to-end recording acceptance was performed as part of repository preparation.
- Sign releases using your own credentials if appropriate. Do not reuse upstream signing credentials or publish upstream update metadata.

## Release artifacts

GitHub Releases now distribute a Windows x64 ZIP bundle, a source ZIP for the exact version tag, and SHA256SUMS.txt. Include README.md, LICENSE, LICENSE.md, NOTICE.md and THIRD_PARTY_NOTICES.md alongside the executable. The default README is Chinese; README.en.md is the English reference. Models are not included.

Update package.json, the root package entries in package-lock.json, and enhanced-builder.json together when changing a version. Build and check the package, commit the corresponding sources, push the version tag, upload artifacts to a draft release, and publish only after verifying all uploads. Do not change repository visibility as part of a release.

For this local workspace, update the desktop entry after each package with scripts/update-desktop-shortcut.ps1 -AppPath <absolute path to Zenvue.exe>. This changes the shortcut only; exit an already running old version before using the new entry.
