const paths = {
  vehicle: 'assets/views/vehicle-master.html',
  electricalOld: 'assets/views/electrical-old.html',
  electricalNew: 'assets/views/electrical-new.html',
  gxOld: 'assets/views/gx-old.html',
  gxNew: 'assets/views/gx-new.html'
};

const initialLanguage = localStorage.getItem('aiko-language') === 'en' ? 'en' : 'zh';

const ui = {
  zh: {
    pageTitle:'AIKO 展车升级改装系统', mainNav:'主导航', workspace:'三维交互工作区', inspector:'设备信息',
    brandSubtitle:'欧洲展车数字孪生', navGuide:'升级改装导览', navGuideSub:'2 项核心升级', navExterior:'全车外观', navExteriorSub:'车身与光伏组件', navInterior:'车内总览', navInteriorSub:'固定镜头与关键设备', navElectrical:'电路舱', navElectricalSub:'原电路／改装电路', navGx:'GX 与玻璃门', navGxSub:'旧版／新版安装比较', navCatalog:'设备资料', navCatalogSub:'规格、连接与注意事项',
    baselineTitle:'锁定母版已接入', baselineSub:'只读引用 · 不覆盖源版本', versionOld:'旧车系统', versionNew:'改装后系统', compare:'轮廓对比', stepOverview:'定位改装区域', stepElectrical:'电路舱升级', stepGx:'GX 升级', stepCommunication:'通讯检查', coverLabel:'电路舱展示覆盖面', loading:'正在装入锁定视图…',
    commBoards:'恒流板 ×3', commBoardsSub:'三路 RS485 A／B → 隔离 RS485 转 USB', commHub:'有源 USB 集线器', commHubSub:'3 路独立输入，上行 USB 接电脑', commPc:'工业电脑', commPcSub:'RS485 采集、MQTT 发布、固定 IP', commSwitchSub:'5 口工业交换机', commGxSub:'固定 IP 接收与显示',
    tabOverview:'概览', tabSpecs:'规格尺寸', tabConnections:'连接结构', tabNotes:'安装注意', headingOverview:'改装逻辑', headingSpecs:'规格尺寸', headingConnections:'连接结构', headingNotes:'安装注意',
    lockedView:'锁定三维视图', sourceNew:'改装后锁定资产', sourceOld:'原车锁定资产', deviceDetail:'设备详情', genericDevice:'设备', genericDeviceSummary:'当前锁定三维场景中的设备对象。', objectId:'对象标识', genericConnection:'连接关系以当前锁定场景和已确认线路拓扑为准。', genericNote:'未确认的端子、线号和安装数据必须现场复测，不作推定。',
    backGx:'← 返回 GX 安装位置', catalogStatus:'锁定设备资料索引', catalogHint:'选择设备查看规格、连接与安装注意',
    outlineElectricalOld:'旧：MPPT 186 × 132 × 71 mm', outlineElectricalNew:'新：恒流板 158 × 104 × 58.8 mm', outlineBracket:'支架总宽 257 mm', outlineGxOld:'旧 GX 130 × 120 × 28 mm', outlineGxNew:'Ekrano 正面 187 × 124 mm', outlineDisclaimer:'尺寸概念示意，非等比例安装图；开孔与安装以官方尺寸图及现场复测为准。',
    statusRearForward:'后部向前固定镜头', hintGuide:'展示面将自动上掀，请选择高亮改装区域', statusCommunication:'通讯连接检查', hintStaticIp:'固定 IP · 无需路由器', statusElectricalNew:'新电路系统 v1.0', statusElectricalOld:'旧车系统 v1.0', hintElectricalNew:'三块恒流板、MC4 与通讯汇聚', hintElectricalOld:'三台 MPPT 与原车线路基准', statusGxNew:'新版 GX v01', statusGxOld:'旧版 GX v01', hintGxNew:'Ekrano GX 官方尺寸与安装包络', hintGxOld:'Color Control GX 拆换基准', statusExterior:'外观固定镜头', hintExterior:'点击高亮组件查看规格与安装信息', statusInterior:'车内固定镜头', hintInterior:'点击电路舱、组件或 GX 查看资料', statusGxLocation:'GX 安装位置', hintGxLocation:'点击 GX 高亮标记进入毫米级近景'
  },
  en: {
    pageTitle:'AIKO Show Vehicle Upgrade System', mainNav:'Main navigation', workspace:'Interactive 3D workspace', inspector:'Device information',
    brandSubtitle:'Europe Show Vehicle Digital Twin', navGuide:'Upgrade Guide', navGuideSub:'2 core upgrades', navExterior:'Vehicle Exterior', navExteriorSub:'Body and PV modules', navInterior:'Interior Overview', navInteriorSub:'Fixed views and key devices', navElectrical:'Electrical Bay', navElectricalSub:'Original / upgraded circuits', navGx:'GX & Glass Door', navGxSub:'Original / new installation', navCatalog:'Device Data', navCatalogSub:'Specs, wiring and notes',
    baselineTitle:'Locked masters connected', baselineSub:'Read-only references · originals preserved', versionOld:'Original System', versionNew:'Upgraded System', compare:'Outline Compare', stepOverview:'Locate Upgrade Areas', stepElectrical:'Electrical Bay', stepGx:'GX Upgrade', stepCommunication:'Communication Check', coverLabel:'Electrical-bay display cover', loading:'Loading locked view…',
    commBoards:'Constant-current boards ×3', commBoardsSub:'3 × RS485 A/B → isolated RS485-to-USB', commHub:'Powered USB Hub', commHubSub:'3 independent inputs; upstream USB to PC', commPc:'Industrial PC', commPcSub:'RS485 acquisition, MQTT publishing, static IP', commSwitchSub:'5-port industrial Ethernet switch', commGxSub:'Static-IP data receiver and display',
    tabOverview:'Overview', tabSpecs:'Specifications', tabConnections:'Connections', tabNotes:'Installation', headingOverview:'Upgrade Logic', headingSpecs:'Specifications', headingConnections:'Connection Structure', headingNotes:'Installation Notes',
    lockedView:'Locked 3D view', sourceNew:'Locked upgraded asset', sourceOld:'Locked original asset', deviceDetail:'Device Details', genericDevice:'Device', genericDeviceSummary:'Device object in the currently locked 3D scene.', objectId:'Object ID', genericConnection:'Connection data follows the locked scene and confirmed wiring topology.', genericNote:'Any unconfirmed terminal, wire ID or installation dimension must be verified on the vehicle.',
    backGx:'← Back to GX Installation', catalogStatus:'Locked Device Index', catalogHint:'Select a device for specifications, connections and installation notes',
    outlineElectricalOld:'Original: MPPT 186 × 132 × 71 mm', outlineElectricalNew:'New: board 158 × 104 × 58.8 mm', outlineBracket:'Bracket width 257 mm', outlineGxOld:'Original GX 130 × 120 × 28 mm', outlineGxNew:'Ekrano front 187 × 124 mm', outlineDisclaimer:'Conceptual size comparison, not a scaled installation drawing. Use official drawings and on-vehicle measurements for installation.',
    statusRearForward:'Rear-to-front fixed view', hintGuide:'The display cover opens automatically; select a highlighted upgrade area', statusCommunication:'Communication Connection Check', hintStaticIp:'Static IP · no router required', statusElectricalNew:'New Electrical System v1.0', statusElectricalOld:'Original Vehicle System v1.0', hintElectricalNew:'Three constant-current boards, MC4 and communication aggregation', hintElectricalOld:'Three MPPT units and original wiring baseline', statusGxNew:'New GX v01', statusGxOld:'Original GX v01', hintGxNew:'Official Ekrano GX dimensions and installation envelope', hintGxOld:'Color Control GX replacement baseline', statusExterior:'Exterior Fixed View', hintExterior:'Select a highlighted module for specifications and installation data', statusInterior:'Interior Fixed View', hintInterior:'Select the electrical bay, PV module or GX for details', statusGxLocation:'GX Installation Position', hintGxLocation:'Select the highlighted GX to open the millimetre-level close-up'
  }
};

