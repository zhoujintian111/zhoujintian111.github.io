import { hardware, deviceMessage } from './assets/upgrade-data.js?v=assembly-20261003-r7';
import { createAssemblyInspector } from './assets/assembly-inspector.js?v=assembly-20261003-r9';
import { assemblyTargets } from './assets/assembly-guide-data.js?v=assembly-20261003-r9';

const paths = {
  vehicle: 'assets/views/vehicle-master.html',
  electricalOld: 'assets/views/electrical-old.html',
  electricalNew: 'assets/views/electrical-new.html?v=assembly-20261003-r9',
  gxOld: 'assets/views/gx-old.html',
  gxNew: 'assets/views/gx-new.html?v=assembly-20261003-r9'
};

const initialLanguage = localStorage.getItem('aiko-language') === 'en' ? 'en' : 'zh';

const ui = {
  zh: {
    pageTitle:'AIKO 展车升级改装系统', mainNav:'主导航', workspace:'三维交互工作区', inspector:'设备信息',
    brandSubtitle:'欧洲展车数字孪生', navGuide:'升级改装导览', navGuideSub:'2 项核心升级', navExterior:'全车外观', navExteriorSub:'车身与光伏组件', navInterior:'车内总览', navInteriorSub:'固定镜头与关键设备', navElectrical:'电路舱', navElectricalSub:'原电路／改装电路', navGx:'GX 屏幕与控制器', navGxSub:'电视右侧／原厂安装', navCatalog:'设备资料', navCatalogSub:'规格、连接与注意事项',
    baselineTitle:'锁定母版已接入', baselineSub:'只读引用 · 不覆盖源版本', versionOld:'旧车系统', versionNew:'改装后系统', compare:'轮廓对比', stepOverview:'定位改装区域', stepElectrical:'电路舱升级', stepGx:'GX 升级', stepCommunication:'通讯检查', coverLabel:'电路舱展示覆盖面', loading:'正在装入锁定视图…',
    commBoards:'恒流板 ×3', commBoardsSub:'三路独立 RS485 → CM5 原生串口', commHub:'CM5 原生采集', commHubSub:'RS485 CH0–CH2 使用；CH3 备用', commPc:'USR-G806w', commPcSub:'LAN 接 MOXA；Wi-Fi 本地访问', commSwitchSub:'5 口工业交换机', commGxSub:'能源数据汇集；数据集成待联调',
    tabOverview:'概览', tabSpecs:'规格尺寸', tabConnections:'连接结构', tabNotes:'安装注意', headingOverview:'改装逻辑', headingSpecs:'规格尺寸', headingConnections:'连接结构', headingNotes:'安装注意',
    lockedView:'锁定三维视图', sourceNew:'2026.09 安装方案', sourceOld:'原车锁定资产', deviceDetail:'设备详情', genericDevice:'设备', genericDeviceSummary:'当前锁定三维场景中的设备对象。', objectId:'对象标识', genericConnection:'连接关系以当前锁定场景和已确认线路拓扑为准。', genericNote:'未确认的端子、线号和安装数据必须现场复测，不作推定。',
    backGx:'← 返回 GX 安装位置', catalogStatus:'锁定设备资料索引', catalogHint:'选择设备查看规格、连接与安装注意',
    outlineElectricalOld:'旧：MPPT 186 × 132 × 71 mm', outlineElectricalNew:'新：恒流板 158 × 104 × 58.8 mm', outlineBracket:'GX Touch 50 · 原厂贴面固定', outlineGxOld:'旧 GX 130 × 120 × 28 mm', outlineGxNew:'GX Touch 50 · 128.2 × 87.1 mm', outlineDisclaimer:'尺寸概念示意，非等比例安装图；开孔与安装以官方尺寸图及现场复测为准。',
    statusRearForward:'后部向前固定镜头', hintGuide:'展示面将自动上掀，请选择高亮改装区域', statusCommunication:'通讯连接检查', hintStaticIp:'CM5 · MOXA · USR-G806w · Cerbo', statusElectricalNew:'新电路系统 · 2026.09', statusElectricalOld:'旧车系统 v1.0', hintElectricalNew:'三块恒流板、MC4 与通讯汇聚', hintElectricalOld:'三台 MPPT 与原车线路基准', statusGxNew:'GX Touch 50', statusGxOld:'旧版 GX v01', hintGxNew:'电视右侧同一正面白墙 · 中心距车内地板 1450 mm', hintGxOld:'Color Control GX 拆换基准', statusExterior:'外观固定镜头', hintExterior:'点击高亮组件查看规格与安装信息', statusInterior:'车内固定镜头', hintInterior:'点击电路舱、组件或 GX 查看资料', statusGxLocation:'GX 安装位置', hintGxLocation:'原车位置保留为拆换基准；点击查看控制器升级'
  },
  en: {
    pageTitle:'AIKO Show Vehicle Upgrade System', mainNav:'Main navigation', workspace:'Interactive 3D workspace', inspector:'Device information',
    brandSubtitle:'Europe Show Vehicle Digital Twin', navGuide:'Upgrade Guide', navGuideSub:'2 core upgrades', navExterior:'Vehicle Exterior', navExteriorSub:'Body and PV modules', navInterior:'Interior Overview', navInteriorSub:'Fixed views and key devices', navElectrical:'Electrical Bay', navElectricalSub:'Original / upgraded circuits', navGx:'GX Screen & Controller', navGxSub:'TV-side / factory mounting', navCatalog:'Device Data', navCatalogSub:'Specs, wiring and notes',
    baselineTitle:'Locked masters connected', baselineSub:'Read-only references · originals preserved', versionOld:'Original System', versionNew:'Upgraded System', compare:'Outline Compare', stepOverview:'Locate Upgrade Areas', stepElectrical:'Electrical Bay', stepGx:'GX Upgrade', stepCommunication:'Communication Check', coverLabel:'Electrical-bay display cover', loading:'Loading locked view…',
    commBoards:'Constant-current boards ×3', commBoardsSub:'3 independent RS485 → CM5 native ports', commHub:'CM5 Native Acquisition', commHubSub:'RS485 CH0–CH2 used; CH3 spare', commPc:'USR-G806w', commPcSub:'LAN to MOXA; local Wi-Fi access', commSwitchSub:'5-port industrial Ethernet switch', commGxSub:'Energy monitoring; integration pending',
    tabOverview:'Overview', tabSpecs:'Specifications', tabConnections:'Connections', tabNotes:'Installation', headingOverview:'Upgrade Logic', headingSpecs:'Specifications', headingConnections:'Connection Structure', headingNotes:'Installation Notes',
    lockedView:'Locked 3D view', sourceNew:'2026.09 mounting design', sourceOld:'Locked original asset', deviceDetail:'Device Details', genericDevice:'Device', genericDeviceSummary:'Device object in the currently locked 3D scene.', objectId:'Object ID', genericConnection:'Connection data follows the locked scene and confirmed wiring topology.', genericNote:'Any unconfirmed terminal, wire ID or installation dimension must be verified on the vehicle.',
    backGx:'← Back to GX Installation', catalogStatus:'Locked Device Index', catalogHint:'Select a device for specifications, connections and installation notes',
    outlineElectricalOld:'Original: MPPT 186 × 132 × 71 mm', outlineElectricalNew:'New: board 158 × 104 × 58.8 mm', outlineBracket:'GX Touch 50 · standard surface mount', outlineGxOld:'Original GX 130 × 120 × 28 mm', outlineGxNew:'GX Touch 50 · 128.2 × 87.1 mm', outlineDisclaimer:'Conceptual size comparison, not a scaled installation drawing. Use official drawings and on-vehicle measurements for installation.',
    statusRearForward:'Rear-to-front fixed view', hintGuide:'The display cover opens automatically; select a highlighted upgrade area', statusCommunication:'Communication Connection Check', hintStaticIp:'CM5 · MOXA · USR-G806w · Cerbo', statusElectricalNew:'Electrical Update · 2026.09', statusElectricalOld:'Original Vehicle System v1.0', hintElectricalNew:'Three constant-current boards, MC4 and communication aggregation', hintElectricalOld:'Three MPPT units and original wiring baseline', statusGxNew:'GX Touch 50', statusGxOld:'Original GX v01', hintGxNew:'Same front wall, right of TV · centre 1450 mm above interior floor', hintGxOld:'Color Control GX replacement baseline', statusExterior:'Exterior Fixed View', hintExterior:'Select a highlighted module for specifications and installation data', statusInterior:'Interior Fixed View', hintInterior:'Select the electrical bay, PV module or GX for details', statusGxLocation:'GX Installation Position', hintGxLocation:'Select the highlighted GX to open the millimetre-level close-up'
  }
};

