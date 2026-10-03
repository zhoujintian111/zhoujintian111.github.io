import { communicationGuide } from './communication-guide-data.js?v=assembly-20261003-r4';
import { gxGuide } from './gx-guide-data.js?v=assembly-20261003-r5';
// Shared installation guide for the three confirmed constant-current board locations.
// Part quantities are per board, not a new shipping BOM. Channel map follows upgrade-data.js.
const bi=(zh,en)=>({zh,en});
const sharedAssemblyGuide={
  boardId:'constant-aiko',
  parts:[
    {id:'adapter',index:'A02',name:bi('转换板','Adapter plate'),spec:bi('196 × 150 × 4 mm · 6061-T6','196 × 150 × 4 mm · 6061-T6'),quantity:bi('1 块 / 恒流板','1 per board'),purpose:bi('现场固定到电池仓背板，再承接恒流板整机。','Installed on the battery-bay backboard before the complete module.'),note:bi('右侧两块预计复用原孔，现场核对；左侧新位置打孔，仍统一用转换板。','The two right-hand plates are expected to reuse existing holes; verify on site. Drill at the new left-hand location and retain its adapter plate.')},
    {id:'wall-screws',index:'A05',name:bi('转换板 → 背板螺丝','Adapter-to-backboard screws'),spec:bi('原车螺丝优先；已备 M5×8 可现场选用','Reuse original screws first; prepared M5×8 screws are an on-site option'),quantity:bi('4 处 / 转换板','4 locations per adapter'),purpose:bi('螺丝直接固定进背板，背面没有螺母或固定件。','Screws secure directly into the backboard, with no rear nuts or hardware.'),note:bi('按现场基层、原孔和长度选择原件或新件；图中不指定钻头、螺纹形式及扭矩。垫片按原方案现场核对。','Choose original or new screws to suit the substrate, existing holes and required length. Drill size, thread form and torque are not specified. Confirm washers on site.')},
    {id:'module',index:'A01',name:bi('预装完整恒流板','Complete preassembled module'),spec:bi('外形 158 × 104 × 58.8 mm','Envelope 158 × 104 × 58.8 mm'),quantity:bi('1 套 / 安装位置','1 per installation location'),purpose:bi('壳体、内部连接、MC4 面板座和内部扎带座均已预装。','Enclosure, internal wiring, MC4 panel sockets and internal cable mounts arrive assembled.'),note:bi('现场不用拆开整机；爆炸图只分解现场安装件。','The module stays closed on site. The exploded view separates only site-installed parts.')},
    {id:'module-screws',index:'A03',name:bi('恒流板 → 转换板螺钉','Module-to-adapter screws'),spec:bi('M4×6 · 4 处','M4×6 · 4 locations'),quantity:bi('4 颗 / 恒流板','4 per module'),purpose:bi('穿过安装耳，拧入转换板上的 M4 螺纹孔。','Pass through the mounting ears and engage the adapter’s M4 threaded holes.'),note:bi('146 × 73 mm 孔距；核对螺钉啮合及背面突出量。整机盖板螺丝保持预装。','146 × 73 mm pitch; check thread engagement and rear projection. Enclosure cover screws remain preassembled.')},
    {id:'mc4',index:'A09',name:bi('现场加装 EVO2 线端','EVO2 cable ends fitted on site'),spec:bi('Stäubli MC4-Evo 2 · IN± / OUT±','Stäubli MC4-Evo 2 · IN± / OUT±'),quantity:bi('4 个线端 / 恒流板','4 cable ends per module'),purpose:bi('原车输入、输出线没有 MC4；现场制作线端后与整机面板座插合。','Original input/output wires have no MC4 ends. Terminate the wires on site, then mate them to the module sockets.'),note:bi('按对应料号及 MA273 核对导线、密封件和工具，再剥线、压接、装入壳体、锁紧与检查。具体长度和扭矩按实物对应版本；不混配不同制造商。','Match the part number, cable, seal and tools to MA273, then strip, crimp, insert, tighten and inspect. Use the values for the actual variant; do not mix manufacturers.')}
  ],
  steps:[
    {title:bi('断电、隔离并验电','Isolate all supplies and prove dead'),text:bi('拆线或松动旧设备之前，先由现场电气人员完成安全隔离。','A qualified electrical installer must complete safe isolation before disconnecting wires or loosening the old equipment.'),actions:[
      bi('停止该支路运行，按原车规程识别并隔离光伏、电池及可能反向供电的行车充、辅助电源；如有其他电源一并核对。','Stop the affected circuit. Follow the vehicle procedure to identify and isolate PV, battery and any backfeed from the vehicle charger, auxiliary supply or other connected sources.'),
      bi('采取防误送电措施。光伏在光照下仍可带电，不能只凭关闭总开关或屏幕熄灭判断断电。','Prevent unintended reconnection. PV can remain live in daylight; a main switch or dark display alone does not prove isolation.'),
      bi('用适用于该直流系统的验电仪表核验所有待操作导线，验电前后确认仪表正常；按设备要求等待储能释放。','Use a tester suitable for the DC system to verify every conductor to be worked on. Prove the tester before and after use and allow stored energy to dissipate as specified.')
    ],check:bi('所有待操作点已确认无危险电压，隔离措施保持有效，才进入拆除步骤。具体开关位置和操作顺序须由现场确认。','Proceed only when all work points are verified safe and isolation remains effective. The actual switches and switching order must be confirmed on site.'),viewNote:bi('画面为旧MPPT位置参照；断电和拆除动作以右侧说明为准。','The old MPPT is a location reference. Follow the written isolation and removal instructions.'),parts:[]},
    {title:bi('拍照并标记原车线路','Photograph and label the original wiring'),text:bi('保持断电，先把每根线的归属记录清楚，再拆线。','Keep isolation in place. Record each wire’s identity before disconnection.'),actions:[
      bi('拍下旧MPPT全景、输入输出端子及原螺丝安装位置。','Photograph the old MPPT, its input/output terminals and original fixing points.'),
      bi('分别标记光伏输入＋/−、通向MG充电侧的输出＋/−及原通讯线，记录对应板号；不要只凭线色判断。','Label PV input +/−, output +/− to the MG charging side and the original communication lead, including the board number. Do not rely on colour alone.'),
      bi('保留线路原走向及必要长度；原车输入、输出线尚无MC4，需要保留现场制端的操作长度。','Record the routing and retain the required cable length. The original input/output wires have no MC4 ends.')
    ],check:bi('照片和线号能一一对应，四根电源线的用途与极性明确。','Photos and labels identify all four power wires, their functions and polarity.'),viewNote:bi('仍显示旧MPPT参照，不模拟未确认的原车接线细节。','The old MPPT remains a reference; unverified original wiring details are not simulated.'),parts:[]},
    {title:bi('拆线并取下旧MPPT','Disconnect and remove the old MPPT'),text:bi('确认隔离有效后，再拆除本次要替换的旧设备。','Remove only the MPPT being replaced after confirming that isolation is still effective.'),actions:[
      bi('按旧设备说明逐根拆下已标记的电源线与通讯线；各线端分别绝缘保护，不让裸端碰到机壳或其他导线。','Disconnect the labelled power and communication leads in accordance with the old device instructions. Insulate each loose end separately and keep it clear of metalwork and other conductors.'),
      bi('托住旧MPPT，再松开其固定螺丝并取下；原螺丝收集保管，供现场检查后决定是否复用。','Support the old MPPT, undo its fixing screws and remove it. Keep the screws for inspection and possible reuse.'),
      bi('检查背板、旧孔及线缆是否损伤，清理安装面；相邻设备与线路保持原位。','Inspect the backboard, holes and cables for damage and clean the mounting surface. Leave adjacent equipment and wiring in place.')
    ],check:bi('旧MPPT已移走，线端已分别保护，安装面和可复用紧固件已检查。','The old MPPT is removed, individual wire ends are protected and the surface and reusable fasteners are checked.'),viewNote:bi('画面仅保留旧设备静态位置参照；不作为拆卸轨迹或开关操作演示。','The static old-device view identifies the location; it does not demonstrate a removal path or switch operation.'),parts:[]},
    {title:bi('核对转换板和安装孔','Check the adapter and mounting holes'),text:bi('先试对孔，再决定复用原孔或在新位置打孔。','Check alignment before reusing existing holes or drilling at the new location.'),actions:[
      bi('核对196×150×4 mm转换板及安装方向，区分背板固定孔与恒流板M4螺纹孔。','Check the 196×150×4 mm adapter and its orientation. Distinguish backboard fixing holes from the module’s M4 threaded holes.'),
      bi('右侧两块预计能复用原孔，仍需现场试对。左侧新位置统一使用转换板，按转换板标记电池仓背板新孔。','The two right-hand adapters are expected to reuse the original holes; verify on site. Use an adapter at the new left-hand position and mark its holes on the battery-bay backboard.'),
      bi('打孔前确认背板基层、厚度及孔后没有线缆或其他设备；钻孔规格与深度由现场按基层确定，清除切屑。','Before drilling, check the substrate, thickness and clearance behind it for cables or equipment. Select drill size and depth for the actual substrate and remove swarf.')
    ],check:bi('四处固定点适配且不损伤背后物件；网页布局不作为实车钻孔坐标。','All four fixing locations are suitable and clear behind the surface. Web-scene positions are not drilling coordinates.'),parts:['adapter','wall-screws']},
    {title:bi('将转换板固定到背板','Fix the adapter to the backboard'),text:bi('转换板现场安装，螺丝直接进入背板，背面不加螺母。','Install the adapter on site with screws directly into the backboard and no rear nuts.'),actions:[
      bi('检查原螺丝是否完好且适合基层；可复用原件，也可选用已备M5×8，具体长度与咬合由现场确认。','Check whether the original screws are sound and suitable for the substrate. Reuse them or select the prepared M5×8 screws after checking length and engagement.'),
      bi('对准四处孔位，先使各螺丝正确入位，再均匀紧固。若旧孔松脱或基层损坏，先修复，不能勉强锁紧。','Align all four locations, start each screw correctly and tighten evenly. Repair loose holes or damaged substrate before fixing the plate.'),
      bi('垫圈按已备方案及实际螺丝头确认使用；不自行增加背面螺母或隔柱。','Use washers only as required by the prepared hardware and actual screw heads. Do not add rear nuts or spacers.')
    ],check:bi('转换板贴合、无晃动，四处固定可靠，未损伤背板。','The adapter sits correctly without movement; all four fixings are secure and the backboard is undamaged.'),parts:['adapter','wall-screws']},
    {title:bi('安装完整恒流板','Mount the complete module'),text:bi('恒流板已整机预装，现场保持壳体封闭。','The module arrives preassembled and remains closed on site.'),actions:[
      bi('核对板号和方向：右侧IN接光伏，左侧OUT接MG充电侧，上方为RS485接口。','Check the board number and orientation: right-hand IN from PV, left-hand OUT to the MG charging side, and RS485 at the top.'),
      bi('托住整机，将四个安装耳对准转换板M4螺纹孔，使用4颗M4×6固定。','Support the module, align its four mounting ears with the adapter’s M4 threaded holes and secure it with four M4×6 screws.'),
      bi('核对螺钉啮合与背面突出量；不拆盖板、内部接线或已预装的MC4面板座。','Check screw engagement and rear projection. Leave the enclosure cover, internal wiring and preinstalled MC4 panel sockets intact.')
    ],check:bi('整机固定稳固，IN/OUT方向正确，插头和工具操作空间足够。','The module is secure, IN/OUT orientation is correct and connector/tool access is clear.'),parts:['module','module-screws']},
    {title:bi('给原车线制作EVO2线端','Fit EVO2 ends to the original wires'),text:bi('原车四根电源线没有MC4，需要现场制端；继续保持断电。','The four original power wires need MC4 termination on site. Keep the system isolated.'),actions:[
      bi('核对Stäubli EVO2实际料号、线缆规格/外径、密封件及批准工具，并确认与预装面板座配对；不得混接其他制造商。','Match the actual Stäubli EVO2 part, cable size/diameter, seal and approved tools to the mating socket; do not mix manufacturers.'),
      bi('按对应说明书将所需壳体零件套入线缆，按规定长度剥线，再用指定模具压接相应金属接触件。','Follow the applicable instructions to place the required housing parts on the cable, strip to the specified length and crimp the correct contact with the specified die.'),
      bi('检查压接质量，将接触件装入壳体并确认到位，再按对应规格锁紧尾部密封；完成装配检查。','Inspect the crimp, insert and check the contact seating, tighten the cable gland to the applicable specification and perform the assembly check.')
    ],check:bi('四个线端与线号对应、无散丝或损伤；剥线/压接/扭矩按实物说明书，不套用默认数值。','All four ends match their wire labels and are free of stray strands or damage. Use the actual product instructions for stripping, crimping and torque.'),parts:['mc4']},
    {title:bi('连接电源线与通讯线','Connect power and communication leads'),text:bi('保持断电，逐一核对后连接，避免把IN与OUT或正负极接反。','Keep isolation in place and check each connection to prevent reversed polarity or swapped IN/OUT.'),actions:[
      bi('将光伏两根线对应IN＋/−，MG充电侧两根线对应OUT＋/−；核验线号和极性，不凭插头外壳性别判断。','Match the PV pair to IN +/− and the MG charging pair to OUT +/−. Verify labels and polarity rather than inferring them from connector housing gender.'),
      bi('清洁检查后对插EVO2并确认锁止，避免拉扯线缆；不得带电制作或带负载插拔。','Inspect for cleanliness, mate the EVO2 ends and check locking without straining the cables. Do not terminate live cables or mate/disconnect under load.'),
      bi('将配套RS485线端接入顶部防水接口，另一端按已确认的CM5通道表对应连接；针序、屏蔽收口仍未明确的项目先核对，不自行并接蓝线与屏蔽网。','Connect the matching RS485 lead to the top waterproof socket and follow the confirmed CM5 channel map at the other end. Resolve any unconfirmed pinout or shield termination; do not assume the blue core and braid should be bonded.')
    ],check:bi('四个电源接头均对应且锁止，通讯板号/通道一致，未确认的针序和屏蔽项有明确处理依据。','All four power connectors are correctly assigned and locked; communication channels match and unresolved pinout/shield items have an approved resolution.'),parts:['mc4','module']},
    {title:bi('整理线束并按需安装固定座','Route and retain the cables as needed'),text:bi('板外线束按现场需要固定，板内固定座已预装。','Retain external cable runs as needed on site. Internal mounts are already installed.'),actions:[
      bi('板外按现场走线需要布置HC-1（STM-1）固定座，15×10×7 mm；数量与位置由现场确定。','Place HC-1 (STM-1) mounts, 15×10×7 mm, outside the modules as required by the actual routing. Determine quantity and positions on site.'),
      bi('使用已备M3×12螺钉直接固定到背板，无背面固定件；先确认螺钉适合实际基层及有效咬合长度。','Use the prepared M3×12 screws directly into the backboard without rear hardware, after confirming substrate suitability and engagement.'),
      bi('扎带固定在线缆段，给接头留直线段和应力释放；不捆接头壳体，不夹伤外皮、不牵拉端子，也不阻挡散热。','Retain the cable runs with ties, leaving straight, strain-relieved connector leads. Do not tie connector bodies, crush insulation, pull terminals or obstruct cooling.')
    ],check:bi('线束有支撑且不受拉扯，接头可维护；板内固定座保持预装，不重复拆装。','Cables are supported without strain and connectors remain accessible. Internal mounts remain preinstalled.'),parts:[]},
    {title:bi('复核、恢复供电并记录','Inspect, restore power and record results'),text:bi('先完成断电状态检查，再按确认后的上电程序进行调试。','Complete de-energized checks before commissioning under a confirmed power-up procedure.'),actions:[
      bi('复核全部固定螺丝、极性、IN/OUT、接头锁止、绝缘与通讯映射；清除工具和切屑，安装防护件并确认无人操作。','Check fixings, polarity, IN/OUT, connector locking, insulation and communication mapping. Remove tools and swarf, refit protection and ensure no one is working on the circuit.'),
      bi('新恒流板的输入、输出及辅助电源先后顺序尚未有厂家确认资料；由现场电气人员取得并核对后，再解除隔离、按程序逐路送电，不能直接套用旧MPPT顺序。','Manufacturer confirmation of the new board’s input, output and auxiliary-supply sequence is still required. Obtain and verify it before releasing isolation and energizing circuit by circuit; do not reuse the old MPPT sequence by assumption.'),
      bi('按已确认调试方案检查各板电压/电流、CM5对应通道及GX显示，观察接头和壳体是否异常；发现异味、异常发热或故障立即停止并安全隔离。拍照、记录线号、读数和遗留问题。','Follow the agreed commissioning plan to check each board’s voltage/current, CM5 channel and GX display. Stop and safely isolate on abnormal heat, odour or faults. Record photos, wire IDs, readings and outstanding issues.')
    ],check:bi('厂家上电程序和所有关键接线已确认，逐路功能检查完成且无异常，记录齐全后交付。','Handover follows confirmation of the manufacturer’s power-up procedure and all critical wiring, successful circuit checks and complete records.'),parts:['wall-screws','module-screws','mc4']}
  ]
};