const routeSets = {
  zh: {
    guide: { title: '升级改装导览', eyebrow: 'UPGRADE GUIDANCE' }, exterior: { title: '全车外观', eyebrow: 'VEHICLE EXTERIOR' }, interior: { title: '车内总览', eyebrow: 'INTERIOR VIEWS' }, electrical: { title: '电路舱', eyebrow: 'ELECTRICAL COMPARTMENT' }, gx: { title: 'GX 与玻璃门', eyebrow: 'GX INSTALLATION' }, catalog: { title: '设备资料', eyebrow: 'COMPONENT INDEX' }
  },
  en: {
    guide: { title: 'Upgrade Guide', eyebrow: 'UPGRADE GUIDANCE' }, exterior: { title: 'Vehicle Exterior', eyebrow: 'VEHICLE EXTERIOR' }, interior: { title: 'Interior Overview', eyebrow: 'INTERIOR VIEWS' }, electrical: { title: 'Electrical Bay', eyebrow: 'ELECTRICAL COMPARTMENT' }, gx: { title: 'GX & Glass Door', eyebrow: 'GX INSTALLATION' }, catalog: { title: 'Device Data', eyebrow: 'COMPONENT INDEX' }
  }
};

const recordsZh = {
  guide: {
    status: '改装总览', title: '选择一项升级', source: '锁定资产',
    summary: '电路舱和 GX 是本次改装的两个核心区域。展示面打开后，可分别进入旧版、改装后版本和安装资料。',
    overview: ['电路舱：三台 MPPT 更换为三块输入恒流板，并重构通讯汇聚。', 'GX：旧版 Color Control GX 更换为 Ekrano GX，并校核开孔、深度和左右安装余量。', '全车、车内、车外、电路舱与 GX 均调用已锁定版本，不重新建模。'],
    specs: [['车身统一尺度','7200 × 2150 × 3000 mm'],['光伏组件','1762 × 1134 × 30 mm'],['改装项目','2 项']],
    connections: ['三路光伏分别进入三块恒流板。', '恒流板输出并入 MG Master LV 充电侧。', '三路数据经工业电脑汇聚，再通过交换机接入 Ekrano GX。'],
    notes: ['橙色高亮只表示可操作区域，不改变原模型材质。', '所有未由官方图纸或现车确认的尺寸必须现场复测。']
  },
  body: {
    status: '锁定母版', title: '车身与光伏组件', source: '车身v01',
    summary: '外观、棚板、车顶三块组件、玻璃门区域和尾部组件保持车身v01的锁定结构与材质。',
    overview: ['车顶三块光伏组件紧挨布置，受光面朝玻璃门侧。', '玻璃门内侧和车尾内壁分别悬挂一块全黑组件。', '棚板收起后与车厢侧面基本齐平。'],
    specs: [['整车','7200 × 2150 × 3000 mm'],['单块组件','1762 × 1134 × 30 mm'],['车顶组件','3 块，紧挨布置']],
    connections: ['三路车顶组件输出分别进入三块恒流板输入端。'],
    notes: ['组件尺寸为锁定值。', '车体开孔、支架连接点和线缆穿舱位置仍需以实车复测为准。']
  },
  interiorModule: {
    status: '车内设备', title: '内壁光伏组件', source: '车内v1',
    summary: '全黑光伏组件安装在车厢内壁；玻璃门只是观察窗口，组件并非安装在玻璃上。',
    overview: ['玻璃门侧组件靠近电视端。', '尾端组件几乎贴近车尾。', '表面保持纯黑、细腻且有层次的组件质感。'],
    specs: [['组件外形','1762 × 1134 × 30 mm'],['安装形式','车厢内壁悬挂']],
    connections: ['组件输出通过 MC4 接插件进入对应恒流板 IN 端。'],
    notes: ['不得在模型上增加不存在的竖向黑条。', '最终挂装孔位以组件边框图纸和实车墙体复测共同确定。']
  },
  electricalOld: {
    status: '原车基准', title: '旧车系统 v1.0', source: '旧车系统v1.0',
    summary: '保留原车三台 BlueSolar MPPT、MG Master LV、MG HE 300、电源转换器、母排及全部已确认线路。',
    overview: ['三台 MPPT 分别接收三路光伏输入。', 'MPPT 输出接入 MG Master LV 充电侧。', '旧版 GX 接收原车能源系统数据。'],
    specs: [['BlueSolar MPPT 100/50','186 × 132 × 71 mm'],['Orion-Tr Smart','187 × 131 × 71 mm'],['Buck Boost 800/50','213 × 120 × 30 mm'],['MG Master LV','430 × 227 × 118 mm'],['MG HE 300','500 × 361 × 193 mm']],
    connections: ['三路 MPPT 功率线沿底部绕行，再从电池右侧上行。', '每台 MPPT 右下角保留独立黑色信号线。', '电池负极黑线走左侧，正极红线走右侧。'],
    notes: ['这是只读旧车基准，后续改装不得覆盖。', '原孔位、线长与现场固定方式在拆机前记录。']
  },
  electricalNew: {
    status: '改装后系统', title: '新电路系统 v1.0', source: '新电路系统v1.0',
    summary: '用三块输入恒流板替代三台 MPPT，保持 MG、电池、母排和其他未授权设备不变。',
    overview: ['每一路光伏由独立恒流板控制，禁用 MPPT。', '右侧 IN 接组件输出，左侧 OUT 向下接入 MG。', '上部信号口接工业电脑，实现三路独立采集与设定。'],
    specs: [['恒流板总成','158 × 104 × 58.8 mm'],['安装孔距','146 × 73 mm'],['螺钉孔','4 × Ø4.5 mm'],['输入电流范围','0–10 A（常用 2–3 A）'],['单路功率上限','≤ 400 W']],
    connections: ['右侧 IN：接光伏组件 MC4 输出。', '左侧 OUT：向下接 MG Master LV。', '顶部信号：每块板的 RS485 A／B 分别接一只隔离 RS485 转 USB 适配器。', '三只适配器分别进入有源 USB 集线器，集线器上行 USB 接工业电脑。', '三块板分别编号，三路数据不得合并为一个虚拟设备。'],
    notes: ['三块恒流板为同规格、可命名设备，不与某一品牌组件永久绑定；任一组件均可连接任一恒流板。', '接线完成后，必须按“组件 → 恒流板 IN → RS485／USB 通道”的实际链路统一命名、编号和线标。', '原 MPPT 孔位不能直接视为恒流板孔位，必须使用精确转接板。', 'MC4 正负极、插头方向、最小弯曲半径和检修间距必须在施工图中锁定。', '板卡最终端子高度与线鼻子空间需实物复测。']
  },
  gxOld: {
    status: '原车基准', title: '旧版 Color Control GX', source: '旧版GXv01',
    summary: '旧版 GX 保留为拆换前尺寸与安装位置基准，用于检查新设备是否遮挡、嵌入或侵占玻璃门余量。',
    overview: ['位于靠玻璃门的凹入窄面。', '左边紧贴凸出的厚沿。', '设备正面、按键、屏幕和安装厚度均使用锁定样机。'],
    specs: [['外形','130 × 120 × 28 mm'],['安装状态','凹入面安装'],['版本','旧版GXv01']],
    connections: ['接入原车 Victron 通讯系统。'],
    notes: ['拆卸前记录原开孔、紧固件、背部插头方向与可用深度。']
  },
  gxNew: {
    status: '改装后设备', title: 'Victron Ekrano GX', source: '新版GXv01',
    summary: 'Ekrano GX 用于显示三路虚拟太阳能充电器及整车能源数据，安装必须同时满足正面、支架、开孔和背部深度要求。',
    overview: ['正面主体采用官方尺寸。', '安装支架总宽与正面主体宽度分开核算。', '与玻璃门约 100 mm 的实际间距必须在施工前复核。'],
    specs: [['正面主体','187 × 124 mm'],['含支架总宽','257 mm'],['最大包络深度','67.1 mm'],['齐平安装开孔','178 × 111 mm（0 / −0.5）'],['最小安装深度','100 mm'],['开孔左右预留','各 42 mm']],
    connections: ['工业电脑与 Ekrano GX 经工业交换机组成独立有线局域网。', '电脑和 GX 设置静态 IP，不依赖路由器 DHCP。', 'PC 将三路恒流板数据发布为 Virtual MPPT 1／2／3。'],
    notes: ['不能按旧 GX 正面尺寸直接扩大开孔，先检查厚沿、玻璃门和背部接口空间。', '官方 STEP 是工程几何母文件；网页轻量模型只用于展示。'],
    docs: [['官方尺寸图','assets/docs/DimensionDrawing-Ekrano-GX.pdf'],['官方开孔图','assets/docs/Cut-Out-Drawing-Ekrano-GX.pdf']]
  },
  communication: {
    status: '通讯检查', title: '固定 IP 通讯结构', source: '已确认拓扑',
    summary: '路由器不是必要设备。工业电脑、交换机和 Ekrano GX 可组成独立有线局域网，通过静态 IP 保持地址不变。',
    overview: ['三块恒流板各自输出一路 RS485，不是 TTL。', '三路 RS485 分别经隔离 RS485 转 USB 适配器进入有源 USB 集线器，再由一条上行 USB 接工业电脑。', '工业电脑完成三路采集、协议整理，并通过 MQTT TCP 1883 发布 Virtual MPPT 1／2／3。', 'Moxa EDS-205A 只负责二层有线连接；Ekrano GX 接收并显示数据，整个控制网不需要路由器。'],
    specs: [['恒流板数据口','RS485 A／B × 3 路'],['串口转换','隔离 RS485 转 USB × 3'],['USB 汇聚','有源 USB Hub：3 路设备输入 + 1 路上行'],['交换机','Moxa EDS-205A，5 口非网管工业以太网交换机'],['工业电脑 IP','192.168.8.52／24'],['Ekrano GX IP','192.168.8.54／24'],['子网掩码','255.255.255.0'],['网关／DNS','留空'],['应用协议','MQTT TCP 1883'],['路由器','不需要']],
    connections: ['恒流板 1 RS485 A／B → 隔离 RS485 转 USB 1 → 有源 USB Hub 端口 1。', '恒流板 2 RS485 A／B → 隔离 RS485 转 USB 2 → 有源 USB Hub 端口 2。', '恒流板 3 RS485 A／B → 隔离 RS485 转 USB 3 → 有源 USB Hub 端口 3。', '有源 USB Hub 上行口 → 工业电脑 USB。', '工业电脑 LAN1 RJ45 → Cat5e／Cat6 网线 → Moxa EDS-205A。', 'Ekrano GX Ethernet RJ45 → Cat5e／Cat6 网线 → Moxa EDS-205A。'],
    notes: ['交换机无 DHCP 功能，固定 IP 必须分别在电脑和 GX 中配置。', 'PC 与 GX 必须使用同一 /24 网段，且地址不得重复；网关和 DNS 保持空白。', '施工后依次检查三只 USB 串口、PC 到 GX 的 Ping、MQTT 1883 连接以及 Virtual MPPT 1／2／3 是否分别显示。', 'RS485 波特率、校验位和设备地址必须按恒流板厂家协议确认，不在此处臆定。', '工业电脑最终订货型号、车载供电接口和安装孔位仍以采购确认单及卖方尺寸图为准。']
  }
};

