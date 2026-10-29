# Zenvue

![Zenvue 标志](branding/approved-logo-preview.png)

**把屏幕操作录下来，做成清晰、流畅的演示视频。**

Zenvue 是一款本地桌面录屏与视频编辑软件，适合制作软件教程、产品演示、操作说明和问题反馈。录制后可以调整自动缩放、光标、背景和字幕，再导出为 MP4 或 GIF。

默认免费版无需登录即可使用本地录制与编辑。视频和工程保存在本地；录制不依赖云端账户。

[下载最新版](https://github.com/alienzhang23/Zenvue/releases/latest) · [问题反馈](https://github.com/alienzhang23/Zenvue/issues) · [更新记录](CHANGELOG.md) · [English](README.en.md)

## 主要功能

| 功能 | 说明 |
| --- | --- |
| 屏幕、窗口与区域录制 | 选择整个屏幕、单个窗口，或拖动框选录制区域；框选松手即选中，无需回车。非全屏的框选区域可拖动位置、调整大小。 |
| 录制浮窗与托盘 | 使用浮窗选择录制源、设置麦克风和摄像头、控制录制；Windows 托盘可重新唤出浮窗，主页也提供返回入口。 |
| 自动缩放与聚焦 | 围绕鼠标操作和输入过程生成缩放效果，也可在时间线上调整缩放区域与时机。 |
| 光标展示 | 调整光标大小、样式和运动效果，让观众更容易跟上操作。 |
| 声音与摄像头 | 按需录制麦克风、系统声音和摄像头画面；具体支持情况取决于系统与设备。 |
| 时间线编辑 | 裁剪与调整视频片段，设置缩放、标注、音频及摄像头画面。 |
| 演示画面美化 | 设置背景、画面比例、边距、圆角和阴影，整理成适合分享的演示画面。 |
| 本地字幕 | 使用本地 Whisper 生成字幕，并编辑字幕内容。使用前需要准备识别运行时和模型，首次下载模型需要联网。 |
| MP4 / GIF 导出 | 选择输出尺寸、帧率和质量；部分 NVIDIA 环境可使用实验性的 GPU 导出路径。 |
| 本地工程管理 | 在主页整理录制和工程，保存为可继续编辑的 `.recordly` 工程文件。 |

## 下载与使用

当前 Release 提供 **Windows x64 解压即用包**。macOS 的 DMG / ZIP 可以从源码构建；仓库提供可重复的 GitHub Actions 构建入口。

1. 到 [Releases](https://github.com/alienzhang23/Zenvue/releases) 下载 `Zenvue-版本号-windows-x64.zip`。
2. 将整个压缩包解压到固定目录，运行其中的 `Zenvue.exe`。请保留旁边的 `resources`、DLL 等文件，不要只移动 EXE。
3. 在浮窗中选择录制源，按需开启声音和摄像头，再点击录制按钮。
4. 停止录制后进入编辑器，调整画面并导出。

### macOS 本地构建

在 macOS 上安装 Node.js 22+、npm 和 Xcode Command Line Tools 后运行：

```sh
npm ci
npm run build:mac
```

构建产物位于 `release/`，包括 `Zenvue-arm64.dmg` / `Zenvue-arm64.zip`（Apple Silicon）和 `Zenvue-x64.dmg` / `Zenvue-x64.zip`（Intel）。本地构建默认未签名、未公证；首次打开时可能需要在 Finder 中右键选择“打开”。完整依赖、许可证和验证边界见 [RELEASING.md](RELEASING.md)。

升级前先退出正在运行的旧版，再启动新版。同一时间已运行的旧进程可能让你再次打开旧界面。Windows 托盘图标如果未直接显示，可在任务栏的隐藏图标区域查看。

### 蓝色框、黄色框与 Esc

- **蓝色框：正在选择录制源。** 拖动框选后松开鼠标即可选中；Esc 取消本次选择。
- **黄色框：录制区域已选定，尚未开始录制。** 屏幕顶部显示“录制区域已选定 · 按 Esc 退出选择”；Esc 清除已选区域、边框和遮罩。
- **录制中：** Esc 停止并保存录制，不会丢弃本次视频。

## 本地使用与兼容性

- 默认构建隐藏尚未上线的账户和云端分享入口；反馈入口跳转至本仓库 Issues。
- 可继续使用 `.recordly` 工程格式和兼容的旧设置键。Windows 上如存在此前增强版的数据目录，会继续复用；不读取原版 Recordly 的资料目录。
- 本分支不接收上游 Recordly 的自动更新，也不覆盖其协议注册。
- 仓库保留跨平台代码，但本次发布包仅面向 Windows x64；macOS 与 Linux 可参考源码构建说明。

## 从源码运行

需要 Node.js 22 或更新版本及 npm。Windows 原生组件构建还需要 Visual Studio C++ Build Tools、Windows SDK 和 CMake。

```sh
git clone https://github.com/alienzhang23/Zenvue.git
cd Zenvue
npm ci
npm run dev
```

检查与打包：

```sh
npm run typecheck
npm test
npm run build:platform-native-helpers
npm run package:local
```

`package:local` 默认生成 `release/zenvue/win-unpacked`。全新环境需要先准备原生辅助程序；可选的 NVIDIA CUDA 组件还需要相应工具链与 SDK。完整步骤及依赖说明见 [RELEASING.md](RELEASING.md)。

账户服务属于可选部署能力，默认不启用。需要接入时，须显式启用 `VITE_ZENVUE_ACCOUNTS_ENABLED=1` 并配置自己的 Supabase、回调及分享服务。

## 来源、署名与许可证

Zenvue 由 [alienzhang23](https://github.com/alienzhang23) 独立维护，基于 [Recordly](https://github.com/webadderallorg/Recordly) 修改；Recordly 最初源自 [OpenScreen](https://github.com/siddharthvaddem/openscreen)。**Zenvue 不是 Recordly 或 OpenScreen 的官方发行版。**

- Recordly：Copyright © 2026 webadderall。
- OpenScreen：Copyright © 2025 Siddharth Vaddem。
- 本项目采用 [GNU AGPLv3](LICENSE)，按许可证原文提供，不附带担保；上游完整许可证及原始 MIT 署名保留在 [LICENSE.md](LICENSE.md)。
- 来源、维护关系和修改说明见 [NOTICE.md](NOTICE.md)；依赖及资源的声明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。应用界面继续保留上游署名。
- 分发本软件时须保留适用声明，并按许可证要求提供对应版本源码。Release 提供与版本标签对应的源码包；第三方组件仍遵循各自许可证。

仓库的初始提交来自本地衍生版本快照，未包含更早的上游 Git 历史。原始 README 保存在 `docs/upstream/`，Zenvue 的修改记录见 [CHANGELOG.md](CHANGELOG.md)。