const routeSets = {
  zh: {
    guide: { title: '升级改装导览', eyebrow: 'UPGRADE GUIDANCE' }, exterior: { title: '全车外观', eyebrow: 'VEHICLE EXTERIOR' }, interior: { title: '车内总览', eyebrow: 'INTERIOR VIEWS' }, electrical: { title: '电路舱', eyebrow: 'ELECTRICAL COMPARTMENT' }, gx: { title: 'GX 控制器', eyebrow: 'GX INSTALLATION' }, catalog: { title: '设备资料', eyebrow: 'COMPONENT INDEX' }
  },
  en: {
    guide: { title: 'Upgrade Guide', eyebrow: 'UPGRADE GUIDANCE' }, exterior: { title: 'Vehicle Exterior', eyebrow: 'VEHICLE EXTERIOR' }, interior: { title: 'Interior Overview', eyebrow: 'INTERIOR VIEWS' }, electrical: { title: 'Electrical Bay', eyebrow: 'ELECTRICAL COMPARTMENT' }, gx: { title: 'GX Controller', eyebrow: 'GX INSTALLATION' }, catalog: { title: 'Device Data', eyebrow: 'COMPONENT INDEX' }
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
    status: '改装后系统', title: '新电路系统 · 2026.09', source: '新电路系统v1.0',
    summary: '用三块输入恒流板替代三台 MPPT，保持 MG、电池、母排和其他未授权设备不变。',
    overview: ['每一路光伏由独立恒流板控制，禁用 MPPT。', '右侧 IN 接组件输出，左侧 OUT 向下接入 MG。', '上部信号口接工业电脑，实现三路独立采集与设定。'],
    specs: [['恒流板总成','158 × 104 × 58.8 mm'],['安装孔距','146 × 73 mm'],['螺钉孔','4 × Ø4.5 mm'],['输入电流范围','0–10 A（计划工作 7–10 A）'],['单路功率上限','≤ 400 W']],
    connections: ['右侧 IN：接光伏组件 MC4 输出。', '左侧 OUT：向下接 MG Master LV。', '顶部信号：每块板的 RS485 A／B 分别接一只隔离 RS485 转 USB 适配器。', '三只适配器分别进入有源 USB 集线器，集线器上行 USB 接工业电脑。', '三块板分别编号，三路数据不得合并为一个虚拟设备。'],
    notes: ['三块恒流板为同规格、可命名设备，不与某一品牌组件永久绑定；任一组件均可连接任一恒流板。', '接线完成后，必须按“组件 → 恒流板 IN → 原生 RS485 通道”的实际链路统一命名、编号和线标。', '原 MPPT 孔位不能直接视为恒流板孔位，必须使用精确转接板。', 'MC4 正负极、插头方向、最小弯曲半径和检修间距必须在施工图中锁定。', '板卡最终端子高度与线鼻子空间需实物复测。']
  },
  gxOld: {
    status: '原车基准', title: '旧版 Color Control GX', source: '旧版GXv01',
    summary: '旧版 GX 保留为拆换前尺寸与安装位置基准，用于检查新设备是否遮挡、嵌入或侵占玻璃门余量。',
    overview: ['位于靠玻璃门的凹入窄面。', '左边紧贴凸出的厚沿。', '设备正面、按键、屏幕和安装厚度均使用锁定样机。'],
    specs: [['外形','130 × 120 × 28 mm'],['安装状态','凹入面安装'],['版本','旧版GXv01']],
    connections: ['接入原车 Victron 通讯系统。'],
    notes: ['拆卸前记录原开孔、紧固件、背部插头方向与可用深度。']
  },
  gxNew: {},
  communication: {}
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
    status:'Upgraded System', title:'Electrical Update · 2026.09', source:'Electrical Update · 2026.09',
    summary:'Replaces the three MPPT units with three input constant-current boards while preserving MG, battery, busbars and all other non-authorized equipment.',
    overview:['Each PV circuit is controlled by an independent constant-current board; MPPT is disabled.','The right-side IN connects to the PV module output; the left-side OUT turns down toward MG.','The upper signal port connects to the industrial PC for independent acquisition and setting of all three channels.'],
    specs:[['Board assembly','158 × 104 × 58.8 mm'],['Mounting-hole pattern','146 × 73 mm'],['Screw holes','4 × Ø4.5 mm'],['Input-current range','0–10 A (planned operation 7–10 A)'],['Per-channel power limit','≤ 400 W']],
    connections:['Right-side IN: PV module MC4 output.','Left-side OUT: routes downward to MG Master LV.','Upper signal: RS485 A/B from each board connects to one isolated RS485-to-USB adapter.','The three adapters connect to a powered USB hub; the hub upstream USB connects to the industrial PC.','Give every board a permanent ID; do not merge the channels into one virtual device.'],
    notes:['The three boards are identical, nameable devices and are not permanently bound to a PV brand; any module may be assigned to any board.','After wiring, use one consistent name and label for the actual Module → Board IN → native RS485 channel chain.','The MPPT holes cannot be treated as direct board mounting holes; use the dimensioned adapter plate.','Lock MC4 polarity, connector direction, minimum bend radius and service clearance in the installation drawing.','Final terminal height and cable-lug space require physical measurement.']
  },
  gxOld: {
    status:'Original Baseline', title:'Original Color Control GX', source:'Original GX v01',
    summary:'The original GX remains the dimensional and installation-position baseline for checking obstruction, recess depth and glass-door clearance.',
    overview:['Installed on the recessed narrow panel next to the glass door.','Its left edge sits directly against the projecting trim.','Front face, buttons, display and installed depth use the locked sample model.'],
    specs:[['Overall size','130 × 120 × 28 mm'],['Installation','Recessed panel'],['Version','Original GX v01']],
    connections:['Connected to the original Victron communication system.'],
    notes:['Before removal, record the cut-out, fasteners, rear connector directions and available depth.']
  },
  gxNew: {},
  communication: {}
};