const recordsEn = {
  guide: {
    status:'Upgrade Overview', title:'Select an Upgrade', source:'Locked Assets',
    summary:'The electrical bay and GX are the two core upgrade areas. Open the display cover to inspect the original system, upgraded system and installation data.',
    overview:['Electrical bay: replace three MPPT units with three input constant-current boards and rebuild the communication aggregation.','GX: replace the Color Control GX with an Ekrano GX, verifying cut-out, depth and side clearances.','Vehicle, interior, exterior, electrical-bay and GX views all reference locked assets; no model is regenerated.'],
    specs:[['Unified vehicle scale','7200 × 2150 × 3000 mm'],['PV module','1762 × 1134 × 30 mm'],['Upgrade items','2']],
    connections:['Each of the three PV circuits feeds one constant-current board.','Board outputs connect to the MG Master LV charging side.','The industrial PC aggregates all three data channels and connects to Ekrano GX through the Ethernet switch.'],
    notes:['Orange highlights identify interactive areas only; they do not change model materials.','Any dimension not confirmed by an official drawing or the actual vehicle must be measured on site.']
  },
  body: {
    status:'Locked Master', title:'Vehicle Body and PV Modules', source:'Vehicle Body v01',
    summary:'The locked Vehicle Body v01 geometry and materials are preserved for the body, canopy, three roof modules, glass-door area and rear module.',
    overview:['Three roof modules are installed edge-to-edge with their active faces toward the glass-door side.','One all-black module is mounted on the inner wall behind the glass door and another on the rear inner wall.','When closed, the canopy is nearly flush with the vehicle side.'],
    specs:[['Vehicle','7200 × 2150 × 3000 mm'],['Single module','1762 × 1134 × 30 mm'],['Roof modules','3, installed edge-to-edge']],
    connections:['The three roof-module outputs feed the three constant-current board inputs separately.'],
    notes:['Module dimensions are locked.','Body cut-outs, bracket points and cable penetrations must still be verified on the vehicle.']
  },
  interiorModule: {
    status:'Interior Device', title:'Interior-mounted PV Module', source:'Interior v1',
    summary:'The all-black PV module is mounted on the interior wall; the glass door is only a viewing window and does not carry the module.',
    overview:['The glass-door-side module is close to the TV end.','The rear module is installed almost against the tail wall.','The surface retains the locked all-black, fine-textured layered finish.'],
    specs:[['Module size','1762 × 1134 × 30 mm'],['Installation','Mounted on the interior wall']],
    connections:['The module output enters the matching board IN terminals through MC4 connectors.'],
    notes:['Do not add non-existent vertical black strips to the model.','Final mounting-hole locations require both the module frame drawing and on-vehicle wall measurements.']
  },
  electricalOld: {
    status:'Original Baseline', title:'Original Vehicle System v1.0', source:'Original Vehicle System v1.0',
    summary:'Preserves the original three BlueSolar MPPT units, MG Master LV, MG HE 300, converters, busbars and every confirmed cable.',
    overview:['Three MPPT units receive the three PV inputs separately.','MPPT outputs connect to the MG Master LV charging side.','The original GX receives data from the original vehicle energy system.'],
    specs:[['BlueSolar MPPT 100/50','186 × 132 × 71 mm'],['Orion-Tr Smart','187 × 131 × 71 mm'],['Buck Boost 800/50','213 × 120 × 30 mm'],['MG Master LV','430 × 227 × 118 mm'],['MG HE 300','500 × 361 × 193 mm']],
    connections:['All three MPPT power pairs run along the bay floor and rise beside the battery’s right edge.','Each MPPT retains its own black signal cable at the lower-right port.','The battery negative cable runs left; the positive cable runs right.'],
    notes:['This is a read-only original-system baseline and must never be overwritten.','Record original holes, cable lengths and fixing methods before removal.']
  },
  electricalNew: {
    status:'Upgraded System', title:'New Electrical System v1.0', source:'New Electrical System v1.0',
    summary:'Replaces the three MPPT units with three input constant-current boards while preserving MG, battery, busbars and all other non-authorized equipment.',
    overview:['Each PV circuit is controlled by an independent constant-current board; MPPT is disabled.','The right-side IN connects to the PV module output; the left-side OUT turns down toward MG.','The upper signal port connects to the industrial PC for independent acquisition and setting of all three channels.'],
    specs:[['Board assembly','158 × 104 × 58.8 mm'],['Mounting-hole pattern','146 × 73 mm'],['Screw holes','4 × Ø4.5 mm'],['Input-current range','0–10 A (typically 2–3 A)'],['Per-channel power limit','≤ 400 W']],
    connections:['Right-side IN: PV module MC4 output.','Left-side OUT: routes downward to MG Master LV.','Upper signal: RS485 A/B from each board connects to one isolated RS485-to-USB adapter.','The three adapters connect to a powered USB hub; the hub upstream USB connects to the industrial PC.','Give every board a permanent ID; do not merge the channels into one virtual device.'],
    notes:['The three boards are identical, nameable devices and are not permanently bound to a PV brand; any module may be assigned to any board.','After wiring, use one consistent name and label for the actual Module → Board IN → RS485/USB channel chain.','The MPPT holes cannot be treated as direct board mounting holes; use the dimensioned adapter plate.','Lock MC4 polarity, connector direction, minimum bend radius and service clearance in the installation drawing.','Final terminal height and cable-lug space require physical measurement.']
  },
  gxOld: {
    status:'Original Baseline', title:'Original Color Control GX', source:'Original GX v01',
    summary:'The original GX remains the dimensional and installation-position baseline for checking obstruction, recess depth and glass-door clearance.',
    overview:['Installed on the recessed narrow panel next to the glass door.','Its left edge sits directly against the projecting trim.','Front face, buttons, display and installed depth use the locked sample model.'],
    specs:[['Overall size','130 × 120 × 28 mm'],['Installation','Recessed panel'],['Version','Original GX v01']],
    connections:['Connected to the original Victron communication system.'],
    notes:['Before removal, record the cut-out, fasteners, rear connector directions and available depth.']
  },
  gxNew: {
    status:'Upgraded Device', title:'Victron Ekrano GX', source:'New GX v01',
    summary:'Ekrano GX displays the three virtual solar chargers and vehicle energy data. Installation must satisfy front-face, bracket, cut-out and rear-depth requirements together.',
    overview:['The front body follows the official dimensions.','Bracket total width is checked separately from the front body width.','The approximately 100 mm clearance to the glass door must be verified before installation.'],
    specs:[['Front body','187 × 124 mm'],['Total width with bracket','257 mm'],['Maximum envelope depth','67.1 mm'],['Flush-mount cut-out','178 × 111 mm (0 / −0.5)'],['Minimum installation depth','100 mm'],['Cut-out side allowance','42 mm each side']],
    connections:['The industrial PC and Ekrano GX form an isolated wired LAN through the industrial switch.','The PC and GX use static IP addresses and do not rely on router DHCP.','The PC publishes the three channels as Virtual MPPT 1/2/3.'],
    notes:['Do not enlarge the old GX opening from face dimensions alone; first check the projecting trim, glass door and rear connector space.','The official STEP file is the engineering geometry master; the lightweight web model is for presentation only.'],
    docs:[['Official dimension drawing','assets/docs/DimensionDrawing-Ekrano-GX.pdf'],['Official cut-out drawing','assets/docs/Cut-Out-Drawing-Ekrano-GX.pdf']]
  },
  communication: {
    status:'Communication Check', title:'Static-IP Communication Structure', source:'Confirmed Topology',
    summary:'A router is not required. The industrial PC, Ethernet switch and Ekrano GX form an isolated wired LAN with static IP addresses.',
    overview:['Each constant-current board outputs one RS485 channel, not TTL.','Three isolated RS485-to-USB adapters connect independently to a powered USB hub, whose upstream USB connects to the industrial PC.','The PC acquires the three channels, normalizes the protocol and publishes Virtual MPPT 1/2/3 over MQTT TCP 1883.','Moxa EDS-205A provides Layer-2 Ethernet only; Ekrano GX receives and displays the data. No router is required on the control LAN.'],
    specs:[['Board data ports','RS485 A/B × 3'],['Serial conversion','Isolated RS485-to-USB × 3'],['USB aggregation','Powered USB hub: 3 device inputs + 1 upstream'],['Switch','Moxa EDS-205A, 5-port unmanaged industrial Ethernet switch'],['Industrial PC IP','192.168.8.52/24'],['Ekrano GX IP','192.168.8.54/24'],['Subnet mask','255.255.255.0'],['Gateway / DNS','Leave blank'],['Application protocol','MQTT TCP 1883'],['Router','Not required']],
    connections:['Board 1 RS485 A/B → isolated RS485-to-USB 1 → powered USB hub port 1.','Board 2 RS485 A/B → isolated RS485-to-USB 2 → powered USB hub port 2.','Board 3 RS485 A/B → isolated RS485-to-USB 3 → powered USB hub port 3.','Powered USB hub upstream port → industrial PC USB.','Industrial PC LAN1 RJ45 → Cat5e/Cat6 cable → Moxa EDS-205A Port 5.','Moxa EDS-205A Port 1 (RJ45) → Cat5e/Cat6 cable → Ekrano GX rear Ethernet (RJ45) port.'],
    notes:['The switch has no DHCP service. Configure static IP separately on the PC and GX.','PC and GX must use the same /24 subnet with unique addresses; leave gateway and DNS blank.','After installation, verify all three USB serial devices, PC-to-GX ping, MQTT 1883 and the separate Virtual MPPT 1/2/3 entries.','Confirm RS485 baud rate, parity and device addresses from the board protocol; do not infer them here.','Final PC model, vehicle power input and mounting holes remain subject to the purchase specification and seller dimension drawing.']
  }
};

