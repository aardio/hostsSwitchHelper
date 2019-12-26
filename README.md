# hostsSwitchHelper - Hosts切换助手

hosts切换助手调用系统安装的Chromium 内核浏览器创建应用程序，
只要安装了Chrome、EDGE、2345、360.....这些浏览器之一都可以运行。
`生成的EXE文件打包以后只有700KB`，体积只有SwitchHosts的50分之一，
并且可以支持WinXP 到 Win 10的所有流行操作系统（ 支持Win10文件夺权解决不能编辑问题 ）。

此软件功能基本参考SwitchHosts，考虑到SwitchHosts 基于Electron，文件体积比较大（50M+），
不支持XP操作系统，在Win10上也用不了。而且在最新版chrome浏览器已经无法使用remote debugging protocol 来清理DNS缓存了，于是自己动手写一个。

![](https://github.com/xuzhenjun130/hostsSwitchHelper/blob/master/res/main.png?raw=true)

前端使用 vue / element-ui，快速创建一个还算漂亮的界面。   
桌面程序使用aardio开发（ http://www.aardio.com ）。

构建步骤：

- 1. 使用aardio开发环境打开 default.aproj 工程文件
- 2. 在aardio工程中右键点“前端源码”，   
在弹出菜单中选择“用外部编辑器打开”，默认会在VS Code中打开，然后执行命令:
 `npm i` 安装所有node依赖模块
 `npm run build` 就可以编译前端代码
- 3. 在 aardio 开发环境中点击“发布”生成EXE文件。
dist 为软件发布目录，可以看到编译生成的 `Hosts切换助手.exe` 

[下载地址](https://github.com/aardio/hostsSwitchHelper/releases)