for (const [collection, language] of [[recordsZh,'zh'],[recordsEn,'en']]) {
  const en=language==='en';
  const d=hardware.gxTouch[language];
  collection.gxNew={status:en?'GX Screen Installation':'GX 屏幕升级安装',title:'GX Touch 50 + Cerbo GX MK2',source:en?'2026.10 mounting design':'2026.10 安装方案',summary:d.summary,overview:[d.summary],specs:d.specs,connections:d.connections,notes:d.notes,docs:d.docs};
  collection.communication={status:en?'Communication Design':'通讯连接方案',title:en?'Native RS485 + Wired LAN':'原生 RS485 ＋ 有线局域网',source:en?'2026.09 update':'2026.09 更新',
    summary:en?'Three boards use CM5 native RS485 CH0–CH2. MOXA connects CM5, Cerbo and USR-G806w; Wi-Fi provides local access.':'三块恒流板直接接入 CM5 原生 RS485 CH0–CH2；MOXA 连接 CM5、Cerbo 和 USR-G806w，Wi-Fi 提供本地访问。',
    overview:en?['Four native isolated RS485 channels; CH3 spare.','Three independent channels require the manufacturer protocol and software commissioning.','USR-G806w provides Wi-Fi access; internet access is optional.','GX Touch 50 is mounted on the same front white wall, right of the TV, with its centre 1450 mm above the interior floor.']:['四路原生隔离 RS485；CH3备用。','三块板分别采集；厂家协议、CM5程序及GX数据集成尚需联调。','USR-G806w 提供 Wi-Fi 本地接入，4G联网按现场需要配置。','GX Touch 50 安装在电视右侧同一正面白墙上，中心距车内地板1450 mm；组合线接Cerbo HDMI与USB。'],
    specs:en?[['RS485','3 × independent native channels'],['Cable','3 × 0.5 mm² shielded; Cat6 Ethernet'],['Switch','MOXA EDS-205A, 5 × 10/100M'],['Controller','Cerbo GX MK2'],['Router','USR-G806w'],['Plate','450 × 250 × 4 mm; first article'],['Network addresses','Configure one subnet; addresses and DHCP range pending']]:[['RS485','3 路独立原生串口'],['线材','3 × 0.5 mm² 屏蔽线；Cat6 网线'],['交换机','MOXA EDS-205A，5 × 10/100M'],['GX控制器','Cerbo GX MK2'],['路由器','USR-G806w'],['底板','450 × 250 × 4 mm；首件方案'],['网络地址','统一网段；静态地址与DHCP范围待配置']],
    connections:en?['Board 1/2/3 → CM5 RS485 CH0/CH1/CH2.','CM5 ETH1 → MOXA Port 5.','MOXA Port 1 → Cerbo Ethernet.','MOXA Port 2 → USR-G806w LAN.','Ports 3/4 spare; port allocation is the wiring plan.']:['恒流板 1/2/3 → CM5 RS485 CH0/CH1/CH2。','CM5 ETH1 → MOXA Port 5。','MOXA Port 1 → Cerbo Ethernet。','MOXA Port 2 → USR-G806w LAN。','Port 3/4 备用；上述端口编号为本次布线方案。'],
    notes:en?['Confirm board protocol, pinout and termination.','Verify mounting, antennas and cable lengths on the actual vehicle.','Software data transfer and vehicle commissioning are not validated by this model.']:['恒流板针脚、协议及终端电阻按厂家资料确认。','底板、天线、线长和固定点须首件实装复核。','模型不代表采集软件、GX数据上报或实车联调已经通过。']};
  collection.guide.overview[1]=en?'GX controller: Cerbo GX MK2; GX Touch 50 is mounted on the same front white wall, right of the TV, with its centre 1450 mm above the interior floor.':'GX Touch 50 位于电视右侧同一正面白墙；Cerbo GX MK2 保持在电路舱通讯板。';
  collection.guide.overview[2]=en?'Existing vehicle and original-system models remain the preserved baseline.':'保留全车与旧车母版；本轮只更新已授权设备和直属线路。';
  collection.guide.connections[2]=collection.communication.summary;
  collection.electricalNew.overview[2]=en?'Native CM5 RS485 CH0–CH2 collect the three channels independently.':'上部 RS485 独立进入 CM5 原生串口 CH0–CH2。';
  collection.electricalNew.specs.push([en?'Adapter plate':'转接板','196 × 150 × 4 mm'],[en?'Original hole pitch':'旧孔距','132 × 122 mm']);
  collection.electricalNew.connections=[...collection.electricalNew.connections.slice(0,2),collection.communication.connections[0],en?'CM5, Cerbo and USR-G806w connect through MOXA.':'CM5、Cerbo和USR-G806w通过MOXA有线互联。'];
  collection.electricalNew.overview.push(en?'L layout: board 1 directly right of Orion, board 2 directly below board 1, board 3 directly left of board 2 and below Orion.':'L 型布局：1号在 Orion 正右方，2号在1号正下方，3号在2号正左方、Orion 正下方。');
  collection.electricalNew.connections.push(en?'Red → CM5 R/A (A+); black → T/B (B−); blue → signal GND. Silver braid remains separately insulated pending a bonding point.':'红 → CM5 R/A（A+）；黑 → T/B（B−）；蓝 → 信号GND；银色屏蔽网单独绝缘，接地点待确认。');
  collection.electricalNew.notes.push(en?'The confirmed L layout is shown. Exact vehicle fixing coordinates, cable bend space and this-batch enclosure photos require field verification.':'已按确认关系显示 L 型布局；现场固定坐标、接头弯线空间和本批次外壳实物照仍需复核。');
}

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
  'ethernet-switch': { specs:[['设备','Moxa EDS-205A'],['外形','30 × 115 × 70 mm'],['端口','5 × 10／100BaseT(X) RJ45']], connections:['工业电脑和 Ekrano GX 分别接入 RJ45 端口。'], notes:['非网管交换机不分配 IP，也不提供 DHCP。'] },
  'constant-aiko': { specs:[['设备','恒流板 1'],['总成','158 × 104 × 58.8 mm'],['安装孔距','146 × 73 mm']], connections:['右侧 IN 接组件；左侧 OUT 接 MG；顶部 RS485 接 CM5 原生串口。'], notes:['经 196 × 150 × 4 mm 转接板固定。', '安装位置不绑定组件品牌；完工后按实际组件、IN 端和通讯通道统一命名。'] },
  'constant-ja': { specs:[['设备','恒流板 2'],['总成','158 × 104 × 58.8 mm'],['安装孔距','146 × 73 mm']], connections:['右侧 IN 接组件；左侧 OUT 接 MG；顶部 RS485 接 CM5 原生串口。'], notes:['经 196 × 150 × 4 mm 转接板固定。', '安装位置不绑定组件品牌；完工后按实际组件、IN 端和通讯通道统一命名。'] },
  'constant-jk': { specs:[['设备','恒流板 3'],['总成','158 × 104 × 58.8 mm'],['安装孔距','146 × 73 mm']], connections:['右侧 IN 接组件；左侧 OUT 接 MG；顶部 RS485 接 CM5 原生串口。'], notes:['经 196 × 150 × 4 mm 转接板固定。', '安装位置不绑定组件品牌；完工后按实际组件、IN 端和通讯通道统一命名。'] },
  'vehicle-source': { specs:[['设备','原车电源侧']], connections:['发电机／启动电池母线接入行车充电回路。'], notes:['原车接口与保护参数保持不变。'] },
  'gx-old': { specs:[['设备','Color Control GX'],['外形','130 × 120 × 28 mm']], connections:['接入原车 Victron 通讯系统。'], notes:['拆卸前记录开孔、紧固件、背部插头方向和可用深度。'] },
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
  'ethernet-switch': { specs:[['Device','Moxa EDS-205A'],['Size','30 × 115 × 70 mm'],['Ports','5 × 10/100BaseT(X) RJ45']], connections:['PC LAN1 connects to Port 5; Port 1 connects to the Ekrano GX rear Ethernet RJ45 port.'], notes:['This unmanaged switch does not assign IP addresses and has no DHCP service.'] },
  'constant-aiko': { specs:[['Device','Constant-current board 1'],['Assembly','158 × 104 × 58.8 mm'],['Mounting pattern','146 × 73 mm']], connections:['Right MC4 panel IN to PV; left MC4 panel OUT to MG; upper RS485 to CM5 native channel.'], notes:['Mounted through a 196 × 150 × 4 mm adapter plate.','Installation position is not tied to a PV brand; name the board from the actual module, IN cable and communication channel after wiring.'] },
  'constant-ja': { specs:[['Device','Constant-current board 2'],['Assembly','158 × 104 × 58.8 mm'],['Mounting pattern','146 × 73 mm']], connections:['Right MC4 panel IN to PV; left MC4 panel OUT to MG; upper RS485 to CM5 native channel.'], notes:['Mounted through a 196 × 150 × 4 mm adapter plate.','Installation position is not tied to a PV brand; name the board from the actual module, IN cable and communication channel after wiring.'] },
  'constant-jk': { specs:[['Device','Constant-current board 3'],['Assembly','158 × 104 × 58.8 mm'],['Mounting pattern','146 × 73 mm']], connections:['Right MC4 panel IN to PV; left MC4 panel OUT to MG; upper RS485 to CM5 native channel.'], notes:['Mounted through a 196 × 150 × 4 mm adapter plate.','Installation position is not tied to a PV brand; name the board from the actual module, IN cable and communication channel after wiring.'] },
  'vehicle-source': { specs:[['Device','Original vehicle power side']], connections:['Alternator / starter-battery bus feeds the driving-charge circuit.'], notes:['Keep the original interface and protection settings unchanged.'] },
  'gx-old': { specs:[['Device','Color Control GX'],['Size','130 × 120 × 28 mm']], connections:['Connected to the original Victron communication system.'], notes:['Before removal, record cut-out, fasteners, rear plug directions and depth.'] },
};