let records = initialLanguage === 'en' ? recordsEn : recordsZh;
let routes = routeSets[initialLanguage];

const deviceDetailsZh = {
  'orion-small': { specs:[['设备','Victron Orion-Tr 24/12-20 Isolated'],['外形','187 × 131 × 71 mm']], connections:['24 V 输入侧与 12 V 输出侧电气隔离。'], notes:['拆装前标记 IN／OUT 正负极。'] },
  'bus-positive': { specs:[['设备','LOAD 正汇流排']], connections:['汇集 MG 保护后的正极分配支路。'], notes:['正极端子必须保持绝缘防护。'] },
  'bus-negative': { specs:[['设备','LOAD 负汇流排']], connections:['汇集 MG 保护后的负极回路。'], notes:['不得与正汇流排或壳体误接。'] },
  junction: { specs:[['设备','控制／IO 接线盒']], connections:['承载控制与信号细线。'], notes:['内部端子定义以现场线号和原图纸为准。'] },
  protector: { specs:[['设备','三路光伏保护器件']], connections:['三路组件输入分别经保护后进入对应充电通道。'], notes:['三路极性和通道编号必须一一对应。'] },
  mg: { specs:[['设备','MG Master LV'],['外形','430 × 227 × 118 mm']], connections:['接收电池、充电器／负载和通讯线路。'], notes:['左侧大电流端子与右下五组功率线按锁定线路施工。'] },
  battery: { specs:[['设备','MG HE 300'],['外形','500 × 361 × 193 mm'],['标称系统','25.2 V／300 Ah']], connections:['主功率正负极与 Battery CAN 接入 MG Master LV。'], notes:['负极黑线走左侧，正极红线走右侧。'] },
  buck: { specs:[['设备','Buck Boost 800／50'],['外形','213 × 120 × 30 mm']], connections:['OUT+／GND／IN+ 接入原车侧与 MG 受控充电回路。'], notes:['保留原车安装方向和端子次序。'] },
  'orion-smart': { specs:[['设备','Victron Orion-Tr Smart 24/12-20'],['外形','187 × 131 × 71 mm']], connections:['24 V 系统至 12 V 辅助系统。'], notes:['最终充电器／电源模式以现场配置确认。'] },
  'mppt-1': { specs:[['设备','BlueSolar MPPT 100／50'],['外形','186 × 132 × 71 mm']], connections:['BAT+／BAT−／PV−／PV+；右下 VE.Direct。'], notes:['具体组件通道名称尚未确认。'] },
  'mppt-2': { specs:[['设备','BlueSolar MPPT 100／50'],['外形','186 × 132 × 71 mm']], connections:['BAT+／BAT−／PV−／PV+；右下 VE.Direct。'], notes:['具体组件通道名称尚未确认。'] },
  'mppt-3': { specs:[['设备','BlueSolar MPPT 100／50'],['外形','186 × 132 × 71 mm']], connections:['BAT+／BAT−／PV−／PV+；右下 VE.Direct。'], notes:['具体组件通道名称尚未确认。'] },
  'usb-hub': { specs:[['设备','有源 USB 集线器']], connections:['三只隔离 RS485 转 USB 适配器分别接入，单独上行 USB 接电脑。'], notes:['有源供电、端口编号和线缆应力释放必须固定。'] },
  'windows-pc': { specs:[['设备','无风扇工业主机'],['当前配置','i7-1165G7／16 GB／512 GB'],['控制网 IP','192.168.8.52／24']], connections:['USB 接三路 RS485 数据；LAN1 经交换机连接 Ekrano GX。'], notes:['车载供电版本、整机外形和安装孔位以卖方尺寸图确认。'] },
  'ethernet-switch': { specs:[['设备','Moxa EDS-205A'],['外形','30 × 115 × 70 mm'],['端口','5 × 10／100BaseT(X) RJ45']], connections:['工业电脑和 Ekrano GX 分别接入 RJ45 端口。'], notes:['非网管交换机不分配 IP，也不提供 DHCP。'] },
  'constant-aiko': { specs:[['设备','恒流板 1'],['总成','158 × 104 × 58.8 mm'],['安装孔距','146 × 73 mm']], connections:['右侧 IN 接组件；左侧 OUT 接 MG；顶部 RS485 接隔离转换器。'], notes:['经 196 × 120 × 3 mm 转接板固定。', '安装位置不绑定组件品牌；完工后按实际组件、IN 端和通讯通道统一命名。'] },
  'constant-ja': { specs:[['设备','恒流板 2'],['总成','158 × 104 × 58.8 mm'],['安装孔距','146 × 73 mm']], connections:['右侧 IN 接组件；左侧 OUT 接 MG；顶部 RS485 接隔离转换器。'], notes:['经 196 × 120 × 3 mm 转接板固定。', '安装位置不绑定组件品牌；完工后按实际组件、IN 端和通讯通道统一命名。'] },
  'constant-jk': { specs:[['设备','恒流板 3'],['总成','158 × 104 × 58.8 mm'],['安装孔距','146 × 73 mm']], connections:['右侧 IN 接组件；左侧 OUT 接 MG；顶部 RS485 接隔离转换器。'], notes:['经 196 × 120 × 3 mm 转接板固定。', '安装位置不绑定组件品牌；完工后按实际组件、IN 端和通讯通道统一命名。'] },
  'vehicle-source': { specs:[['设备','原车电源侧']], connections:['发电机／启动电池母线接入行车充电回路。'], notes:['原车接口与保护参数保持不变。'] },
  'gx-old': { specs:[['设备','Color Control GX'],['外形','130 × 120 × 28 mm']], connections:['接入原车 Victron 通讯系统。'], notes:['拆卸前记录开孔、紧固件、背部插头方向和可用深度。'] },
  'gx-new': { specs:[['设备','Victron Ekrano GX'],['正面','187 × 124 mm'],['含支架总宽','257 mm'],['最大包络深度','67.1 mm']], connections:['RJ45 经 Moxa EDS-205A 与工业电脑组成静态 IP 控制网。'], notes:['开孔 178 × 111 mm；最小安装深度 100 mm。'] },
  'gx-ethernet-link': { specs:[['线路','GX 以太网通讯线'],['线缆','Cat5e／Cat6'],['交换机端','Moxa EDS-205A Port 1（RJ45）'],['GX 端','Ekrano GX 背部 Ethernet（RJ45）以太网口']], connections:['Moxa EDS-205A Port 1（RJ45） → Cat5e／Cat6 网线 → Ekrano GX 背部 Ethernet（RJ45）以太网口。'], notes:['该接口不是 VE.Direct、VE.Can、VE.Bus 或 USB。', 'PC 与 Ekrano GX 使用同一 /24 静态网段，地址不得重复。'] }
};

