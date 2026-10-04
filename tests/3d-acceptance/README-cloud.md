# r9 autonomous cloud acceptance

This workflow reads the public r9 page and writes only test evidence. It runs on
the dedicated `qa/3d-r9-20261004` branch. There is no build, merge, Pages, or
deployment step. The website files and publishing branch are preserved.

The initial `QA_MODE: smoke` checks the installed Google Chrome, actual WebGL
draws, context health, and a real screenshot. Only after inspecting that evidence
may the mode be changed to `full`. The full runner always performs the minimum
load check again before testing interactions, views, assembly steps and model
geometry. A failed minimum stops the remaining work.

The runner uses explicit ANGLE SwiftShader software WebGL on the isolated Linux
CI machine, normal HTTPS certificate validation, and real mouse input. It does
not apply the earlier 3fps diagnostic limit or DOM button shortcuts. The report
records actual Chrome/Node versions, runner commit/run ID, rendering backend,
source resource hashes, errors and protected-file hashes.

Dependencies are locked in package-lock.json. The Ubuntu runner image and its
preinstalled Chrome are maintained by GitHub; actual versions are recorded each
time, rather than claimed to be immutable. Evidence is retained as a GitHub
Actions artifact for 30 days and must be retrieved and visually reviewed before
acceptance. Unknown real-world fit, screw lengths, pin assignments and shielding
remain unverified. This validates the website, not the user's local PC or vehicle.

The full runner's screenshots and measured data do not alone certify label
clarity, animation smoothness or physical assembly accuracy. The reviewer must
inspect the actual resulting pictures and state every remaining limitation.

## GPT重用入口（2026-10-04）

用户要求全程自主检查，无需其下载、安装插件、运行本机脚本或传截图。
此说明保存当前项目方法；通用方法已加入 `threejs-3d-engineering` 技能。
开始新一轮时核实当前页面/源版本和权限，不将以下历史成功运行当成新验收。

| 项目 | 已核实入口 |
| --- | --- |
| 仓库 | `zhoujintian111/zhoujintian111.github.io` |
| QA分支 | `qa/3d-r9-20261004` |
| 工作流 | `.github/workflows/r9-3d-acceptance.yml` |
| 测试目录 | `tests/3d-acceptance/` |
| r9网页 | https://zhoujintian111.github.io/?assembly=comm-backplate&v=assembly-20261003-r9 |
| 最小成功运行 | https://github.com/zhoujintian111/zhoujintian111.github.io/actions/runs/37168263935 |
| 完整成功运行 | https://github.com/zhoujintian111/zhoujintian111.github.io/actions/runs/37168445118 |
| 已运行测试提交 | `bf09c7a9111830e63352c5a3e58cc3eb3d73254c` |
| 当次未改动的main | `b0d1734fa2266d888b19f2684ffbbf7784ec713f`（历史记录，不替代未来基线） |

如果主分支没有测试文件，读取上述QA分支，不重建脚本或更改网站。
目前工作流仅监听QA分支push，没有workflow_dispatch。
使用可用的GitHub重跑工具重复既有job；先核对工具说明、目标job可重跑状态和Actions写权限。
重跑工具本次未调用，不将它列为已经实际执行过的操作。
无重跑能力时，仅在既有授权内调整QA测试配置来触发，不能修改网站文件充当触发器。

在该测试目录执行的实际云端命令：

```bash
npm ci --no-audit --no-fund
node run.mjs --full --headless --cloud-ci --software-webgl --output results/cloud
```

已有环境无需重建。完整runner仍先进行最小检查；第一次迁移环境或最小失败后，
先用 `--smoke` 获得真实模型截图并看图，才扩展完整测试。
现有 `--details-only` 需与 `--full` 一起使用，只选择通讯板和GX细节流程，不是任意步骤筛选或完整回归；
不能把它称为已经支持所有局部改动的快速模式。

## GPT自主获取证据

发现并按实际工具schema调用GitHub连接：

1. 读取真实run状态和jobs；完成后取得artifact列表及必要job日志。
2. 用 `github_download_workflow_artifact` 获得文件引用；取其中实际 `file_id`，
   交给 `download_file` 落地。不要打印临时下载URL，也不要让用户下载后传回。
3. 核对artifact digest、ZIP路径安全、`cloud/report.json`中的run/commit、
   iframe版本和资源哈希，实际查看关键PNG。
4. 保存截图和复核结论，回复直接展示真实图片。产物通常保留30天；过期后重新运行。

完整run37168445118的artifact ID是 `11290772831`，SHA-256为
`8d038e46683d82fe165e9f89ac44da2cc3947117b58bbb0612ef4e2c120616d2`。
它保存68张PNG，对应34个不同画面，34种画面已逐图复核。
环境为GitHub Ubuntu VM、Chrome154.0.8037.57、WebGL2/SwiftShader软件渲染，
正常TLS、无3fps限帧；此结果不能称用户电脑或实车验收。