let deviceDetails = initialLanguage === 'en' ? deviceDetailsEn : deviceDetailsZh;

for (const key of Object.keys(hardware)) {
  const d=hardware[key];
  deviceDetailsZh[d.id]=d.zh;deviceDetailsEn[d.id]=d.en;
  recordsZh[key]={status:'设备资料',title:d.title,source:'2026.09 安装方案',summary:d.zh.summary,overview:[d.zh.summary],...d.zh};
  recordsEn[key]={status:'Device Data',title:d.titleEn||d.title,source:'2026.09 design',summary:d.en.summary,overview:[d.en.summary],...d.en};
}
for (const id of ['constant-aiko','constant-ja','constant-jk']) {
  deviceDetailsZh[id].connections=['右侧 IN 接组件；左侧 OUT 向下接 MG；顶部 RS485 接 CM5 原生独立通道。'];
  deviceDetailsEn[id].connections=['Right IN receives PV; left OUT routes down to MG; top RS485 uses one native CM5 channel.'];
  deviceDetailsZh[id].specs.push(['转接板','196 × 150 × 4 mm'],['旧孔距','132 × 122 mm'],['范围 / 工作点','0–10 A / 7–10 A']);
  deviceDetailsEn[id].specs.push(['Adapter','196 × 150 × 4 mm'],['Old hole pitch','132 × 122 mm'],['Range / operating point','0–10 A / 7–10 A']);
}