const deviceDetailsEn = {
  'orion-small': { specs:[['Device','Victron Orion-Tr 24/12-20 Isolated'],['Size','187 × 131 × 71 mm']], connections:['The 24 V input and 12 V output are electrically isolated.'], notes:['Label IN/OUT polarity before removal.'] },
  'bus-positive': { specs:[['Device','LOAD positive busbar']], connections:['Distributes MG-protected positive circuits.'], notes:['Keep all positive terminals insulated.'] },
  'bus-negative': { specs:[['Device','LOAD negative busbar']], connections:['Collects MG-protected negative returns.'], notes:['Do not connect it to the positive busbar or chassis.'] },
  junction: { specs:[['Device','Control / I/O junction box']], connections:['Carries control and signal wiring.'], notes:['Internal terminals follow the actual wire labels and original drawings.'] },
  protector: { specs:[['Device','Three-channel PV protection']], connections:['Each module circuit passes through protection before its charging channel.'], notes:['Polarity and channel numbers must match end-to-end.'] },
  mg: { specs:[['Device','MG Master LV'],['Size','430 × 227 × 118 mm']], connections:['Connects battery, chargers/loads and communication wiring.'], notes:['Keep the left high-current terminals and five lower-right power pairs as shown in the locked topology.'] },
  battery: { specs:[['Device','MG HE 300'],['Size','500 × 361 × 193 mm'],['Nominal system','25.2 V / 300 Ah']], connections:['Main positive/negative cables and Battery CAN connect to MG Master LV.'], notes:['Route negative left and positive right.'] },
  buck: { specs:[['Device','Buck Boost 800/50'],['Size','213 × 120 × 30 mm']], connections:['OUT+ / GND / IN+ connect the vehicle side to the MG-controlled charging circuit.'], notes:['Preserve original orientation and terminal order.'] },
  'orion-smart': { specs:[['Device','Victron Orion-Tr Smart 24/12-20'],['Size','187 × 131 × 71 mm']], connections:['24 V system to 12 V auxiliary system.'], notes:['Confirm charger or power-supply mode from the actual configuration.'] },
  'mppt-1': { specs:[['Device','BlueSolar MPPT 100/50'],['Size','186 × 132 × 71 mm']], connections:['BAT+ / BAT− / PV− / PV+; VE.Direct at lower right.'], notes:['The specific PV-channel name is not confirmed.'] },
  'mppt-2': { specs:[['Device','BlueSolar MPPT 100/50'],['Size','186 × 132 × 71 mm']], connections:['BAT+ / BAT− / PV− / PV+; VE.Direct at lower right.'], notes:['The specific PV-channel name is not confirmed.'] },
  'mppt-3': { specs:[['Device','BlueSolar MPPT 100/50'],['Size','186 × 132 × 71 mm']], connections:['BAT+ / BAT− / PV− / PV+; VE.Direct at lower right.'], notes:['The specific PV-channel name is not confirmed.'] },
  'usb-hub': { specs:[['Device','Powered USB hub']], connections:['Three isolated RS485-to-USB adapters connect independently; one upstream USB connects to the PC.'], notes:['Secure powered input, port IDs and strain relief.'] },
  'windows-pc': { specs:[['Device','Fanless industrial PC'],['Current configuration','i7-1165G7 / 16 GB / 512 GB'],['Control-LAN IP','192.168.8.52/24']], connections:['USB receives three RS485 channels; LAN1 connects to Ekrano GX through the switch.'], notes:['Confirm vehicle power version, enclosure and mounting holes from the seller drawing.'] },
  'ethernet-switch': { specs:[['Device','Moxa EDS-205A'],['Size','30 × 115 × 70 mm'],['Ports','5 × 10/100BaseT(X) RJ45']], connections:['PC LAN1 connects to Port 5; Port 1 connects to the Ekrano GX rear Ethernet RJ45 port.'], notes:['This unmanaged switch does not assign IP addresses and has no DHCP service.'] },
  'constant-aiko': { specs:[['Device','Constant-current board 1'],['Assembly','158 × 104 × 58.8 mm'],['Mounting pattern','146 × 73 mm']], connections:['Right IN to PV module; left OUT to MG; upper RS485 to isolated converter.'], notes:['Mounted through a 196 × 120 × 3 mm adapter plate.','Installation position is not tied to a PV brand; name the board from the actual module, IN cable and communication channel after wiring.'] },
  'constant-ja': { specs:[['Device','Constant-current board 2'],['Assembly','158 × 104 × 58.8 mm'],['Mounting pattern','146 × 73 mm']], connections:['Right IN to PV module; left OUT to MG; upper RS485 to isolated converter.'], notes:['Mounted through a 196 × 120 × 3 mm adapter plate.','Installation position is not tied to a PV brand; name the board from the actual module, IN cable and communication channel after wiring.'] },
  'constant-jk': { specs:[['Device','Constant-current board 3'],['Assembly','158 × 104 × 58.8 mm'],['Mounting pattern','146 × 73 mm']], connections:['Right IN to PV module; left OUT to MG; upper RS485 to isolated converter.'], notes:['Mounted through a 196 × 120 × 3 mm adapter plate.','Installation position is not tied to a PV brand; name the board from the actual module, IN cable and communication channel after wiring.'] },
  'vehicle-source': { specs:[['Device','Original vehicle power side']], connections:['Alternator / starter-battery bus feeds the driving-charge circuit.'], notes:['Keep the original interface and protection settings unchanged.'] },
  'gx-old': { specs:[['Device','Color Control GX'],['Size','130 × 120 × 28 mm']], connections:['Connected to the original Victron communication system.'], notes:['Before removal, record cut-out, fasteners, rear plug directions and depth.'] },
  'gx-new': { specs:[['Device','Victron Ekrano GX'],['Front','187 × 124 mm'],['Total width with bracket','257 mm'],['Maximum envelope depth','67.1 mm']], connections:['RJ45 forms a static-IP control LAN with the industrial PC through Moxa EDS-205A.'], notes:['Cut-out 178 × 111 mm; minimum installation depth 100 mm.'] },
  'gx-ethernet-link': { specs:[['Link','GX Ethernet communication cable'],['Cable','Cat5e / Cat6'],['Switch end','Moxa EDS-205A Port 1 (RJ45)'],['GX end','Ekrano GX rear Ethernet (RJ45) port']], connections:['Moxa EDS-205A Port 1 (RJ45) → Cat5e/Cat6 cable → Ekrano GX rear Ethernet (RJ45) port.'], notes:['This is not a VE.Direct, VE.Can, VE.Bus or USB connection.','PC and Ekrano GX use unique addresses on the same static /24 subnet.'] }
};

