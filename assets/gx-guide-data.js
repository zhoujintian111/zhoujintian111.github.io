// GX Touch 50: the confirmed front-wall position and concealed route are fixed.
// Dimensions below identify the supplied template, not a vehicle drilling release.
const bi=(zh,en)=>({zh,en});
const groups={prepare:bi('准备与定位','Preparation and position'),mount:bi('走线与固定','Routing and mounting'),connect:bi('磁环与连接','Ferrites and connections'),finish:bi('复核与显示检查','Inspection and display check')};
const part=(id,index,name,spec,quantity,purpose,note)=>({id,index,name:bi(...name),spec:bi(...spec),quantity:bi(...quantity),purpose:bi(...purpose),note:bi(...note)});
const step=(id,phase,focusId,title,text,actions,check,parts,viewNote)=>({id,phase,group:groups[phase],focusId,title:bi(...title),text:bi(...text),actions:actions.map(item=>bi(...item)),check:bi(...check),parts,...(viewNote?{viewNote:bi(...viewNote)}:{})});

export const gxGuide={
  boardId:'gx-touch50',
  boardContext:{
    title:bi('GX Touch 50 · 现场安装','GX Touch 50 · site installation'),
    mounting:bi('电视右侧、同一正面白墙，屏幕中心距车内完成地板1450 mm。使用随附固定框从正面固定；基层材质、厚度及螺钉适配现场核实。','Right of the TV on the same front white wall, with the display centre 1450 mm above the finished cabin floor. Use the supplied frame from the front; verify the substrate, thickness and suitable fixings on site.'),
    communication:bi('电池仓 → 可掀装饰画面后 → 电视后 → 向右到屏幕。原厂组合线回接Cerbo GX MK2；HDMI负责显示，USB供电。','Battery bay → behind the liftable graphic cover → behind the TV → right to the display. The factory combined lead connects to Cerbo GX MK2; HDMI carries video and USB supplies power.')
  },
  parts:[
    part('display','G01',['GX Touch 50屏幕','GX Touch 50 display'],['标准版 BPP900455050','Standard BPP900455050'],['1 台','1 display'],['安装在已确认的电视右侧白墙，中心高度1450 mm。','Mount at the confirmed location right of the TV, with its centre at 1450 mm.'],['屏幕与电视处于同一正面墙，不移到侧墙或电池仓内。外形与后部出线按随货实物核对。','Keep it on the same front wall as the TV, not the side wall or inside the battery bay. Check the actual housing and rear cable exit.']),
    part('frame','G02',['随附正面固定框','Supplied front mounting frame'],['使用模板①孔位','Use template hole set ①'],['1 个','1 frame'],['从可操作的正面固定，再安装屏幕。','Fasten from the accessible front, then fit the display.'],['沿用随附薄固定框，不另加选配壁挂支架。本方案不使用需从墙后操作的螺杆、蝶形螺母安装法。','Retain the supplied slim frame without adding the optional wall bracket. This method does not use threaded rods and wing nuts requiring rear access.']),
    part('frame-screws','G03',['固定框螺钉','Frame screws'],['模板①：110.2 × 69.2 mm孔距','Template ①: 110.2 × 69.2 mm pitch'],['4 处','4 locations'],['将固定框固定到经核实能够承载的墙面基层。','Fix the frame to a verified supporting substrate.'],['白墙可能为木质，厚度尚未核实。螺钉类型、长度和引孔按实际基层选择；附件中的螺钉不能直接视为已适配。','The wall may be timber; thickness is unverified. Select screw type, length and pilot holes for the actual substrate; supplied screws are not automatically suitable.']),
    part('display-cable','G04',['原厂屏幕组合线','Factory display lead'],['屏幕端固定出线；Cerbo端HDMI + USB','Fixed display end; HDMI + USB at Cerbo'],['随屏幕 1 套','1 lead supplied with display'],['沿已确认的遮蔽路径连接电池仓内Cerbo。','Connect to the Cerbo in the battery bay along the confirmed concealed route.'],['先用整条实线试铺，计入转弯与维护余量。网页路线不证明长度足够；不拉紧、剪接或默认加延长线。','Trial-route the complete lead with bends and service slack. The scene does not prove sufficient length; do not stretch, splice or assume an extension.']),
    part('ferrite-gx','G05',['屏幕侧卡扣磁环','Display-side snap-on ferrite'],['随附磁环，两只中的第一只','First of the two supplied ferrites'],['1 只','1 ferrite'],['夹在HDMI线缆上，尽量靠近GX Touch本体。','Clip around the HDMI cable as close as practicable to the GX Touch body.'],['依据最新配件照片中的原厂说明。预先检查屏幕后容纳空间，不能让磁环顶住屏幕或压在固定框下。','Per the factory slip in the updated accessory photo. Check rear clearance; do not trap it against the display or under the frame.']),
    part('ferrite-hdmi','G06',['HDMI插头侧卡扣磁环','HDMI-plug-side snap-on ferrite'],['随附磁环，两只中的第二只','Second of the two supplied ferrites'],['1 只','1 ferrite'],['夹在HDMI线缆上，尽量靠近HDMI插头。','Clip around the HDMI cable as close as practicable to its HDMI plug.'],['安装在HDMI线段，不误夹到USB分支；保留插头操作空间，两半扣合完整。','Fit on the HDMI lead, not the USB branch. Leave plug access and close both halves fully.']),
    part('hdmi-plug','G07',['HDMI插头','HDMI plug'],['原厂组合线的显示端','Video connector of the factory lead'],['线缆自带 1 个','1 integral connector'],['接Cerbo GX MK2的HDMI插口。','Connect to the Cerbo GX MK2 HDMI socket.'],['连接前拔下Cerbo Power In，核对方向后握住插头壳体插入。','Unplug Cerbo Power In before connection; check orientation and hold the connector body.']),
    part('usb-plug','G08',['USB插头','USB plug'],['原厂组合线的供电端','Power connector of the factory lead'],['线缆自带 1 个','1 integral connector'],['接Cerbo GX MK2的USB插口，为屏幕供电。','Connect to a Cerbo GX MK2 USB socket to power the display.'],['在HDMI连接完成后插入USB；整个过程保持Cerbo电源断开。','Insert USB after HDMI, keeping Cerbo power disconnected throughout.']),
    part('cover','G09',['可掀装饰画面','Liftable graphic cover'],['原车覆盖层；不是新配件','Existing cover; not a new component'],['原车已有','Already in the vehicle'],['布线时掀起，完成后恢复，遮住电池仓向电视后上行的线缆。','Lift for routing, then restore to conceal the cable running upwards from the battery bay behind the TV.'],['按用户实车照片处理为可掀覆盖层，不把它当作需要撕除的薄粘贴墙纸。恢复后检查无透线、鼓包和夹线。','Treat it as the liftable layer shown in the vehicle photo, not thin adhesive wallpaper to peel off. Check for visible cable outlines, bulges and pinching after restoration.'])
  ],
  steps:[
    step('isolate-cerbo','prepare','display',['先断开Cerbo电源','Disconnect Cerbo power first'],['安装屏幕和插接显示线前，先完成断电。','Disconnect power before mounting or connecting the display.'],[
      ['按现场程序停止相关设备，拔下Cerbo的两针Power In插头，防止意外恢复。','Stop affected equipment under the site procedure and unplug the Cerbo two-pin Power In connector; prevent reconnection.'],
      ['记录并保留已有网络和能源通讯线号；不因安装屏幕拆改其他已确认线路。','Record and retain existing network and energy-communication labels; preserve the confirmed connections.'],
      ['如需掀开电池仓，按现场隔离程序确认操作区安全，保护屏幕正面及随货线缆。','If opening the battery bay, verify safe access under the site isolation procedure and protect the display face and lead.']
    ],['Power In已拔下，安装和接线区域可以安全操作。','Power In is unplugged and mounting and wiring areas are safe to access.'],['display','hdmi-plug','usb-plug']),
    step('check-kit','prepare','display',['辨认屏幕、固定件和两只磁环','Identify the display, fixings and two ferrites'],['以更新后的配件照片及随货实物为准。','Use the updated accessory photo and the actual supplied kit.'],[
      ['清点标准GX Touch 50、随附固定框、组合线、固定螺钉、纸模板及两只卡扣磁环。','Check the standard GX Touch 50, supplied frame, combined lead, fixing screws, paper template and two snap-on ferrites.'],
      ['分开正面固定框用螺钉与另一种安装法的螺杆、蝶形螺母；本次只使用正面可操作的固定方式。','Separate frame screws from the threaded rods and wing nuts for the alternative method; this installation uses front-access fixing.'],
      ['辨认HDMI和USB分支，检查护套、插头及磁环扣合面完整。','Identify HDMI and USB branches; inspect cable jackets, connectors and ferrite mating faces.']
    ],['两只磁环齐全，安装法与对应固定件没有混用。','Both ferrites are present and hardware for different mounting methods is kept separate.'],['display','frame','frame-screws','display-cable','ferrite-gx','ferrite-hdmi']),
    step('confirm-position-route','prepare','cover',['确认1450 mm位置与遮蔽路径','Confirm the 1450 mm position and concealed route'],['先核对屏幕位置，再用实线确认整条路线。','Verify the display position, then trial-route the actual lead.'],[
      ['在电视右侧同一正面白墙标记屏幕中心：距车内完成地板1450 mm；核对电视、门边及操作空间。','Mark the centre 1450 mm above the finished cabin floor on the same front white wall, right of the TV; check TV, door-edge and operating clearance.'],
      ['从FIND YOUR POWER下方电池仓掀起可掀装饰画面，核对向上到电视后、再向右到GX屏幕的通路。','Lift the graphic cover above the battery bay beneath FIND YOUR POWER; inspect the route upwards behind the TV, then right to the GX display.'],
      ['试铺原厂线，计入端部余量、弯曲和磁环空间；长度或通道不足时先处理，不拉线凑长度。','Trial-route the factory lead, allowing end slack, bends and ferrite clearance. Resolve insufficient length or access before continuing.']
    ],['位置和路径均一致；整条原厂线无需受拉即可连接两端。','The position and route match the plan and the factory lead reaches both ends without strain.'],['display','display-cable','cover'],['画面示意走线关系；长度、遮蔽间隙与施工通道必须用实车核实。','The scene explains the route; verify length, concealment clearance and installation access in the vehicle.']),
    step('prepare-front-mount','mount','frame',['核对正面固定模板与后部空间','Check the front-mount template and rear clearance'],['墙后无法操作，先确认从正面可完成固定和出线。','Rear access is unavailable; verify front fixing and cable clearance before preparing the wall.'],[
      ['确认基层材质、厚度、承载及隐藏线路；用随货实物和纸模板核对①组四孔，孔距110.2×69.2 mm。','Verify substrate, thickness, support and concealed services; match the supplied parts to template hole set ① at 110.2×69.2 mm pitch.'],
      ['核对屏幕后固定出线、弯曲和磁环容纳空间，以及与电视后走线的连通方式。','Check space for the fixed rear lead, its bend and the ferrite, plus access to the route behind the TV.'],
      ['随货模板的3×Ø32重叠开口仅作产品参考；现场确认结构后才决定所需开口与引孔，不照动画盲钻。','The supplied template’s three overlapping Ø32 openings are a product reference only. Confirm the wall structure before choosing openings and pilot holes; never drill from the animation alone.']
    ],['基层、固定件和出线路径均适配；未核实的厚度、螺钉长度或孔位不直接施工。','Substrate, fixings and cable passage are suitable; do not proceed with unverified thickness, screw length or drilling locations.'],['frame','frame-screws','display-cable','ferrite-gx']),
    step('route-display-cable','mount','display-cable',['沿装饰画面后和电视后布线','Route behind the graphic cover and TV'],['保持覆盖层掀起，按已确认路径安装整条线。','Keep the cover lifted while routing the complete lead.'],[
      ['保护HDMI/USB插头，按实际通道从屏幕位置把自由端引向电视后，再向下送至电池仓Cerbo位置。','Protect the HDMI/USB plugs and guide the free ends from the display position behind the TV, then down to the battery-bay Cerbo.'],
      ['线缆落在有间隙的遮蔽位置，避开覆盖层贴面、电视支架活动部位及尖锐边缘。','Place the lead in available concealed clearance, away from the cover face, moving TV-bracket parts and sharp edges.'],
      ['在需要处保护边缘并支撑线缆，给两端留插拔余量；固定座依现场需要配置，仅按右侧说明安装。','Protect edges and support the cable where needed, leaving service slack at each end. Provide site-selected cable mounts using the written guidance.']
    ],['路径为电池仓—覆盖层后—电视后—GX；线缆不撑起覆盖层、不被夹压。','The route is battery bay—behind cover—behind TV—GX, without lifting the cover face or pinching the lead.'],['display-cable','cover']),
    step('fix-frame','mount','frame-screws',['从正面固定随附框','Fasten the supplied frame from the front'],['固定到已核实的基层，先调平再逐点紧固。','Fix to the verified substrate, level first, then tighten each location.'],[
      ['用模板①组四孔对准固定框，确认上下方向和线缆出口。','Align the frame using template hole set ①, checking orientation and the cable exit.'],
      ['装入四处已确认适配的螺钉，先轻带，再均匀紧固；不增加墙后螺母。','Start four verified suitable screws lightly, then tighten evenly; do not add rear-wall nuts.'],
      ['检查框体不变形、安装面平整，出线和磁环空间未被螺钉占用。','Check that the frame is undistorted and sits flat, with screws clear of the lead and ferrite space.']
    ],['四处固定可靠，框体平整，屏幕后仍有足够出线空间。','All four fixings are secure, the frame is flat and rear cable clearance remains available.'],['frame','frame-screws','display-cable']),
    step('fit-gx-ferrite','mount','ferrite-gx',['扣上靠近屏幕的一只磁环','Fit the ferrite nearest the display'],['先装屏幕侧磁环，再安放屏幕，便于检查。','Fit the display-side ferrite before seating the display so it remains accessible.'],[
      ['打开第一只随附磁环，选择HDMI线缆上尽量靠近GX本体且不会挤压的位置。','Open the first supplied ferrite and choose a strain-free position on the HDMI cable as close to the GX body as practicable.'],
      ['将线缆放入槽内，对合两半并扣紧，确认护套没有夹入接缝。','Place the cable in the channel, align and close both halves, keeping the jacket out of the seam.'],
      ['试放屏幕，检查磁环不会顶墙、顶框或迫使线缆急弯。','Trial-position the display and check that the ferrite does not foul the wall or frame or force a sharp bend.']
    ],['第一只磁环已闭合，靠近屏幕且有实际容纳空间。','The first ferrite is fully closed, close to the display and fits the available space.'],['ferrite-gx','display-cable','display']),
    step('seat-display','mount','display',['安装屏幕并检查固定','Fit the display and check retention'],['保持中心1450 mm及原先确定的电视右侧位置。','Keep the confirmed position right of the TV and centre height of 1450 mm.'],[
      ['收好后部出线和磁环，给屏幕靠近固定框留出余量，不夹在接合面。','Arrange the rear lead and ferrite with enough slack to approach the frame; keep them clear of mating surfaces.'],
      ['按随货固定框实际扣合结构安装屏幕，不压屏幕玻璃、不靠线缆承重。','Fit the display using the supplied frame’s actual retaining structure; do not press on the glass or support its weight by the lead.'],
      ['检查四周平整及保持状态，核对水平、中心高度和与电视的相对位置。','Check seating and retention around the edge, then verify level, centre height and position relative to the TV.']
    ],['屏幕牢固、平整，线缆和磁环没有被压住。','The display is secure and flat, with the cable and ferrite free from compression.'],['display','frame','ferrite-gx','display-cable']),
    step('fit-hdmi-ferrite','connect','ferrite-hdmi',['扣上靠近HDMI插头的一只磁环','Fit the ferrite nearest the HDMI plug'],['第二只装在电池仓内的HDMI线段。','Fit the second ferrite on the HDMI lead in the battery bay.'],[
      ['确认HDMI分支，在尽量靠近HDMI插头的位置打开并放入第二只磁环。','Identify the HDMI branch and place the second open ferrite as close to its plug as practicable.'],
      ['对合扣紧，保留插头插拔与弯曲空间，不夹到USB分支。','Close it fully while retaining plug and bend clearance; do not fit it on the USB branch.'],
      ['复核两只位置：一只靠GX本体，一只靠HDMI插头。','Verify both locations: one near the GX body and one near the HDMI plug.']
    ],['第二只磁环完整闭合，HDMI插头可以无受力地就位。','The second ferrite is fully closed and the HDMI plug can be seated without strain.'],['ferrite-hdmi','hdmi-plug','display-cable']),
    step('connect-display','connect','hdmi-plug',['先接HDMI，再接USB','Connect HDMI, then USB'],['再次确认Cerbo Power In仍拔下。','Verify once more that Cerbo Power In is still unplugged.'],[
      ['先把HDMI插头对准Cerbo的HDMI插口，握住壳体完整插入，不接电视HDMI口。','First align and fully insert HDMI into the Cerbo HDMI socket, holding the shell; do not connect it to the TV.'],
      ['再把USB插头接到Cerbo GX MK2可用USB口，检查两端就位。','Then insert USB into an available Cerbo GX MK2 USB port and check both connections.'],
      ['整理分支和第二只磁环，插头不受拉力，也不挡住相邻端口。','Arrange the branches and second ferrite so plugs are strain-free and adjacent ports remain accessible.']
    ],['两根插头均连接Cerbo：HDMI用于显示，USB用于供电；电源仍未恢复。','Both plugs connect to Cerbo: HDMI for video and USB for power; power remains disconnected.'],['hdmi-plug','usb-plug','ferrite-hdmi']),
    step('inspect-restore-cover','finish','cover',['逐项复核并恢复装饰画面','Inspect and restore the graphic cover'],['先看清线缆，再恢复正常外观。','Inspect the exposed route before restoring the normal appearance.'],[
      ['复核屏幕四处固定、两只磁环、两只插头，以及全线护套、边缘保护和维护余量。','Check the four frame fixings, both ferrites, both plugs, cable jacket, edge protection and service slack.'],
      ['拍照记录隐藏路线，按原有方式放回可掀装饰画面，避免夹住线缆。','Photograph the concealed route, then restore the liftable cover using its existing arrangement without trapping the cable.'],
      ['从车内正常视角检查：覆盖层不鼓包、不透出线缆轮廓，电视后与屏幕周围无多余露线。','Inspect from normal cabin viewpoints: no cover bulges or cable outlines, and no unnecessary exposed cable around the TV or display.']
    ],['外观恢复、线路可维护；正常状态下走线被覆盖层与电视遮蔽。','Appearance is restored and the cable remains serviceable; the cover and TV conceal the route in normal use.'],['display','frame-screws','display-cable','ferrite-gx','ferrite-hdmi','cover']),
    step('power-check','finish','display',['满足条件后恢复供电并检查','Restore power only after checks pass'],['上电前，屏幕及通讯板相关安装检查必须全部完成。','Complete the display and relevant communication-plate checks before energizing.'],[
      ['确认固定、接线及相关系统检查通过，由现场负责人按确认程序恢复Cerbo的Power In。','After mounting, wiring and relevant system checks pass, the responsible installer reconnects Cerbo Power In under the approved procedure.'],
      ['等待启动，检查屏幕显示、触摸点选与滑动；核对亮度和站立位置的可读性。','Allow startup, then check the image, touch selection and scrolling; verify brightness and readability from the viewing position.'],
      ['如有黑屏、闪屏或触摸异常，先安全断电再检查插接；记录安装照片与测试结果。','If the image is absent, unstable or touch fails, safely disconnect power before inspecting connections; record photos and results.']
    ],['画面和触摸正常、线缆无受力及遗漏问题后交付；模型动画不替代现场通电检查。','Handover follows correct display and touch operation, strain-free wiring and resolution of open items; the animation does not replace a live site check.'],['display','hdmi-plug','usb-plug'])
  ],
  sources:[
    {label:bi('Victron：GX Touch安装与连接','Victron: GX Touch mounting and connection'),url:'https://www.victronenergy.com/media/pg/Cerbo_GX/en/installation.html',note:bi('标准版随附固定框、Cerbo断电及HDMI/USB连接顺序。模板①和两只磁环的位置另据用户最新配件照片中的原厂纸张核对。','Supplied standard-model frame, Cerbo power isolation and HDMI/USB connection sequence. Template ① and the two ferrite positions were also checked against the factory papers in the updated accessory photo.'),parts:['display','frame','hdmi-plug','usb-plug'],steps:[0,3,5,9,11]},
    {label:bi('Victron：GX Touch 50钻孔模板','Victron: GX Touch 50 drilling template'),url:'https://www.victronenergy.com/upload/documents/Drilling-jig-GX-Touch-50.pdf',note:bi('本方案采用①组固定框孔位，孔距110.2×69.2 mm；与②组螺杆/蝶形螺母孔位区分。模板不能替代实车基层和隐藏结构核实。','This design uses frame hole set ① at 110.2×69.2 mm pitch, distinct from set ② for threaded rods and wing nuts. The template does not replace verification of the vehicle substrate and concealed structure.'),parts:['frame','frame-screws'],steps:[2,3,5]},
    {label:bi('Victron：GX Touch 50外形图','Victron: GX Touch 50 dimension drawing'),url:'https://www.victronenergy.com/upload/documents/GX-Touch-50.pdf',note:bi('标准版外形128.2×87.1×12.4 mm；现场还需为后部线缆、磁环及安装操作预留空间。','Standard-model envelope: 128.2×87.1×12.4 mm. Allow additional site clearance for the rear cable, ferrite and installation access.'),parts:['display','frame'],steps:[1]}
  ]
};