export const assemblyBoards=[
  {id:'constant-aiko',number:1,channel:'CH0',location:bi('右上','Upper right'),shortLabel:bi('1 · 右上','1 · Upper right')},
  {id:'constant-ja',number:2,channel:'CH1',location:bi('右下','Lower right'),shortLabel:bi('2 · 右下','2 · Lower right')},
  {id:'constant-jk',number:3,channel:'CH2',location:bi('左下','Lower left'),shortLabel:bi('3 · 左下','3 · Lower left')}
];

export const assemblyTargets=[...assemblyBoards,{id:'comm-backplate',shortLabel:bi('通讯集成板','Comms panel')},{id:'gx-touch50',shortLabel:bi('GX屏幕安装','GX screen installation')}];

export function getAssemblyGuide(boardId='constant-aiko'){
  if(boardId==='comm-backplate')return communicationGuide;
  if(boardId==='gx-touch50')return gxGuide;
  const board=assemblyBoards.find(item=>item.id===boardId)||assemblyBoards[0];
  const left=board.id==='constant-jk';
  const title=bi(`恒流板 ${board.number} · ${board.location.zh}`,`Board ${board.number} · ${board.location.en}`);
  const mounting=left
    ?bi('左侧新位置：统一使用转换板，在电池仓背板新打孔。螺丝直接进入背板，无背面螺母。','New left-hand location: retain the adapter and drill new holes in the battery-bay backboard. Screws engage directly, without rear nuts.')
    :bi('右侧位置：预计复用原MPPT固定孔，现场试对后确认；统一使用转换板。','Right-hand location: the original MPPT holes are expected to align; verify on site. Retain the adapter plate.');
  const communication=bi(`恒流板 ${board.number} → CM5 原生 RS485 ${board.channel}`,`Board ${board.number} → CM5 native RS485 ${board.channel}`);
  const parts=sharedAssemblyGuide.parts.map(part=>({...part,...(part.id==='adapter'?{note:mounting}:{})}));
  const steps=sharedAssemblyGuide.steps.map(step=>({...step,actions:[...step.actions]}));
  steps[1].actions[0]=bi(`拍下原车第 ${board.number} 路MPPT全景、输入输出端子及原螺丝安装位置，核对它对应的组件和线号。`,`Photograph original MPPT circuit ${board.number}, its input/output terminals and fixing points; confirm the associated PV module and wire labels.`);
  if(left){
    steps[3].text=bi('本板移到左下新位置，仍统一使用转换板；需在电池仓背板新打孔。','This board moves to the new lower-left position and still uses an adapter. Drill new holes in the battery-bay backboard.');
    steps[3].actions[1]=bi('按已确认左下位置试放转换板，核对与上方Orion、右侧恒流板2及线缆的空间，再用实物转换板标记背板新孔；不沿用右侧复孔说明。','Trial-position the adapter at the confirmed lower-left location. Check clearance to the Orion above, board 2 to the right and all cables; mark new backboard holes using the actual adapter. The right-hand hole-reuse instruction does not apply.');
  }else{
    steps[3].text=bi('本板位于右侧，预计转换板能对上原MPPT孔位；必须现场试对确认。','This right-hand adapter is expected to align with the original MPPT holes. Confirm by trial fitting on the vehicle.');
    steps[3].actions[1]=bi(`将恒流板 ${board.number} 的转换板与原MPPT固定孔试对；只有孔位、基层及螺丝咬合均合适才复用。若不能对上，先确认修正方案再施工。`,`Trial-fit board ${board.number}'s adapter against the original MPPT holes. Reuse them only if alignment, substrate and screw engagement are suitable. Resolve any mismatch before installation.`);
    steps[3].actions[2]=bi('检查旧孔及背板基层、厚度和孔后空间；若现场确认需要补孔，先避开背后的线缆或设备，再按实际基层确定钻孔规格、深度并清除切屑。','Inspect existing holes, substrate, thickness and rear clearance. If additional drilling is confirmed on site, avoid concealed cables or equipment, select the size and depth for the actual substrate and remove swarf.');
  }
  steps[5].actions[0]=bi(`核对本机为恒流板 ${board.number}（${board.location.zh}）：右侧IN接光伏，左侧OUT接MG充电侧，上方为RS485接口。`,`Confirm board ${board.number} (${board.location.en.toLowerCase()}): right-hand IN from PV, left-hand OUT to the MG charging side and RS485 at the top.`);
  steps[7].actions[2]=bi(`将配套RS485线端接入顶部防水接口，另一端接CM5原生${board.channel}：红→R/A（A+），黑→T/B（B−），蓝→GND。防水端针序及屏蔽收口仍须按已确认资料核对，不自行并接蓝线与屏蔽网。`,`Connect the matching RS485 lead to the top waterproof socket and the other end to CM5 native ${board.channel}: red → R/A (A+), black → T/B (B−), blue → GND. Verify the waterproof pinout and shield termination against approved information; do not assume that blue and braid should be bonded.`);
  steps[7].check=bi(`四个电源接头均对应且锁止；恒流板 ${board.number} 与CM5 ${board.channel} 一致，针序及屏蔽处理有明确依据。`,`All four power connectors are correctly assigned and locked; board ${board.number} matches CM5 ${board.channel}, with an approved pinout and shield termination.`);
  steps[9].actions[2]=bi(`按已确认调试方案检查恒流板 ${board.number} 的电压/电流、CM5 ${board.channel} 及GX显示，核对实际组件与板号对应。发现异味、异常发热或故障立即停止并安全隔离；拍照、记录线号、读数和遗留问题。`,`Follow the agreed commissioning plan to check board ${board.number}'s voltage/current, CM5 ${board.channel} and GX display, including the actual PV-to-board assignment. Stop and safely isolate on abnormal heat, odour or faults; record photos, wire IDs, readings and outstanding issues.`);
  return {...sharedAssemblyGuide,boardId:board.id,boardContext:{...board,title,mounting,communication},parts,steps};
}

// Compatibility export for existing consumers; all UI selections use getAssemblyGuide.
export const assemblyGuideData=getAssemblyGuide();