## 当前已确认布局与检查依据

以下来自本项目用户指令，后续有明确替代指令时更新，不用当前代码反推预期。

| 验收点 | 用户依据 | 检查方法 |
| --- | --- | --- |
| 三块恒流板L型：右上、右下、左下；1在Orion右、2在1下、3在2左 | 用户要求“对照已确认的布局检查：三块恒流板为L型”及此前确认相对位置 | 真实模型位置关系与全景图 |
| 两根导轨各150 mm，左一进四端子+CM5，右交换机+路由器 | 用户要求“导轨用2根15cm的，左边是1分4端子和CM5；右边是交换机和路由器” | 实际几何、单位与设备映射 |
| GX电视右侧同一正面白墙，中心高1450 mm | 用户要求“GX在电视右侧同一面墙上且中心高1450 mm” | 有限墙面、朝向、观看右轴与完成地板上表面 |
| 红线通过一进四出保险座；黑线通过独立一进四端子 | 用户要求“黑线就从这个一换四的这个端子，然后红色线呢就是这个保险座”并要求端子移到导轨 | 分支数量、两端端口与画面 |
| 固定件、卡扣、线缆和标注清晰；不猜未知项 | 用户要求“同时检查螺丝、卡扣、线缆和标注。无法从画面或模型数据确认的项目标为待核实，不要猜” | 细节步骤与逐图复核；实际工程资料另核实 |

## 已发现的问题与覆盖限制

完整工作流成功，自动18项通过、4项待核实，运行错误为空；网页视觉并未全部通过。
已观察到通讯板爆炸图C15底部标注裁切、部分卡扣/保险座过度透明、
GX底部信息卡遮挡视角按钮。改装后悬浮文案含“Buck IN+”需核对含义；
普通场景颗粒较强，不能据云端图认定用户GPU同样表现。

保留待核实：C13/C15/G03实物螺丝长度和固定适配、卡扣实物尺寸/夹持、
RS485防水针脚/屏蔽收口/接地、实车完整线缆两端与极性。
当前模型只有4个设备自带卡扣，独立限位夹数量为0；步骤10检查自带扣，
独立限位夹需求仍需与此前要求核对。本次未测英文无中文残留。

模式按钮和相机使用实际点击/鼠标；步骤进度使用DOM input事件定位，
未证明滑块拖动手势。实际播放验证了一个步骤的运动，不代表全部连续动画流畅。
暂停后未等待异步状态确认，不能说暂停已验证或存在故障。
RS485截图取80%插接阶段、GX接头取70%阶段，不能把未完成动作误判为断线。

后续局部改动仅检查影响范围和核心不变项；没有新问题不重复全量。
只保存说明时可采用GitHub支持的文档跳过CI标记，不能用它跳过实际代码或测试修改。

## r10候选修复验收

2026-10-04起，本工作流在QA分支内用Python HTTP服务运行候选网站，再用云端Chrome验收；不发布候选文件。原r9公开站点验收记录仍是历史证据。

`--repair-only` 与 `--full` 一起使用：保留真实旋转、缩放、平移、爆炸/常规复位、动画运动及L型/导轨/GX几何检查，局部截图选取四台卡扣55%/100%、保险座、卡扣汇总和一路RS485，以及GX常规、爆炸和两处安装步骤。不会将未覆盖的动画步骤或实物条件算作新验收。

```bash
python3 -m http.server 8765 --bind 127.0.0.1 --directory ../..
# 另一进程，在测试目录执行
node run.mjs --full --repair-only --headless --cloud-ci --software-webgl --url 'http://127.0.0.1:8765/?assembly=comm-backplate&v=assembly-20261004-r10' --output results/cloud
```

报告还记录C01–C15标注投影是否落入实际可见画布、当前卡扣固定钩的不透明度及GX重复信息卡隐藏状态；清晰度仍须实际看截图，未知实物规格继续待核实。

本轮最小运行37170748309、局部回归37170901526。局部回归耗时约6分55秒，保存46张PNG/23种画面；21项自动检查通过、4项仍含实物/视觉限制，23种画面已人工视觉复核。候选资源是r10；发布main为351bf182d82ad441ab6122b008b2f652477d73a5。首次测试前已逐个核对原main资源与本地dist。

`verify-published.mjs`在云端逐文件比对公开网站与QA候选的SHA-256；设置工作流`QA_MODE: published`执行发布后核对。这是发布内容一致性检查，不冒充另一轮公开站点浏览器操作。

最终main为67be44377d571eb2c09e53896b004f202568be4a；仅补充CSS缓存版本参数，样式内容与已视觉验证的候选一致。Pages运行37171517551已部署成功。