const catalogSets = {
  zh: [
  ['body','车身与光伏组件','7200 × 2150 × 3000 mm；组件 1762 × 1134 × 30 mm'],
  ['interiorModule','内壁光伏组件','车厢内壁悬挂，全黑组件表面'],
  ['electricalOld','旧车系统 v1.0','三台 MPPT、MG、电池与原线路'],
  ['electricalNew','新电路系统 · 2026.09','三块恒流板、MC4 与新通讯'],
  ['gxOld','旧版 Color Control GX','130 × 120 × 28 mm'],
  ['gxNew','GX Touch 50 + Cerbo GX MK2','GX Touch 50 · 中心高1450 mm；Cerbo位于电路舱'],
  ['communication','通讯系统','恒流板 ×3 → CM5 → MOXA → Cerbo / USR']
  ],
  en: [
    ['body','Vehicle Body and PV Modules','7200 × 2150 × 3000 mm; module 1762 × 1134 × 30 mm'],
    ['interiorModule','Interior-mounted PV Module','Mounted on the interior wall; all-black surface'],
    ['electricalOld','Original Vehicle System v1.0','Three MPPT units, MG, battery and original cables'],
    ['electricalNew','Electrical Update · 2026.09','Three constant-current boards, MC4 and new communication'],
    ['gxOld','Original Color Control GX','130 × 120 × 28 mm'],
    ['gxNew','GX Touch 50 + Cerbo GX MK2','GX Touch 50 · 1450 mm centre height; Cerbo in electrical bay'],
    ['communication','Communication System','Boards ×3 → CM5 → MOXA → Cerbo / USR']
  ]
};

