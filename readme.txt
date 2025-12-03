
# 俄罗斯方块 (Retro Brick Game) - 多端适配版指南

本项目采用 React 开发，已配置为支持 **Web (H5)** 和 **微信小程序 (Taro)** 双端运行。

---

## 🚀 方式一：Web 端运行 (当前环境)

如果你只是想在网页上玩，或者进行快速开发：
1. 直接在当前编辑器/浏览器预览即可。
2. 入口文件为 `index.html` 和 `index.tsx`。

---

## 📱 方式二：微信小程序 (Taro) 运行指南

我已为你创建好了所有必需的配置文件（`package.json`, `tailwind.config.js`, `project.config.json` 等）。

### 🛠 操作步骤

1. **下载项目**
   将本项目所有文件下载到本地的一个文件夹中（例如 `retro-game`）。

2. **安装依赖**
   确保你本地已安装 Node.js，然后在项目根目录下打开终端，运行：
   ```bash
   npm install
   ```

3. **配置音频文件 (Audio)**
   小程序不支持 Web 的合成音效，你需要准备以下 MP3 文件，并放入项目根目录下的 **`assets/audio/`** 目录中：
   * `move.mp3` (移动)
   * `rotate.mp3` (旋转)
   * `drop.mp3` (掉落/触底)
   * `clear.mp3` (消除)
   * `gameover.mp3` (游戏结束)
   * `start.mp3` (开始)
   
   **目录结构示例：**
   ```
   retro-game/
   ├── assets/
   │   └── audio/
   │       ├── move.mp3
   │       └── ...
   ├── components/
   ├── config/
   ├── package.json
   └── ...
   ```
   
   *注意：如果 `assets/audio` 目录不存在，请手动创建。构建系统已配置为将根目录下的 `assets` 自动复制到 `dist/assets`。*

4. **运行小程序开发模式**
   ```bash
   npm run dev:weapp
   ```

5. **导入微信开发者工具**
   * 打开「微信开发者工具」。
   * 选择「导入项目」。
   * **目录**：选择你的项目根目录。
   * **AppID**：可以选择「测试号」。
   * 导入成功后，你应该能看到游戏画面。

### ⚠️ 重要注意事项

1. **声音 (Sound)**
   * **Web 端**：完美支持复古合成音效，无需 MP3。
   * **小程序端**：使用 `Taro.createInnerAudioContext` 播放 MP3 文件。如果未放入 MP3 文件，点击按钮将不会有声音，但游戏可正常运行。

2. **样式 (Tailwind)**
   * 配置文件 `config/index.js` 已集成 `weapp-tailwindcss-webpack-plugin`，确保 Tailwind 类名在小程序中能正常工作。
   * 全局样式位于 `app.css`。

3. **字体**
   * 小程序默认无法加载 Google Fonts，游戏内文字将显示为设备默认字体（通常也很好看）。

祝你开发愉快！