let deviceDetails = initialLanguage === 'en' ? deviceDetailsEn : deviceDetailsZh;

const catalogSets = {
  zh: [
  ['body','车身与光伏组件','7200 × 2150 × 3000 mm；组件 1762 × 1134 × 30 mm'],
  ['interiorModule','内壁光伏组件','车厢内壁悬挂，全黑组件表面'],
  ['electricalOld','旧车系统 v1.0','三台 MPPT、MG、电池与原线路'],
  ['electricalNew','新电路系统 v1.0','三块恒流板、MC4 与新通讯'],
  ['gxOld','旧版 Color Control GX','130 × 120 × 28 mm'],
  ['gxNew','新版 Ekrano GX','187 × 124 mm；开孔 178 × 111 mm'],
  ['communication','通讯系统','恒流板 ×3 → PC → 交换机 → Ekrano GX']
  ],
  en: [
    ['body','Vehicle Body and PV Modules','7200 × 2150 × 3000 mm; module 1762 × 1134 × 30 mm'],
    ['interiorModule','Interior-mounted PV Module','Mounted on the interior wall; all-black surface'],
    ['electricalOld','Original Vehicle System v1.0','Three MPPT units, MG, battery and original cables'],
    ['electricalNew','New Electrical System v1.0','Three constant-current boards, MC4 and new communication'],
    ['gxOld','Original Color Control GX','130 × 120 × 28 mm'],
    ['gxNew','New Ekrano GX','187 × 124 mm; cut-out 178 × 111 mm'],
    ['communication','Communication System','Boards ×3 → PC → switch → Ekrano GX']
  ]
};

const hotspotMap = {
  'rear-left': [
    {x:50,y:19,label:'车顶光伏组件',labelEn:'Roof PV modules',record:'body'},
    {x:18,y:47,label:'尾部内挂组件',labelEn:'Rear interior module',record:'interiorModule'}
  ],
  side: [
    {x:58,y:47,label:'玻璃门内挂组件',labelEn:'Glass-door-side module',record:'interiorModule'},
    {x:75,y:48,label:'GX 安装区',labelEn:'GX installation area',record:'gxOld',action:'gx-location'}
  ],
  roof: [{x:50,y:40,label:'3 × 车顶组件',labelEn:'3 × roof modules',record:'body'}],
  rear: [{x:48,y:45,label:'尾部内挂组件',labelEn:'Rear interior module',record:'interiorModule'}],
  'rear-forward': [
    {x:29,y:47,label:'电路舱',labelEn:'Electrical bay',record:'electricalOld',action:'electrical'},
    {x:75,y:38,label:'GX 安装区',labelEn:'GX installation area',record:'gxOld',action:'gx-location'}
  ],
  'module-side': [{x:71,y:43,label:'内壁组件',labelEn:'Interior-mounted module',record:'interiorModule'}],
  'tv-side': [{x:64,y:37,label:'GX 安装区',labelEn:'GX installation area',record:'gxOld',action:'gx-location'}],
  'front-diagonal': [{x:70,y:36,label:'GX 安装区',labelEn:'GX installation area',record:'gxOld',action:'gx-location'}],
  'gx-front': [{x:50,y:42,label:'进入 GX 近景',labelEn:'Open GX close-up',record:'gxOld',action:'gx-detail'}]
};

const externalViews = [
  ['rear-left','左后侧','Rear-left'],['side','玻璃侧','Glass side'],['roof','车顶','Roof'],['rear','尾部','Rear']
];
const interiorViews = [
  ['rear-forward','后部向前','Rear to front'],['module-side','组件侧','Module side'],['tv-side','电视侧','TV side'],['front-diagonal','GX与玻璃门','GX & glass door'],['gx-front','GX正面','GX front']
];

const state = { route:'guide', guideStep:'overview', version:'old', detailTab:'overview', record:'guide', camera:'rear-forward', compare:false, gxDetail:false, lang:initialLanguage, deviceMessage:null };
const el = Object.fromEntries(['frameStack','hotspots','coverSheet','outlineLayer','loading','stageStatus','stageHint','routeTitle','routeEyebrow','versionSwitch','compareButton','guideSteps','viewStrip','communicationCard','detailStatus','detailTitle','sourceChip','detailSummary','detailBody','languageSwitch'].map(id => [id,document.getElementById(id)]));
let sceneGeneration=0;
const sceneTimers=new Set();
let currentHotspotItems=[];

function text(key){return ui[state.lang][key] || ui.zh[key] || key;}
function labelFor(item){return state.lang==='en' ? (item.labelEn || item.label) : item.label;}
function viewLabel(view){return state.lang==='en' ? (view[2] || view[1]) : view[1];}

function beginScene() {
  sceneGeneration+=1;
  sceneTimers.forEach(timer=>clearTimeout(timer));
  sceneTimers.clear();
  return sceneGeneration;
}

function deferScene(generation,callback,delay) {
  const timer=setTimeout(()=>{
    sceneTimers.delete(timer);
    if(generation===sceneGeneration) callback();
  },delay);
  sceneTimers.add(timer);
  return timer;
}