公开文件核对37171542727通过：5个修改文件HTTP 200及SHA-256完全一致，无错误。证据包为r10-3d-review-20261004.zip，含原始截图、报告、视觉复核和线上哈希；以后从该名字查找，不依赖30天GitHub产物保留。工作流已恢复QA_MODE full作为后续三维验收入口，恢复记录使用[skip ci]，避免为说明重复全测。

## r11半透明标签验收

2026-10-04，标签局部修改使用 `--full --labels-only`：同一Chrome/WebGL最小加载检查后，查看通讯板中英/选中/实际旋转、恒流板、GX中英/选中，检查真实Canvas标签纹理的alpha、白色字形及浅灰背景，并检查GX常规背景恢复。其余几何和装配复位沿用相应源检查，不冒充又一次全动画验收。配色依据本轮用户授权和2026品牌手册p23–25：黑/白、少量橙、科技灰浅；66%底色不透明度是本轮界面选择，并非将手册明度色阶当作透明度。

```bash
node run.mjs --full --labels-only --headless --cloud-ci --software-webgl --url 'http://127.0.0.1:8765/?assembly=comm-backplate&v=assembly-20261004-r11' --output results/cloud
```

仍使用既有QA分支和Python候选服务；只有本轮实际截图核对通过后发布。后续任意改动先核对范围，不能把labels-only当成全量验收。

首次标签运行37172521418保存14张PNG，通讯板15标签/GX8标签的纹理透明度、中英文、选中和实际旋转通过。恒流板5标签样式通过，但背景沿用旧深色，T4失败；保留原始失败报告。随后让恒流板启用同一安装展示 helper，并在常规/退出时恢复，局部重测37173023053通过（4张PNG），检查到真实背景 #e1e1e1、标签alpha168/255、完全不透明白字和正常背景恢复。实际逐张查看了7种首测画面及修复后恒流板画面，不把单纯alpha检查算成视觉验收。

只复查恒流板时可在上述命令中使用 `--board-labels-only` 替代 `--labels-only`；完整标签检查仍保留。几何/装配源检查、共有展示恢复以及语法检查通过。主网站发布提交777f68224f08ac10c4786c3585e2dc794d771f56。

发布后Pages37173182336成功，公开资源核对37173237941通过，6个资源HTTP200且SHA-256一致。证据包r11-label-review-20261004.zip保存首测失败、局部重测、实际截图、视觉复核与线上哈希。默认工作流恢复full/repair-only；这次标签检查仍通过labels-only复用。文档与默认入口恢复提交使用[skip ci]，不为同一未改代码重复渲染。

## r12配件外形精化（2026-10-04）

用户要求细化HDMI、USB、螺丝/螺母/垫片、磁环及GX固定框。
按官方Rev02图、原厂配件图、用户磁环照片和寄送清单照片实施；未测框厚/窗口细部、磁环包络和最终GX螺钉规格仍为示意待核，不声称制造精度。
已确认布局、数量、接线与r11标签保持。

- main源版本：`21f107de02dbc06edc2ba6b104c48b854d5c0578`；Pages运行37177319459成功。
- 实际云端候选：`a995c93b5703b36180da99e65f6504def184f37b`，运行37176969726成功，Chrome154/WebGL2/SwiftShader，运行错误为空。
- 通讯板前后实图和真实鼠标旋转沿用运行37176709104；该运行后来在恒流板测试控件上失败。只复用已通过部分，不将整个失败run算通过。
- 两次报告中实际electrical-new.html的SHA-256相同：`d3b17fb7d69926514e94f4be0473a2d56a537eaf95e5932bf416dd83f2de94da`。
- 最终云端14张PNG加前次4张通讯板PNG，9个不同模型状态的画布已实际查看。公开网址7个文件已HTTPS读取并逐字节哈希比对；此步骤不是新的线上浏览器渲染。
- 原始失败报告保留，视觉结论另记，不修改原始自动报告中的待核实/失败状态。

当前workflow命令带`--hardware-only --hardware-remainder`，仅补查恒流板和GX；通讯板截图复用上述相同资源证据。下一轮不得把此补测配置当成所有改动的全检。
所有r12配件的可重复命令（在提供网站根目录的HTTP服务器下运行）：

```bash
node run.mjs --full --hardware-only --headless --cloud-ci --software-webgl --url 'http://127.0.0.1:8765/?assembly=comm-backplate&v=assembly-20261004-r12' --output results/cloud
```

沿用现有npm锁文件、Chrome和Python服务器；在既有workflow中去掉`--hardware-remainder`即可完整跑该配件范围。更广改动使用已有`--full`与其适用范围，不凭本轮配件截图代替未检查对象。
说明与关键点：`r12-keypoints.json`、`r12-visual-review.json`、`r12-source-provenance.json`、`r12-public-validation.json`。物理数据和个别触点的可见性限制见视觉复核记录。
网页：https://zhoujintian111.github.io/?assembly=gx-touch50&v=assembly-20261004-r12
