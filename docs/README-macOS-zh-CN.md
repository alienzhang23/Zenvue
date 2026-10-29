# Zenvue 1.4.3：macOS 安装与首次使用

## 选择下载包

- Apple Silicon（M1、M2、M3 等 M 系列芯片）：Zenvue-1.4.3-macos-arm64.zip。
- Intel 芯片：Zenvue-1.4.3-macos-x64.zip。
- 点击苹果菜单 → 关于本机，可查看芯片类型。
- 本次原生录屏组件要求 macOS 14 或更新版本。

## 安装

1. 解压下载的 ZIP。本说明和许可证文件位于解压目录内。
2. 双击目录中的 Zenvue-arm64.dmg 或 Zenvue-x64.dmg。
3. 将 Zenvue.app 拖到“应用程序”（Applications）文件夹。请从“应用程序”启动，不要直接在 DMG 内长期运行。
4. 安装完成后，可以推出磁盘映像。

## 首次打开被 macOS 阻止时

本次 Mac 包没有 Apple Developer ID 签名，也没有经过 Apple 公证。Apple Silicon 包可能有临时签名，但不代表 Apple 已验证开发者或完成公证。

如果出现“无法验证开发者”或“Apple 无法检查其是否包含恶意软件”等提示，且你确认文件来自 Zenvue 官方 GitHub Release：

1. 先在“应用程序”中尝试打开 Zenvue 一次；被阻止后关闭提示。
2. 打开苹果菜单 → 系统设置 → 隐私与安全性。
3. 向下滚动到安全性区域，找到 Zenvue 被阻止的提示，点击“仍要打开”（Open Anyway）。
4. 按系统提示输入密码或使用 Touch ID，并再次确认打开。

之后通常可正常双击启动。不同 macOS 版本的文案可能略有差异；新版系统请以“隐私与安全性”中的入口为准。

若没有“仍要打开”按钮，或提示“已损坏”“包含恶意软件”，不要盲目忽略。请先从原 Release 重新下载、核对 SHA-256，并反馈完整提示、Mac 芯片与 macOS 版本。公司或学校管理的 Mac 也可能限制手动放行，请联系设备管理员。不需要关闭整个系统的安全保护。

Apple 官方操作说明：https://support.apple.com/zh-cn/102445

## 录屏、声音和摄像头权限

第一次使用对应功能时，按系统提示授权。也可在“系统设置 → 隐私与安全性”中检查 Zenvue 的权限：

- 屏幕录制，或“屏幕与系统音频录制”：用于录制屏幕及相关声音。
- 麦克风：需要录制麦克风声音时开启。
- 摄像头：需要录制摄像头时开启。
- 辅助功能或输入监控：如系统为光标、快捷键等功能请求此权限，再按提示授权。

如系统要求退出并重新打开应用，请先保存项目，再重新启动 Zenvue。没有出现的权限项目不必预先添加。

## 升级、字幕与验证范围

- 升级前退出正在运行的旧版，然后从“应用程序”启动新版。
- 包内包含 Whisper 运行时，字幕模型需在应用内另行下载或选择兼容的本地模型。
- 两种架构的包已通过 GitHub 构建、类型检查、原生组件文件检查、FFmpeg/FFprobe 架构检查以及 DMG/ZIP 完整性检查。
- 尚未完成物理 Mac 上的安装、录屏、声音和导出全流程验收。首次发布的 Mac 包请先做一次短录制和导出测试，确认结果可播放后再用于正式录制。
- Mac 程序对应源码提交为 311cd2eab0eaf0e92edc240654755df207c0947a，单独提供 Zenvue-1.4.3-macos-source.zip；原 Windows 源码包保持原样。

发布与问题反馈：https://github.com/alienzhang23/Zenvue/releases/tag/v1.4.3

## 校验与许可证

Release 的 SHA256SUMS.txt 包含下载附件的 SHA-256。可在终端运行以下命令查看下载包校验值，并与文件中对应行比较：

```sh
shasum -a 256 ~/Downloads/Zenvue-1.4.3-macos-arm64.zip
```

Intel 用户将文件名替换为 Zenvue-1.4.3-macos-x64.zip。

请保留随包提供的 LICENSE.md、NOTICE.md 和 THIRD_PARTY_NOTICES.md。Zenvue 采用 AGPLv3，不附带担保。
