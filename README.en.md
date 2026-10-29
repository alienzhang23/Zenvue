# Zenvue

![Zenvue](branding/approved-logo-preview.png)

Zenvue is a local desktop screen recorder and editor derived from [Recordly](https://github.com/webadderallorg/Recordly). It includes region capture, typing-triggered automatic zoom, cursor presentation, explicit export resolutions, and Esc to stop and save.

Maintained by [alienzhang23](https://github.com/alienzhang23). [Download releases](https://github.com/alienzhang23/Zenvue/releases). [中文说明（默认）](README.md) · [Changes](CHANGELOG.md) · [Origin and license notices](NOTICE.md).

## macOS packaging

On macOS, install Node.js 22 or later, npm and Xcode Command Line Tools, then run:

```sh
npm ci
npm run build:mac
```

The `release/` directory contains `Zenvue-arm64.dmg` / `.zip` for Apple Silicon and `Zenvue-x64.dmg` / `.zip` for Intel Macs. Local packages are unsigned and notarization is not performed; Gatekeeper may require you to right-click and choose **Open**. See [release instructions](RELEASING.md) for dependencies, licenses and validation boundaries.

## Development

```sh
npm ci
npm run dev
npm run typecheck
npm run build:local
npm run package:local
```

Use Node.js 22 or later and npm. On Windows, native builds require Visual Studio C++ Build Tools (including the Windows SDK) and CMake. The optional NVIDIA CUDA compositor also requires the CUDA Toolkit and the NVIDIA Video Codec SDK under their own licenses. The install script rebuilds native modules and prepares platform helpers; see [release instructions](RELEASING.md) for build steps and limitations.

`package:local` produces a Windows unpacked application under `release/zenvue`. It reuses the native helpers staged in `electron/native/bin`; these generated binaries are not committed. A fresh clone must prepare them with `npm run build:platform-native-helpers` before packaging. Electron packaging may download its runtime and icon-editing tools. No absolute path to the old desktop workspace is required.

The approved design and transparent master are in `branding/`. `scripts/generate-brand-icons.py` exports the PNG, Windows ICO and macOS ICNS assets using Pillow. This is format conversion and resizing of the approved master; it does not redraw the logo.

## Optional accounts

The default free build works without a Zenvue account. Sign-in, account settings and unavailable cloud-sharing controls are hidden; feedback opens this repository's Issues page. Authentication code is retained for future service integration. Cloud accounts require explicit `VITE_ZENVUE_ACCOUNTS_ENABLED=1` plus your own Supabase configuration; cloud sharing also needs a deployed endpoint. Production OAuth callbacks and backend deployment must be completed before enabling this option. The local build continues to record offline even when optional cloud configuration is present.

## Compatibility

The `.recordly` project format and `recordly.*` preference keys are retained for compatibility. Existing recordings remain in the previous enhanced-build profile. Zenvue reuses that profile on Windows if it exists; the original installed Recordly profile is not used. Upstream auto-updates and protocol registration remain disabled in this local fork.

## Attribution and license

Based on Recordly, Copyright © 2026 webadderall. Recordly began as a fork of OpenScreen, Copyright © 2025 Siddharth Vaddem. This modified application is independently named Zenvue and is not an official Recordly release.

Distributed under [AGPLv3](LICENSE.md), without warranty. Preserve [third-party notices](THIRD_PARTY_NOTICES.md) and the original MIT attribution embedded in the license. See `docs/upstream/` for the upstream README snapshots. The original Recordly name is used only for attribution, upstream references and compatibility.

This source repository is an initial snapshot of the local Zenvue derivative; the original Git history was not present. Zenvue modifications are documented in [CHANGELOG.md](CHANGELOG.md). Private local planning, credentials, recordings, build outputs and generated native binaries are excluded from Git. When distributing a binary, provide recipients with the corresponding source and license notices required by AGPLv3; a private GitHub URL alone is insufficient for recipients without access.