for (const [key,d] of Object.entries(hardware)) {if(key==='cerbo'||key==='gxTouch')continue;catalogSets.zh.push([key,d.title,d.zh.specs[1][1]]);catalogSets.en.push([key,d.title,d.en.specs[1][1]]);}

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

const gxViews=[['gx-installation','安装位置','Installation'],['gx-front','屏幕近景','Screen close-up'],['gx-mount','固定件展开','Mounting detail']];
const state = { route:'guide', guideStep:'overview', version:'old', detailTab:'overview', record:'guide', camera:'rear-forward', compare:false, gxDetail:false, lang:initialLanguage, deviceMessage:null };
const el = Object.fromEntries(['frameStack','hotspots','coverSheet','outlineLayer','loading','stageStatus','stageHint','routeTitle','routeEyebrow','versionSwitch','compareButton','guideSteps','viewStrip','communicationCard','detailStatus','detailTitle','sourceChip','detailSummary','detailBody','languageSwitch'].map(id => [id,document.getElementById(id)]));
let sceneGeneration=0;
const sceneTimers=new Set();
let currentHotspotItems=[];
const assemblyInspector=createAssemblyInspector({
  container:document.getElementById('assemblyInspector'),
  getLanguage:()=>state.lang,
  send:(command,value)=>{
    const frame=el.frameStack.querySelector('.view-frame.is-active');
    if(command==='select' && assemblyTargets.some(target=>target.id===value)){
      const gx=value==='gx-touch50';
      const scenePath=gx?'gx-new.html':'electrical-new.html';
      if(!frame?.src.includes(scenePath)){
        assemblyDeepLink=value;
        state.deviceMessage=null;
        state.route=gx?'gx':'electrical';
        state.version='new';
        renderRoute();
        return;
      }
    }
    frame?.contentWindow?.postMessage({type:'aiko-assembly-command',command,value},location.origin);
  }
});
const requestedAssembly=new URLSearchParams(location.search).get('assembly');
let assemblyDeepLink=assemblyTargets.some(board=>board.id===requestedAssembly)?requestedAssembly:null;

