/* Fictional sample dataset. No production hospital data or verified KPI/compliance results. */
window.IT_MOCK = {
  today:'2026-10-25',
  users:[
    {id:'u1',name:'นที วัฒนะ',short:'นท',role:'IT Lead',team:'IT Operations',color:'peach',workload:8,capacity:10},
    {id:'u2',name:'ปุณณภพ กุล',short:'ปก',role:'IT Staff',team:'Infrastructure',color:'violet',workload:7,capacity:9},
    {id:'u3',name:'มินตรา สุข',short:'มส',role:'IT Staff',team:'Application',color:'mint',workload:6,capacity:9},
    {id:'u4',name:'ธนกฤต พงษ์',short:'ธพ',role:'IT Staff',team:'Network',color:'rose',workload:8,capacity:10},
    {id:'u5',name:'ชลธิชา แสง',short:'ชส',role:'IT Staff',team:'Security',color:'blue',workload:5,capacity:8},
    {id:'u6',name:'อรทัย นาค',short:'อน',role:'System Admin',team:'Platform',color:'peach',workload:4,capacity:8}
  ],
  projects:[
    {id:'PRJ-01',name:'IT Portal & Work Management',code:'DIG-01',category:'Digital Platform',priority:'P1',status:'In Progress',progress:38,owner:'u3',members:['u1','u3','u6'],start:'2026-10-01',due:'2027-01-30',budget:'Internal',description:'พัฒนาศูนย์กลางบริหารงาน IT, โครงการ, KPI และหลักฐานการดำเนินงานด้วย Native PHP',objective:'เพิ่มความโปร่งใสในการติดตามและรายงานผลการดำเนินงาน',milestones:['MS-01','MS-02','MS-03']},
    {id:'PRJ-02',name:'Cybersecurity Baseline & MFA',code:'SEC-02',category:'Cybersecurity',priority:'P0',status:'At Risk',progress:52,owner:'u5',members:['u1','u5','u6'],start:'2026-10-01',due:'2027-03-31',budget:'Assessment',description:'ทบทวน privileged accounts, MFA, baseline logging และการจัดเก็บหลักฐานตามเกณฑ์ที่องค์กรใช้',objective:'ลดความเสี่ยงด้านการเข้าถึงระบบสำคัญ',milestones:['MS-04','MS-05']},
    {id:'PRJ-03',name:'Network Visibility & Segmentation',code:'NET-03',category:'Infrastructure',priority:'P1',status:'In Progress',progress:64,owner:'u4',members:['u1','u2','u4'],start:'2026-10-01',due:'2027-04-30',budget:'Internal',description:'จัดทำแผนผังเครือข่าย ตรวจสอบ VLAN และทบทวน Network Zone',objective:'เพิ่มความพร้อมใช้งานและลดความเสี่ยงจากการเคลื่อนย้ายภัยคุกคาม',milestones:['MS-06','MS-07']},
    {id:'PRJ-04',name:'Backup & Disaster Recovery',code:'OPS-04',category:'Business Continuity',priority:'P0',status:'In Progress',progress:47,owner:'u2',members:['u1','u2','u6'],start:'2026-10-01',due:'2027-06-30',budget:'Internal',description:'มาตรฐาน Backup Matrix, Restore Drill และหลักฐานการทดสอบกู้คืน',objective:'ลดเวลาฟื้นตัวของระบบงานสำคัญและเพิ่มความเชื่อถือของ Backup',milestones:['MS-08','MS-09']},
    {id:'PRJ-05',name:'AI Use Case Discovery',code:'AI-05',category:'AI & Innovation',priority:'P2',status:'Not Started',progress:12,owner:'u3',members:['u1','u3'],start:'2027-01-01',due:'2027-09-30',budget:'Proposal',description:'รวบรวม AI Use Case, ประเมิน Data Readiness และออกแบบ Pilot ที่ไม่เปิดเผยข้อมูลสุขภาพ',objective:'เพิ่มประสิทธิภาพการทำงานด้วย AI อย่างมีธรรมาภิบาล',milestones:['MS-10']}
  ],
  tasks:[
    {id:'IT-2401',title:'ตรวจสอบผลสำรองข้อมูล HIS และฐานข้อมูล',description:'ตรวจสอบ Backup Job, Retention และบันทึกหลักฐานประจำวัน',priority:'P0',status:'In Progress',owner:'u2',project:'PRJ-04',category:'Routine',due:'2026-10-25',progress:70,effort:2,tags:['Backup','HIS'],blocker:''},
    {id:'IT-2402',title:'ทวนรายชื่อบัญชี Privileged สำหรับเปิด MFA',description:'จัดทำรายชื่อผู้ดูแลและเจ้าของระบบ พร้อมเตรียมรายงานความพร้อม',priority:'P0',status:'Blocked',owner:'u5',project:'PRJ-02',category:'Project',due:'2026-10-24',progress:42,effort:5,tags:['MFA','Identity'],blocker:'รอข้อมูลรายชื่อบัญชีจากเจ้าของระบบ'},
    {id:'IT-2403',title:'ออกแบบหน้า My Work และ Team Board',description:'สร้างต้นแบบ UI แบบ Server-rendered พร้อมชุดข้อมูลทดสอบ',priority:'P1',status:'In Progress',owner:'u3',project:'PRJ-01',category:'Project',due:'2026-10-29',progress:55,effort:8,tags:['UX/UI','PHP'],blocker:''},
    {id:'IT-2404',title:'ปรับปรุง Network Diagram อาคารผู้ป่วยนอก',description:'ตรวจสอบรายการ Core Switch, VLAN และแนวทาง Segment',priority:'P1',status:'At Risk',owner:'u4',project:'PRJ-03',category:'Project',due:'2026-10-28',progress:61,effort:12,tags:['Network','Documentation'],blocker:'รอข้อมูล Switch Port จากหน้างาน'},
    {id:'IT-2405',title:'ทดสอบ Restore Drill ของ File Server',description:'บันทึกผลการกู้คืนจากชุดสำรองข้อมูลตัวอย่าง',priority:'P0',status:'At Risk',owner:'u2',project:'PRJ-04',category:'Project',due:'2026-10-22',progress:30,effort:4,tags:['BCP','Restore'],blocker:'รอช่วงเวลาทดสอบจากทีมระบบ'},
    {id:'IT-2406',title:'สรุป RBAC Matrix สำหรับ IT Portal',description:'กำหนด Staff, Lead, Admin และ Executive Viewer',priority:'P1',status:'Completed',owner:'u1',project:'PRJ-01',category:'Project',due:'2026-10-20',progress:100,effort:6,tags:['Security','RBAC'],blocker:''},
    {id:'IT-2407',title:'ตรวจสอบ Firewall Rule ที่หมดความจำเป็น',description:'ประเมิน Rule เก่าที่ไม่ใช้แล้วและทำรายการเสนอทบทวน',priority:'P1',status:'In Progress',owner:'u4',project:'PRJ-03',category:'Routine',due:'2026-10-30',progress:32,effort:3,tags:['FortiGate','Firewall'],blocker:''},
    {id:'IT-2408',title:'จัดทำแบบประเมิน KPI รอบเดือน',description:'เตรียมสูตร วิธีวัด และแนวทางแนบหลักฐาน',priority:'P1',status:'Not Started',owner:'u1',project:'PRJ-01',category:'Project',due:'2026-11-02',progress:0,effort:0,tags:['KPI','Report'],blocker:''},
    {id:'IT-2409',title:'รวบรวมรายการ VM และ Service Owner',description:'จัดทำ Inventory เบื้องต้นสำหรับระบบ Production',priority:'P2',status:'In Progress',owner:'u6',project:'PRJ-04',category:'Routine',due:'2026-10-31',progress:48,effort:5,tags:['VMware','Inventory'],blocker:''},
    {id:'IT-2410',title:'ตรวจสอบปัญหาเครื่องพิมพ์ห้องยา',description:'ตรวจสอบคิวพิมพ์และการเชื่อมต่อระบบในหน้างาน',priority:'P1',status:'Completed',owner:'u2',project:'',category:'Service',due:'2026-10-23',progress:100,effort:2,tags:['Support','Printer'],blocker:''},
    {id:'IT-2411',title:'วางแผน Log Retention และ Central Logging',description:'กำหนด Scope, Retention และ Log Source ที่จำเป็น',priority:'P1',status:'Not Started',owner:'u5',project:'PRJ-02',category:'Project',due:'2026-11-05',progress:0,effort:0,tags:['Logging','Security'],blocker:''},
    {id:'IT-2412',title:'เก็บความต้องการระบบ AI Pilot',description:'สัมภาษณ์หน่วยงานเพื่อคัดเลือก Use Case ความเสี่ยงต่ำ',priority:'P2',status:'On Hold',owner:'u3',project:'PRJ-05',category:'Project',due:'2027-01-15',progress:12,effort:1,tags:['AI','Discovery'],blocker:'รอนัดหมายคณะทำงาน'},
    {id:'IT-2413',title:'ยืนยันผล Health Check ของ VMware Host',description:'ทบทวน Alarm, Datastore และ Snapshot ที่ค้าง',priority:'P2',status:'Completed',owner:'u6',project:'PRJ-04',category:'Routine',due:'2026-10-24',progress:100,effort:3,tags:['VMware','Monitoring'],blocker:''},
    {id:'IT-2414',title:'ทดสอบ Session และ CSRF บน Prototype',description:'จัดทำ Test Case ตามแนวทาง Secure PHP Development',priority:'P1',status:'In Progress',owner:'u3',project:'PRJ-01',category:'Project',due:'2026-10-31',progress:28,effort:5,tags:['OWASP','Test'],blocker:''},
    {id:'IT-2415',title:'ทบทวน VLAN ของ Guest Wi-Fi',description:'ตรวจสอบการแยกเครือข่าย Guest และ Internal',priority:'P1',status:'Not Started',owner:'u4',project:'PRJ-03',category:'Project',due:'2026-11-08',progress:0,effort:0,tags:['VLAN','Wi-Fi'],blocker:''},
    {id:'IT-2416',title:'จัดรูปแบบรายงานประจำสัปดาห์',description:'จัดทำ Template สรุปงานสำเร็จ ความเสี่ยงและงานสัปดาห์หน้า',priority:'P2',status:'Completed',owner:'u1',project:'PRJ-01',category:'Routine',due:'2026-10-21',progress:100,effort:3,tags:['Report'],blocker:''},
    {id:'IT-2417',title:'แก้ไขการเข้าถึง Shared Folder ห้องการเงิน',description:'ตรวจสอบ Permission และยืนยันสิทธิ์กับเจ้าของข้อมูล',priority:'P1',status:'In Progress',owner:'u6',project:'',category:'Service',due:'2026-10-26',progress:40,effort:2,tags:['File Share','Access'],blocker:''},
    {id:'IT-2418',title:'จัดทำ Evidence Checklist สำหรับ CTAM+',description:'แยก Requirement, Owner, Evidence และรอบการตรวจสอบ',priority:'P1',status:'At Risk',owner:'u5',project:'PRJ-02',category:'Project',due:'2026-11-01',progress:46,effort:4,tags:['CTAM+','Audit'],blocker:''}
  ],
  milestones:[
    {id:'MS-01',project:'PRJ-01',title:'PRD + ERD + RBAC ฉบับแรก',due:'2026-10-31',status:'In Progress'},
    {id:'MS-02',project:'PRJ-01',title:'Task & Team Management Demo',due:'2026-11-30',status:'Not Started'},
    {id:'MS-03',project:'PRJ-01',title:'MVP Pilot และ UAT',due:'2027-01-30',status:'Not Started'},
    {id:'MS-04',project:'PRJ-02',title:'Privileged Accounts & MFA Plan',due:'2026-11-15',status:'At Risk'},
    {id:'MS-05',project:'PRJ-02',title:'Review Security Evidence',due:'2027-03-31',status:'Not Started'},
    {id:'MS-06',project:'PRJ-03',title:'Network Topology Baseline',due:'2026-12-15',status:'In Progress'},
    {id:'MS-07',project:'PRJ-03',title:'Segment Review รอบแรก',due:'2027-04-30',status:'Not Started'},
    {id:'MS-08',project:'PRJ-04',title:'Backup Inventory & Matrix',due:'2026-11-20',status:'In Progress'},
    {id:'MS-09',project:'PRJ-04',title:'Restore Drill Report',due:'2027-06-30',status:'At Risk'},
    {id:'MS-10',project:'PRJ-05',title:'AI Readiness & Use Case Shortlist',due:'2027-09-30',status:'Not Started'}
  ],
  roadmap:[
    {project:'PRJ-01',start:1,length:4,color:'coral'},
    {project:'PRJ-02',start:1,length:6,color:'purple'},
    {project:'PRJ-03',start:1,length:7,color:'green'},
    {project:'PRJ-04',start:1,length:9,color:'orange'},
    {project:'PRJ-05',start:4,length:9,color:'blue'}
  ],
  kpis:[
    {id:'KPI-01',name:'On-time Completion',label:'งานเสร็จภายในกำหนด',actual:82,target:85,unit:'%',direction:'up',owner:'u1',formula:'งานที่ปิดตรงเวลา ÷ งานที่ปิดและมีกำหนดส่ง × 100',method:'ค่าจำลองสำหรับทดสอบหน้าจอ ไม่ได้คำนวณจากงานจริง',strategic:'ประสิทธิภาพการให้บริการ'},
    {id:'KPI-02',name:'Critical Overdue',label:'งานวิกฤตที่เลยกำหนด',actual:1,target:0,unit:' งาน',direction:'down',owner:'u1',formula:'นับงาน P0 ที่เลยกำหนดและยังไม่ปิด',method:'ค่าจำลองสำหรับทดสอบหน้าจอ',strategic:'ความต่อเนื่องทางบริการ'},
    {id:'KPI-03',name:'Roadmap Alignment',label:'โครงการเชื่อมยุทธศาสตร์',actual:91,target:90,unit:'%',direction:'up',owner:'u3',formula:'โครงการที่มี Strategic Objective ÷ โครงการทั้งหมด × 100',method:'ค่าจำลองสำหรับทดสอบหน้าจอ',strategic:'ธรรมาภิบาลดิจิทัล'},
    {id:'KPI-04',name:'Evidence Coverage',label:'หลักฐานผ่านตรวจรับครบถ้วน',actual:88,target:95,unit:'%',direction:'up',owner:'u5',formula:'Milestone ที่ตรวจรับพร้อมหลักฐานครบ ÷ Milestone ที่กำหนดให้แนบหลักฐาน × 100',method:'ค่าจำลองสำหรับทดสอบหน้าจอ',strategic:'การกำกับติดตามผล'}
  ],
  evidence:[
    {id:'EV-101',title:'ตัวอย่างผลตรวจ Backup Job',type:'PDF',by:'u2',kpi:'KPI-04',project:'PRJ-04',date:'2026-10-25',status:'Pending',size:'1.8 MB'},
    {id:'EV-102',title:'RBAC Permission Matrix v0.1',type:'XLSX',by:'u1',kpi:'KPI-03',project:'PRJ-01',date:'2026-10-23',status:'Approved',size:'244 KB'},
    {id:'EV-103',title:'Network Diagram Baseline',type:'PDF',by:'u4',kpi:'KPI-03',project:'PRJ-03',date:'2026-10-24',status:'Pending',size:'3.2 MB'},
    {id:'EV-104',title:'Weekly IT Work Summary',type:'PDF',by:'u1',kpi:'KPI-01',project:'PRJ-01',date:'2026-10-21',status:'Approved',size:'892 KB'},
    {id:'EV-105',title:'Restore Drill Checklist',type:'PDF',by:'u2',kpi:'KPI-04',project:'PRJ-04',date:'2026-10-22',status:'Pending',size:'540 KB'},
    {id:'EV-106',title:'Firewall Review Checklist',type:'DOCX',by:'u4',kpi:'KPI-04',project:'PRJ-03',date:'2026-10-20',status:'Draft',size:'118 KB'}
  ],
  controls:[
    {id:'CTRL-01',ref:'CTAM+ / MFA',title:'บัญชีผู้ใช้สิทธิ์สูงและ MFA',description:'ตรวจสอบการยืนยันตัวตนของบัญชีที่มีสิทธิ์เข้าถึงระบบสำคัญ',framework:'CTAM+',owner:'u5',status:'In Progress',evidence:['EV-102'],due:'2026-11-15'},
    {id:'CTRL-02',ref:'CTAM+ / Backup',title:'Backup & Restore Evidence',description:'ตรวจสอบขอบเขตสำรองข้อมูลและการทดสอบกู้คืนตามนโยบายของหน่วยงาน',framework:'CTAM+',owner:'u2',status:'At Risk',evidence:['EV-101','EV-105'],due:'2026-12-01'},
    {id:'CTRL-03',ref:'OWASP / A01',title:'Broken Access Control',description:'กำหนดนโยบายสิทธิ์และทดสอบการเข้าถึงข้อมูลข้ามบทบาท',framework:'OWASP',owner:'u3',status:'In Progress',evidence:['EV-102'],due:'2026-11-25'},
    {id:'CTRL-04',ref:'OWASP / A05',title:'Security Misconfiguration',description:'เตรียม Checklist การตั้งค่าความปลอดภัยสำหรับ Production',framework:'OWASP',owner:'u6',status:'Not Started',evidence:[],due:'2026-12-15'},
    {id:'CTRL-05',ref:'Local / Logging',title:'Centralized Logging',description:'จัดทำแผน Log Source, Retention และ Review',framework:'Local Policy',owner:'u5',status:'Not Started',evidence:[],due:'2027-01-30'},
    {id:'CTRL-06',ref:'Local / Network',title:'Network Segmentation',description:'ทบทวนการแบ่ง Zone, VLAN และข้อยกเว้นที่ได้รับอนุมัติ',framework:'Local Policy',owner:'u4',status:'In Progress',evidence:['EV-103'],due:'2027-02-01'}
  ],
  tickets:[
    {id:'REQ-301',title:'เครื่องพิมพ์ห้องยาไม่สามารถพิมพ์เอกสาร',type:'Incident',requester:'เภสัชกรรม (ตัวอย่าง)',priority:'P1',status:'In Progress',owner:'u2',opened:'2026-10-25',sla:'ใกล้ครบกำหนด'},
    {id:'REQ-302',title:'ขอสิทธิ์เข้าถึง Shared Folder',type:'Service Request',requester:'การเงิน (ตัวอย่าง)',priority:'P2',status:'Not Started',owner:'u6',opened:'2026-10-25',sla:'ภายในกำหนด'},
    {id:'REQ-303',title:'Wi-Fi Guest สัญญาณไม่เสถียร',type:'Incident',requester:'อาคาร OPD (ตัวอย่าง)',priority:'P1',status:'At Risk',owner:'u4',opened:'2026-10-24',sla:'เสี่ยงเลยกำหนด'},
    {id:'REQ-304',title:'ติดตั้งโปรแกรมสำนักงานใหม่',type:'Service Request',requester:'เวชระเบียน (ตัวอย่าง)',priority:'P3',status:'Completed',owner:'u3',opened:'2026-10-22',sla:'ปิดรายการ'},
    {id:'REQ-305',title:'สอบถามการเปลี่ยนรหัสผ่าน',type:'Service Request',requester:'ห้องปฏิบัติการ (ตัวอย่าง)',priority:'P3',status:'Completed',owner:'u5',opened:'2026-10-21',sla:'ปิดรายการ'},
    {id:'REQ-306',title:'ระบบสแกนเอกสารตอบสนองช้า',type:'Incident',requester:'OPD (ตัวอย่าง)',priority:'P2',status:'Blocked',owner:'u3',opened:'2026-10-23',sla:'รอผู้ให้บริการ'}
  ],
  notifications:[
    {id:'N-01',title:'งาน IT-2402 ถูกเปลี่ยนเป็น Blocked',text:'กำลังรอข้อมูลบัญชี Privileged จากเจ้าของระบบ',date:'25 ต.ค. 2569 · 13:35',read:false,type:'warning',link:'task-detail.html?id=IT-2402'},
    {id:'N-02',title:'มีหลักฐานรอตรวจรับ 3 รายการ',text:'ตรวจสอบรายละเอียดใน KPI & Evidence',date:'25 ต.ค. 2569 · 10:40',read:false,type:'file',link:'kpi.html'},
    {id:'N-03',title:'Milestone PRD + ERD กำหนดส่งใกล้เข้ามา',text:'กำหนดส่ง 31 ต.ค. 2569',date:'24 ต.ค. 2569 · 16:25',read:false,type:'calendar',link:'project-detail.html?id=PRJ-01'},
    {id:'N-04',title:'ปิดงาน IT-2410 แล้ว',text:'เครื่องพิมพ์หน้างานกลับมาใช้งานได้ตามตัวอย่าง',date:'23 ต.ค. 2569 · 11:12',read:true,type:'check',link:'task-detail.html?id=IT-2410'},
    {id:'N-05',title:'สร้างรายงานประจำสัปดาห์',text:'พร้อมดูตัวอย่างและทดลอง Export CSV',date:'22 ต.ค. 2569 · 09:05',read:true,type:'chart',link:'reports.html'}
  ],
  activity:[
    {id:'A-01',user:'u5',action:'เปลี่ยนสถานะ IT-2402 เป็น Blocked',detail:'รอรายชื่อบัญชี Privileged',time:'25 ต.ค. 2569 · 13:35',type:'warning'},
    {id:'A-02',user:'u2',action:'เพิ่มหลักฐาน EV-101',detail:'ตัวอย่างผลตรวจ Backup Job',time:'25 ต.ค. 2569 · 10:40',type:'file'},
    {id:'A-03',user:'u1',action:'ปรับปรุง RBAC Matrix',detail:'โครงการ IT Portal',time:'24 ต.ค. 2569 · 16:25',type:'check'},
    {id:'A-04',user:'u4',action:'อัปเดตความคืบหน้า Network Diagram',detail:'จาก 45% เป็น 61%',time:'24 ต.ค. 2569 · 11:12',type:'chart'},
    {id:'A-05',user:'u3',action:'เพิ่มแผนงาน UX/UI',detail:'My Work และ Team Board',time:'23 ต.ค. 2569 · 09:20',type:'calendar'}
  ]
};