function escapeHtml(value='') {
  return String(value).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

function setStageCopy(statusKey,hintKey) {
  el.stageStatus.dataset.i18nKey=statusKey;
  el.stageHint.dataset.i18nKey=hintKey;
  el.stageStatus.textContent=text(statusKey);
  el.stageHint.textContent=text(hintKey);
}

function buildDeviceRecord(message,language=state.lang) {
  const detail=(language==='en'?deviceDetailsEn:deviceDetailsZh)[message.id]||{};
  const copy=ui[language];
  const localizedTitle=language==='en'
    ? (message.titleEn || detail.specs?.[0]?.[1] || copy.genericDevice)
    : (message.title || copy.genericDevice);
  const localizedSummary=language==='en'
    ? (message.textEn || copy.genericDeviceSummary)
    : (message.text || copy.genericDeviceSummary);
  return {
    status:copy.deviceDetail,
    title:localizedTitle,
    source:message.version==='new'?copy.sourceNew:copy.sourceOld,
    summary:localizedSummary,
    overview:[localizedSummary],
    specs:detail.specs||[[copy.objectId,message.id||'—']],
    connections:detail.connections||[copy.genericConnection],
    notes:detail.notes||[copy.genericNote]
  };
}

function refreshViewStripLanguage() {
  el.viewStrip.querySelectorAll('[data-camera]').forEach(button=>{
    const allViews=[...externalViews,...interiorViews];
    const view=allViews.find(item=>item[0]===button.dataset.camera);
    if(view) button.textContent=viewLabel(view);
  });
  el.viewStrip.querySelectorAll('[data-leading-action]').forEach(button=>{
    button.textContent=state.lang==='en' ? button.dataset.labelEn : button.dataset.labelZh;
  });
}

function renderCatalogContents() {
  const catalog=catalogSets[state.lang];
  el.frameStack.innerHTML=`<div class="catalog-grid">${catalog.map(([key,name,note])=>`<button type="button" class="catalog-item" data-record="${key}"><span>${escapeHtml(records[key].source)}</span><strong>${escapeHtml(name)}</strong><small>${escapeHtml(note)}</small></button>`).join('')}</div>`;
  el.frameStack.querySelectorAll('[data-record]').forEach(button=>button.addEventListener('click',()=>showRecord(button.dataset.record)));
}

function sendLanguageToFrames() {
  el.frameStack.querySelectorAll('.view-frame').forEach(frame=>{
    try{frame.contentWindow?.postMessage({type:'aiko-language',language:state.lang},location.origin)}catch(_){}
  });
}

function applyLanguage(language,{persist=true}={}) {
  state.lang=language==='en'?'en':'zh';
  records=state.lang==='en'?recordsEn:recordsZh;
  routes=routeSets[state.lang];
  deviceDetails=state.lang==='en'?deviceDetailsEn:deviceDetailsZh;
  if(persist) localStorage.setItem('aiko-language',state.lang);
  document.documentElement.lang=state.lang==='en'?'en':'zh-CN';
  document.title=text('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach(node=>{const value=text(node.dataset.i18n);if(value)node.textContent=value});
  document.querySelectorAll('[data-i18n-aria]').forEach(node=>{const value=text(node.dataset.i18nAria);if(value)node.setAttribute('aria-label',value)});
  el.languageSwitch.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===state.lang)));
  const route=routes[state.route];
  el.routeTitle.textContent=route.title;
  el.routeEyebrow.textContent=route.eyebrow;
  if(el.stageStatus.dataset.i18nKey) el.stageStatus.textContent=text(el.stageStatus.dataset.i18nKey);
  if(el.stageHint.dataset.i18nKey) el.stageHint.textContent=text(el.stageHint.dataset.i18nKey);
  refreshViewStripLanguage();
  renderHotspots(currentHotspotItems);
  if(state.deviceMessage){
    recordsZh.__device=buildDeviceRecord(state.deviceMessage,'zh');
    recordsEn.__device=buildDeviceRecord(state.deviceMessage,'en');
  }
  if(state.route==='catalog') renderCatalogContents();
  showRecord(state.record);
  if(state.compare) showOutline();
  sendLanguageToFrames();
}

function setLoading(show) { el.loading.hidden = !show; }

function loadFrame(src, options={}) {
  const generation=beginScene();
  setLoading(true);
  const frame = document.createElement('iframe');
  frame.className = 'view-frame';
  frame.src = src;
  frame.title = options.title || text('lockedView');
  frame.setAttribute('loading','eager');
  el.frameStack.appendChild(frame);
  frame.addEventListener('load', () => {
    if(generation!==sceneGeneration){frame.remove();return;}
    requestAnimationFrame(() => frame.classList.add('is-active'));
    [...el.frameStack.querySelectorAll('.view-frame')].filter(x => x !== frame).forEach(old => {
      old.classList.add('is-leaving');
      setTimeout(() => old.remove(), 680);
    });
    if (options.camera) activateCamera(frame, options.camera);
    try{frame.contentWindow?.postMessage({type:'aiko-language',language:state.lang},location.origin)}catch(_){}
    setLoading(false);
    if (options.onLoad) options.onLoad(frame,generation);
  }, {once:true});
  return frame;
}

function activateCamera(frame, camera) {
  state.camera = camera;
  try {
    const doc = frame.contentDocument;
    const button = doc?.querySelector(`[data-view="${camera}"]`);
    if (button) button.click();
    doc?.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', () => {
      state.camera = btn.dataset.view;
      renderHotspots(hotspotMap[state.camera] || []);
      setActiveViewButton(state.camera);
    }));
  } catch (_) {}
  renderHotspots(hotspotMap[camera] || []);
  setActiveViewButton(camera);
}

function setActiveViewButton(camera) {
  el.viewStrip.querySelectorAll('button').forEach(btn => btn.classList.toggle('is-active', btn.dataset.camera === camera));
}

function renderHotspots(items) {
  currentHotspotItems=items;
  el.hotspots.innerHTML = '';
  items.forEach(item => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'hotspot';
    button.style.left = `${item.x}%`;
    button.style.top = `${item.y}%`;
    button.innerHTML = `<span>${escapeHtml(labelFor(item))}</span>`;
    button.addEventListener('click', () => {
      showRecord(item.record);
      if (item.action === 'electrical') {
        if (state.route === 'guide') setGuideStep('electrical');
        else goRoute('electrical');
      }
      if (item.action === 'gx-location' || item.action === 'gx-detail') openGxDetail();
    });
    el.hotspots.appendChild(button);
  });
}

function setViewStrip(items, leadingAction) {
  el.viewStrip.innerHTML = '';
  if (leadingAction) {
    const b = document.createElement('button');
    b.type='button';
    b.dataset.leadingAction='true';
    b.dataset.labelZh=leadingAction.labelZh;
    b.dataset.labelEn=leadingAction.labelEn;
    b.textContent=state.lang==='en'?leadingAction.labelEn:leadingAction.labelZh;
    b.addEventListener('click',leadingAction.action);
    el.viewStrip.appendChild(b);
  }
  items.forEach(view => {
    const [key]=view;
    const b=document.createElement('button'); b.type='button'; b.dataset.camera=key; b.textContent=viewLabel(view);
    b.addEventListener('click',()=>{ const frame=el.frameStack.querySelector('.view-frame.is-active'); if(frame) activateCamera(frame,key); });
    el.viewStrip.appendChild(b);
  });
  setActiveViewButton(state.camera);
}

function showRecord(key) {
  state.record = key;
  const r = records[key] || records.guide;
  el.detailStatus.textContent = r.status;
  el.detailTitle.textContent = r.title;
  el.sourceChip.textContent = r.source;
  el.detailSummary.textContent = r.summary;
  renderDetail();
}

function renderDetail() {
  const r=records[state.record] || records.guide;
  document.querySelectorAll('[data-detail-tab]').forEach(btn=>{
    const active=btn.dataset.detailTab===state.detailTab; btn.classList.toggle('is-active',active); btn.setAttribute('aria-selected',String(active));
  });
  let html='';
  if(state.detailTab==='overview') html=`<h3>${escapeHtml(text('headingOverview'))}</h3><ul>${(r.overview||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>`;
  if(state.detailTab==='specs') html=`<h3>${escapeHtml(text('headingSpecs'))}</h3><table class="spec-table"><tbody>${(r.specs||[]).map(([a,b])=>`<tr><th>${escapeHtml(a)}</th><td>${escapeHtml(b)}</td></tr>`).join('')}</tbody></table>${r.docs?`<div class="doc-links">${r.docs.map(([a,b])=>`<a href="${b}" target="_blank" rel="noopener">${escapeHtml(a)} ↗</a>`).join('')}</div>`:''}`;
  if(state.detailTab==='connections') html=`<h3>${escapeHtml(text('headingConnections'))}</h3><ul>${(r.connections||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>`;
  if(state.detailTab==='notes') html=`<h3>${escapeHtml(text('headingNotes'))}</h3><ul>${(r.notes||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>`;
  el.detailBody.innerHTML=html;
}

function setVersionVisible(show, compare=true) {
  el.versionSwitch.hidden=!show; el.compareButton.hidden=!show || !compare;
  el.versionSwitch.querySelectorAll('button').forEach(btn=>{const active=btn.dataset.version===state.version; btn.setAttribute('aria-pressed',String(active));});
}