function text(key){return ui[state.lang][key] || ui.zh[key] || key;}
function labelFor(item){return state.lang==='en' ? (item.labelEn || item.label) : item.label;}
function viewLabel(view){return state.lang==='en' ? (view[2] || view[1]) : view[1];}

function beginScene() {
  const oldFrame=el.frameStack.querySelector('.view-frame.is-active');
  oldFrame?.contentWindow?.postMessage({type:'aiko-assembly-command',command:'exit'},location.origin);
  assemblyInspector.reset();
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
    specs:message[language==='en'?'specsEn':'specsZh']||detail.specs||[[copy.objectId,message.id||'—']],
    connections:message[language==='en'?'connectionsEn':'connectionsZh']||detail.connections||[copy.genericConnection],
    notes:message[language==='en'?'notesEn':'notesZh']||detail.notes||[copy.genericNote]
  };
}

function refreshViewStripLanguage() {
  el.viewStrip.querySelectorAll('[data-camera]').forEach(button=>{
    const allViews=[...externalViews,...interiorViews,...gxViews];
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
    if(frame.src.includes('electrical-new.html'))frame.title=state.lang==='en'?'Upgraded electrical system':'改装后电路系统';
    if(frame.src.includes('gx-new.html'))frame.title=state.lang==='en'?'GX screen and vehicle interior':'GX屏幕与车内总览';
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
  const ariaLabels={'#languageSwitch':['语言','Language'],'#versionSwitch':['系统版本','System version'],'#guideSteps':['改装步骤','Upgrade steps'],'#viewStrip':['固定镜头快捷入口','View shortcuts'],'.detail-tabs':['资料分类','Information tabs']};
  for(const [selector,labels]of Object.entries(ariaLabels))document.querySelector(selector)?.setAttribute('aria-label',labels[state.lang==='en'?1:0]);
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
  frame.title = src.includes('electrical-new.html') ? (state.lang==='en'?'Upgraded electrical system':'改装后电路系统') : src.includes('gx-new.html') ? (state.lang==='en'?'GX screen and vehicle interior':'GX屏幕与车内总览') : options.title || text('lockedView');
  frame.setAttribute('loading','eager');
  el.frameStack.appendChild(frame);
  frame.addEventListener('load', () => {
    if(generation!==sceneGeneration){frame.remove();return;}
    requestAnimationFrame(() => {
      if(generation!==sceneGeneration)return;
      el.frameStack.querySelectorAll('.view-frame.is-active').forEach(old=>old.classList.remove('is-active'));
      frame.classList.add('is-active');
    });
    [...el.frameStack.querySelectorAll('.view-frame')].filter(x => x !== frame).forEach(old => {
      old.classList.add('is-leaving');
      setTimeout(() => old.remove(), 680);
    });
    const selectPendingAssembly=()=>{
      const boardId=assemblyDeepLink;
      const targetPath=boardId==='gx-touch50'?paths.gxNew:paths.electricalNew;
      if(!boardId || src!==targetPath || src===paths.gxNew&&!frame.contentWindow?.aikoAssemblyGuide)return;
      assemblyDeepLink=null;
      requestAnimationFrame(()=>{
        if(generation!==sceneGeneration)return;
        frame.contentWindow?.postMessage({type:'aiko-language',language:state.lang},location.origin);
        frame.contentWindow?.postMessage({type:'aiko-assembly-command',command:'select',value:boardId},location.origin);
      });
    };
    if (options.camera) activateCamera(frame, options.camera);
    if(src===paths.gxNew&&!frame.contentWindow?.aikoAssemblyGuide)frame.contentWindow?.addEventListener('aiko-scene-ready',()=>{if(generation===sceneGeneration){if(options.camera)activateCamera(frame,options.camera);frame.contentWindow.postMessage({type:'aiko-language',language:state.lang},location.origin);selectPendingAssembly();}}, {once:true});
    try{frame.contentWindow?.postMessage({type:'aiko-language',language:state.lang},location.origin)}catch(_){}
    selectPendingAssembly();
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
      renderHotspots(frame.src.includes('gx-new.html')?[]:(hotspotMap[state.camera] || []));
      setActiveViewButton(state.camera);
    }));
  } catch (_) {}
  renderHotspots(frame.src.includes('gx-new.html')?[]:(hotspotMap[camera] || []));
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
  const selectedDeviceId=state.deviceMessage?.id;
  const communicationDevice=['comm-backplate','cm5-native','ethernet-switch','usr-router','cerbo-gx','aux-fuse','negative-distributor'].includes(selectedDeviceId);
  const gxDevice=selectedDeviceId==='gx-new';
  const eligible=state.version==='new' && (state.record==='electricalNew' || state.record==='communication' || state.record==='gxNew' || (gxDevice || communicationDevice || assemblyTargets.some(board=>board.id===selectedDeviceId)) && state.record==='__device');
  const assemblyTarget=state.record==='gxNew' || state.record==='__device' && gxDevice?'gx-touch50':state.record==='communication' || state.record==='__device' && communicationDevice?'comm-backplate':selectedDeviceId;
  assemblyInspector.setEligible(eligible,assemblyTarget);
  document.querySelector('.detail-tabs').hidden=assemblyInspector.active;
  el.detailBody.hidden=assemblyInspector.active;
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
  if(step==='gx') { state.version='new'; setVersionVisible(true); loadGx(); }
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
  setViewStrip(isNew?gxViews:[]);
  loadFrame(isNew?paths.gxNew:paths.gxOld,{title:isNew?'GX Touch 50':'旧版GXv01',camera:isNew?'gx-installation':undefined});
  showRecord(isNew?'gxNew':'gxOld'); setVersionVisible(true,false); renderHotspots([]);
}