function showOutline() {
  el.outlineLayer.hidden=!state.compare;
  el.compareButton.setAttribute('aria-pressed',String(state.compare));
  if(!state.compare) return;
  if(state.guideStep==='electrical' || state.route==='electrical') {
    el.outlineLayer.innerHTML=`<div class="outline-stage electrical-compare"><div class="outline-box old"><span>${escapeHtml(text('outlineElectricalOld'))}</span></div><div class="outline-box new"><span>${escapeHtml(text('outlineElectricalNew'))}</span></div><p class="outline-disclaimer">${escapeHtml(text('outlineDisclaimer'))}</p></div>`;
  } else {
    el.outlineLayer.innerHTML=`<div class="outline-stage"><div class="outline-box bracket"><span>${escapeHtml(text('outlineBracket'))}</span></div><div class="outline-box old"><span>${escapeHtml(text('outlineGxOld'))}</span></div><div class="outline-box new"><span>${escapeHtml(text('outlineGxNew'))}</span></div><p class="outline-disclaimer">${escapeHtml(text('outlineDisclaimer'))}</p></div>`;
  }
}

function setGuideStep(step) {
  state.route='guide'; state.guideStep=step; state.compare=false; state.gxDetail=false; showOutline();
  document.querySelectorAll('[data-guide-step]').forEach(btn=>btn.classList.toggle('is-active',btn.dataset.guideStep===step));
  el.communicationCard.hidden=true; el.coverSheet.classList.remove('is-open'); el.coverSheet.hidden=true;
  if(step==='overview') {
    state.version='old'; setVersionVisible(false); el.coverSheet.hidden=false;
    setStageCopy('statusRearForward','hintGuide');
    setViewStrip(interiorViews);
    loadFrame(paths.vehicle,{title:'全车总装母版v1',camera:'rear-forward',onLoad:(_frame,generation)=>{
      renderHotspots([]);
      deferScene(generation,()=>{el.coverSheet.classList.add('is-open'); deferScene(generation,()=>renderHotspots([
        {x:31,y:50,label:'01 电路舱升级',labelEn:'01 Electrical-bay upgrade',record:'electricalOld',action:'electrical'},
        {x:74,y:41,label:'02 GX 升级',labelEn:'02 GX upgrade',record:'gxOld',action:'gx-detail'}
      ]),500);},650);
    }});
    showRecord('guide');
  }
  if(step==='electrical') { state.version='old'; setVersionVisible(true); loadElectrical(); }
  if(step==='gx') { state.version='old'; setVersionVisible(true); loadGx(); }
  if(step==='communication') {
    state.version='new'; setVersionVisible(false); el.communicationCard.hidden=false;
    setStageCopy('statusCommunication','hintStaticIp');
    el.viewStrip.innerHTML=''; loadFrame(paths.electricalNew,{title:'新电路系统v1.0'}); showRecord('communication');
  }
}

function loadElectrical() {
  const isNew=state.version==='new';
  el.coverSheet.hidden=true; el.communicationCard.hidden=!isNew;
  setStageCopy(isNew?'statusElectricalNew':'statusElectricalOld',isNew?'hintElectricalNew':'hintElectricalOld');
  el.viewStrip.innerHTML='';
  loadFrame(isNew?paths.electricalNew:paths.electricalOld,{title:isNew?'新电路系统v1.0':'旧车系统v1.0'});
  showRecord(isNew?'electricalNew':'electricalOld'); setVersionVisible(true); renderHotspots([]);
}

function loadGx() {
  const isNew=state.version==='new';
  el.coverSheet.hidden=true; el.communicationCard.hidden=true;
  setStageCopy(isNew?'statusGxNew':'statusGxOld',isNew?'hintGxNew':'hintGxOld');
  el.viewStrip.innerHTML='';
  loadFrame(isNew?paths.gxNew:paths.gxOld,{title:isNew?'新版GXv01':'旧版GXv01'});
  showRecord(isNew?'gxNew':'gxOld'); setVersionVisible(true); renderHotspots([]);
}

function openGxDetail() {
  state.gxDetail=true; state.version='old';
  if(state.route==='guide'){state.guideStep='gx';document.querySelectorAll('[data-guide-step]').forEach(btn=>btn.classList.toggle('is-active',btn.dataset.guideStep==='gx'));}
  loadGx();
  setViewStrip([], {labelZh:ui.zh.backGx,labelEn:ui.en.backGx,action:()=>{
    if(state.route==='guide') setGuideStep('overview'); else {state.gxDetail=false;renderRoute();}
  }});
}

function renderCatalog() {
  beginScene();
  setLoading(false); renderCatalogContents();
  setStageCopy('catalogStatus','catalogHint');
  el.viewStrip.innerHTML=''; renderHotspots([]); showRecord('guide');
}

function renderRoute() {
  const cfg=routes[state.route]; el.routeTitle.textContent=cfg.title; el.routeEyebrow.textContent=cfg.eyebrow;
  document.querySelectorAll('[data-route]').forEach(btn=>{const active=btn.dataset.route===state.route;btn.classList.toggle('is-active',active);if(active)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current');});
  el.guideSteps.hidden=state.route!=='guide'; el.communicationCard.hidden=true; el.coverSheet.hidden=true; state.compare=false; showOutline();
  if(state.route==='guide') return setGuideStep(state.guideStep||'overview');
  if(state.route==='exterior') {setVersionVisible(false);state.camera='rear-left';setViewStrip(externalViews);loadFrame(paths.vehicle,{title:routes.exterior.title,camera:'rear-left'});showRecord('body');setStageCopy('statusExterior','hintExterior');}
  if(state.route==='interior') {setVersionVisible(false);state.camera='rear-forward';setViewStrip(interiorViews);loadFrame(paths.vehicle,{title:routes.interior.title,camera:'rear-forward'});showRecord('interiorModule');setStageCopy('statusInterior','hintInterior');}
  if(state.route==='electrical') {state.version='old';loadElectrical();}
  if(state.route==='gx') {setVersionVisible(false);state.gxDetail=false;state.camera='gx-front';setViewStrip(interiorViews);loadFrame(paths.vehicle,{title:routes.gx.title,camera:'gx-front'});showRecord('gxOld');setStageCopy('statusGxLocation','hintGxLocation');}
  if(state.route==='catalog') {setVersionVisible(false);renderCatalog();}
}

function goRoute(route) {state.route=route;state.guideStep=route==='guide'?'overview':state.guideStep;renderRoute();}

document.querySelectorAll('[data-route]').forEach(btn=>btn.addEventListener('click',()=>goRoute(btn.dataset.route)));
document.querySelectorAll('[data-guide-step]').forEach(btn=>btn.addEventListener('click',()=>setGuideStep(btn.dataset.guideStep)));
document.querySelectorAll('[data-detail-tab]').forEach(btn=>btn.addEventListener('click',()=>{state.detailTab=btn.dataset.detailTab;renderDetail();}));
el.languageSwitch.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
  if(button.dataset.language!==state.lang) applyLanguage(button.dataset.language);
}));
el.versionSwitch.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{
  state.version=btn.dataset.version; state.compare=false; showOutline();
  if(state.route==='guide') {
    if(state.guideStep==='gx') loadGx(); else loadElectrical();
  } else if(state.route==='gx') loadGx();
  else loadElectrical();
}));
el.compareButton.addEventListener('click',()=>{state.compare=!state.compare;showOutline();});

window.addEventListener('message',event=>{
  if(event.origin!==location.origin || event.data?.type!=='aiko-device') return;
  const activeFrame=el.frameStack.querySelector('.view-frame.is-active');
  if(!activeFrame || event.source!==activeFrame.contentWindow) return;
  const message=event.data;
  const deviceRecordMap={'gx-old':'gxOld','gx-new':'gxNew'};
  if(deviceRecordMap[message.id]) {
    state.deviceMessage=null;
    state.detailTab='overview';
    showRecord(deviceRecordMap[message.id]);
    return;
  }
  state.deviceMessage=message;
  recordsZh.__device=buildDeviceRecord(message,'zh');
  recordsEn.__device=buildDeviceRecord(message,'en');
  state.detailTab=message.id==='gx-ethernet-link'?'connections':'overview';
  showRecord('__device');
});

renderRoute();
applyLanguage(initialLanguage,{persist:false});