function openGxDetail() {
  state.gxDetail=true; state.version='new';
  if(state.route==='guide'){state.guideStep='gx';document.querySelectorAll('[data-guide-step]').forEach(btn=>btn.classList.toggle('is-active',btn.dataset.guideStep==='gx'));}
  loadGx();
  setViewStrip(gxViews, {labelZh:ui.zh.backGx,labelEn:ui.en.backGx,action:()=>{
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
  if(state.route==='interior') {setVersionVisible(false);state.camera='rear-forward';setViewStrip(interiorViews);loadFrame(paths.gxNew,{title:routes.interior.title,camera:'rear-forward'});showRecord('interiorModule');setStageCopy('statusInterior','hintInterior');}
  if(state.route==='electrical') {state.version=assemblyDeepLink?'new':'old';loadElectrical();}
  if(state.route==='gx') {state.version='new';state.gxDetail=true;loadGx();}
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
  if(event.origin!==location.origin || !['aiko-device','aiko-assembly-state'].includes(event.data?.type)) return;
  const activeFrame=el.frameStack.querySelector('.view-frame.is-active');
  if(!activeFrame || event.source!==activeFrame.contentWindow) return;
  if(event.data.type==='aiko-assembly-state'){
    assemblyInspector.update(event.data);
    document.querySelector('.detail-tabs').hidden=assemblyInspector.active;
    el.detailBody.hidden=assemblyInspector.active;
    return;
  }
  const message=event.data;
  const deviceRecordMap={'gx-old':'gxOld','gx-new':'gxNew'};
  if(deviceRecordMap[message.id]) {
    if(message.id==='gx-new')state.version='new';
    state.deviceMessage=null;
    state.detailTab='overview';
    showRecord(deviceRecordMap[message.id]);
    return;
  }
  state.deviceMessage=message;
  recordsZh.__device=buildDeviceRecord(message,'zh');
  recordsEn.__device=buildDeviceRecord(message,'en');
  state.detailTab=message.isCable?'specs':'overview';
  showRecord('__device');
});

if(assemblyDeepLink)state.route=assemblyDeepLink==='gx-touch50'?'gx':'electrical';
renderRoute();
applyLanguage(initialLanguage,{persist:false});
