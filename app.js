(() => {
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const STORE="huyen-cac-pro-profile-v2", TZ=7;
const STEMS=["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];
const BRANCHES=["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];
const ANIMALS=["Chuột","Trâu","Hổ","Mèo","Rồng","Rắn","Ngựa","Dê","Khỉ","Gà","Chó","Lợn"];
const ICONS=["🐭","🐮","🐯","🐱","🐲","🐍","🐴","🐐","🐒","🐓","🐕","🐖"];
const STEM_ELEMENT=["Mộc","Mộc","Hỏa","Hỏa","Thổ","Thổ","Kim","Kim","Thủy","Thủy"];
const ELEMENT_TEXT={Mộc:"phát triển, mở rộng, học hỏi và thích nghi",Hỏa:"hành động, biểu đạt, nhiệt huyết và tốc độ",Thổ:"ổn định, cấu trúc, thực tế và bền bỉ",Kim:"kỷ luật, ranh giới, rõ ràng và quyết đoán",Thủy:"linh hoạt, quan sát, trực giác và kết nối"};
const TRINES=[[0,4,8],[1,5,9],[2,6,10],[3,7,11]], CLASH=[[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]];
const BRANCH_ELEMENT=["Thủy","Thổ","Mộc","Mộc","Thổ","Hỏa","Hỏa","Thổ","Kim","Kim","Thổ","Thủy"];
const STEM_POLARITY=["Dương","Âm","Dương","Âm","Dương","Âm","Dương","Âm","Dương","Âm"];
const BRANCH_POLARITY=["Dương","Âm","Dương","Âm","Dương","Âm","Dương","Âm","Dương","Âm","Dương","Âm"];
const TRINE_DETAIL=[
 {members:[8,0,4],name:"Thân – Tý – Thìn",bureau:"Thủy cục",element:"Thủy"},
 {members:[2,6,10],name:"Dần – Ngọ – Tuất",bureau:"Hỏa cục",element:"Hỏa"},
 {members:[11,3,7],name:"Hợi – Mão – Mùi",bureau:"Mộc cục",element:"Mộc"},
 {members:[5,9,1],name:"Tỵ – Dậu – Sửu",bureau:"Kim cục",element:"Kim"}
];
const FOUR_CLASH=[
 {members:[0,6,3,9],name:"Tý – Ngọ – Mão – Dậu"},
 {members:[2,8,5,11],name:"Dần – Thân – Tỵ – Hợi"},
 {members:[4,10,1,7],name:"Thìn – Tuất – Sửu – Mùi"}
];
const SIX_HARMONY={0:1,1:0,2:11,11:2,3:10,10:3,4:9,9:4,5:8,8:5,6:7,7:6};
const GENERATES={Mộc:"Hỏa",Hỏa:"Thổ",Thổ:"Kim",Kim:"Thủy",Thủy:"Mộc"};
const CONTROLS={Mộc:"Thổ",Thổ:"Thủy",Thủy:"Hỏa",Hỏa:"Kim",Kim:"Mộc"};

const ZODIAC=[
["Ma Kết","♑","thực tế, có cấu trúc, bền bỉ và thiên về mục tiêu dài hạn"],
["Bảo Bình","♒","độc lập, thích ý tưởng mới và có xu hướng nhìn vấn đề theo hệ thống"],
["Song Ngư","♓","nhạy cảm, giàu tưởng tượng, trực giác và khả năng đồng cảm"],
["Bạch Dương","♈","chủ động, nhanh, thẳng và có xu hướng mở đường"],
["Kim Ngưu","♉","ổn định, kiên trì, coi trọng giá trị và tiến từng bước chắc chắn"],
["Song Tử","♊","tò mò, giao tiếp nhanh, linh hoạt và thích nhiều góc nhìn"],
["Cự Giải","♋","quan tâm cảm xúc, sự an toàn, gia đình và ký ức trải nghiệm"],
["Sư Tử","♌","ấm áp, biểu đạt rõ, thích tạo dấu ấn và truyền năng lượng"],
["Xử Nữ","♍","phân tích, tỉ mỉ, chú ý tính hữu dụng và cải thiện liên tục"],
["Thiên Bình","♎","cân bằng, ngoại giao, coi trọng quan hệ và tính hài hòa"],
["Bọ Cạp","♏","sâu sắc, tập trung, kín đáo và có khả năng theo đuổi đến cùng"],
["Nhân Mã","♐","cởi mở, ham khám phá, hướng tương lai và coi trọng tự do"]
];
const NUM_TEXT={
1:["Người Khởi Xướng","độc lập, chủ động, thích bắt đầu và tự quyết","học cách cộng tác mà không mất tính tự chủ"],
2:["Người Kết Nối","nhạy cảm với quan hệ, phối hợp tốt, tinh tế","giữ ranh giới và nói rõ nhu cầu thay vì chỉ chiều theo"],
3:["Người Biểu Đạt","sáng tạo, giao tiếp, tạo không khí và truyền cảm hứng","biến cảm hứng thành nhịp làm việc đều và có đầu ra"],
4:["Người Xây Nền","có hệ thống, thực tế, đáng tin và kiên trì","tránh cứng nhắc khi hoàn cảnh cần đổi cách làm"],
5:["Người Khám Phá","linh hoạt, thích trải nghiệm, tự do và chuyển động","giữ trọng tâm để không bị phân tán bởi quá nhiều lựa chọn"],
6:["Người Chăm Sóc","trách nhiệm, quan tâm cộng đồng, thẩm mỹ và sự hài hòa","không ôm trách nhiệm của tất cả mọi người"],
7:["Người Chiêm Nghiệm","đào sâu, phân tích, nghiên cứu và cần không gian riêng","đưa suy nghĩ trở lại dữ kiện và trải nghiệm thực tế"],
8:["Người Điều Hành","hướng kết quả, nguồn lực, tổ chức và năng lực quản trị","cân bằng hiệu quả với con người và giới hạn thực tế"],
9:["Người Nhân Văn","góc nhìn rộng, cảm thông, lý tưởng và mong tạo tác động","đặt ranh giới để lý tưởng không trở thành phân tán"],
11:["Người Truyền Cảm Hứng","trực giác, độ nhạy và khả năng nhận ra ý nghĩa phía sau sự việc","tạo nền tảng thực tế để tránh quá tải cảm xúc"],
22:["Người Kiến Tạo","khả năng biến tầm nhìn lớn thành hệ thống cụ thể","chia mục tiêu lớn thành cấu trúc có thể thực thi"],
33:["Người Phụng Sự","năng lượng chăm sóc, nâng đỡ và trách nhiệm cộng đồng","chăm sóc chính mình trước khi gánh quá nhiều"]
};
const CYCLE_TEXT={
1:"Khởi đầu: chủ động, thử hướng mới, đặt nền cho chu kỳ kế tiếp.",2:"Hợp tác: kiên nhẫn, quan hệ, lắng nghe và tinh chỉnh.",
3:"Biểu đạt: giao tiếp, sáng tạo, kết nối và đưa ý tưởng ra ngoài.",4:"Xây nền: kỷ luật, quy trình, sức bền và tính ổn định.",
5:"Thay đổi: linh hoạt, trải nghiệm, dịch chuyển và điều chỉnh.",6:"Trách nhiệm: gia đình, cam kết, chăm sóc và cân bằng.",
7:"Chiêm nghiệm: học sâu, đánh giá lại, nghiên cứu và giảm nhiễu.",8:"Thành tựu: kết quả, tài chính, quyền hạn và quản trị.",
9:"Hoàn tất: tổng kết, buông phần không còn phù hợp và đóng chu kỳ."
};

const TAROT=[
["0","The Fool","🪽","khởi đầu, cởi mở, thử nghiệm và bước vào điều mới","bốc đồng, thiếu chuẩn bị hoặc ngại bước ra khỏi vùng quen thuộc"],
["I","The Magician","✦","chủ động, kỹ năng, nguồn lực và khả năng biến ý tưởng thành hành động","nguồn lực bị phân tán hoặc bạn đang đánh giá thấp năng lực sẵn có"],
["II","The High Priestess","☾","trực giác, quan sát và phần thông tin chưa cần phơi bày","nhiễu trực giác, thiếu dữ kiện hoặc cảm giác có điều chưa rõ"],
["III","The Empress","🌿","nuôi dưỡng, sáng tạo, phát triển và tạo điều kiện cho thứ gì đó lớn lên","chăm quá nhiều cho bên ngoài hoặc thiếu chăm sóc nguồn lực của chính mình"],
["IV","The Emperor","♜","cấu trúc, kỷ luật, trách nhiệm và ranh giới","kiểm soát quá mức hoặc ngược lại thiếu một hệ thống đủ vững"],
["V","The Hierophant","🔔","hệ giá trị, kiến thức truyền thống, người hướng dẫn và chuẩn mực","cần xem lại khuôn mẫu cũ hoặc tự xây nguyên tắc phù hợp hơn"],
["VI","The Lovers","♡","giá trị, lựa chọn, kết nối và sự đồng thuận","bất đồng giá trị, do dự hoặc một lựa chọn chưa thật sự nhất quán"],
["VII","The Chariot","✧","ý chí, hướng đi, kiểm soát lực kéo đối lập và tiến về mục tiêu","mất phương hướng, thúc ép quá nhanh hoặc các phần chưa phối hợp"],
["VIII","Strength","🦁","sức mạnh mềm, kiên nhẫn và khả năng điều hòa phản ứng","tự nghi ngờ, kiệt sức hoặc dùng lực quá mạnh cho vấn đề cần mềm dẻo"],
["IX","The Hermit","🏮","tĩnh lại, tìm hiểu sâu và tự soi chiếu","cô lập quá lâu hoặc suy nghĩ vòng lặp mà chưa kiểm chứng"],
["X","Wheel of Fortune","☸","chu kỳ đổi chiều, điều kiện mới và cơ hội cần thích nghi","khó chấp nhận biến động hoặc cố kiểm soát thứ vốn đang thay đổi"],
["XI","Justice","⚖","công bằng, hệ quả, dữ kiện và quyết định có trách nhiệm","thiên kiến, né hệ quả hoặc chưa cân đủ hai phía"],
["XII","The Hanged Man","⟡","tạm dừng, đổi góc nhìn và chấp nhận chưa hành động","trì hoãn vô ích hoặc mắc kẹt vì không chịu đổi cách nhìn"],
["XIII","Death","🦋","kết thúc cần thiết, chuyển hóa và dọn chỗ cho giai đoạn mới","bám giữ điều đã hết vai trò hoặc trì hoãn một thay đổi cần thiết"],
["XIV","Temperance","⚗","điều độ, phối hợp, cân bằng và tích hợp","nhịp sống lệch, quá đà hoặc thiếu kiên nhẫn trong quá trình điều chỉnh"],
["XV","The Devil","⛓","ràng buộc, ham muốn, thói quen và phần cần nhìn thẳng","bắt đầu nhận ra ràng buộc và có cơ hội lấy lại quyền lựa chọn"],
["XVI","The Tower","⚡","sự thật làm lung lay cấu trúc không còn vững","thay đổi bị trì hoãn hoặc tác động có thể giảm nếu chuẩn bị sớm"],
["XVII","The Star","☆","hy vọng, định hướng, hồi phục và niềm tin có cơ sở","mất động lực hoặc kỳ vọng đang xa khỏi dữ kiện thực tế"],
["XVIII","The Moon","🌙","mơ hồ, cảm xúc, trực giác và vùng thông tin chưa rõ","sự thật đang dần lộ ra nhưng vẫn cần kiểm chứng trước khi kết luận"],
["XIX","The Sun","☀","sáng rõ, năng lượng, sự tự tin và tiến triển tích cực","kết quả tốt có thể có nhưng cần thực tế và tránh chủ quan"],
["XX","Judgement","📯","tổng kết, thức tỉnh và một quyết định có tính chuyển giai đoạn","tự phán xét quá mức hoặc né một quyết định đã đến lúc phải nhìn thẳng"],
["XXI","The World","🌐","hoàn tất, tích hợp, thành tựu và chuẩn bị mở chu kỳ mới","còn một mắt xích chưa khép hoặc cần hoàn thiện trước khi chuyển sang bước khác"]
];
const TOPIC_NAME={general:"Tổng quan",love:"Tình cảm",work:"Công việc",finance:"Tài chính",study:"Học tập",decision:"Quyết định"};
const TOPIC_LENS={
general:["bức tranh tổng thể","điều cần ưu tiên","bước tiếp theo"],
love:["mẫu quan hệ hoặc cảm xúc nền","động lực giữa hai phía","ranh giới hoặc cách giao tiếp cần ưu tiên"],
work:["kinh nghiệm hoặc cấu trúc đã hình thành","nút thắt vận hành hiện tại","hành động có thể cải thiện kết quả"],
finance:["thói quen và nền tảng nguồn lực","rủi ro hoặc cơ hội đang hiện diện","nguyên tắc cần giữ trước khi quyết định tiền bạc"],
study:["nền tảng kỹ năng và thói quen","điểm đang cản trở tiến độ","cách học hoặc ưu tiên cần thử"],
decision:["điều đang ảnh hưởng lựa chọn","yếu tố quan trọng chưa được cân đủ","tiêu chí nên dùng để chốt quyết định"]
};
const TAROT_MODE_NAME={auto:"Auto toàn cảnh",open:"Không câu hỏi",preset:"Câu hỏi gợi ý",custom:"Tự đặt câu hỏi"};
const TAROT_PRESETS={
 general:["Điều gì tôi cần chú ý nhất ở thời điểm này?","Năng lượng nổi bật trong 30 ngày tới là gì?","Tôi đang bỏ sót điều quan trọng nào?"],
 love:["Điều gì đang ảnh hưởng nhiều nhất đến đời sống tình cảm của tôi?","Tôi cần hiểu gì về mối quan hệ hiện tại?","Tôi nên điều chỉnh điều gì để tình cảm lành mạnh hơn?"],
 work:["Tôi nên ưu tiên điều gì để công việc tiến triển tốt hơn?","Nút thắt lớn nhất trong công việc hiện tại là gì?","Cơ hội nghề nghiệp nào tôi nên chuẩn bị để đón nhận?"],
 finance:["Tôi cần lưu ý điều gì về cách quản lý tiền lúc này?","Rủi ro tài chính nào tôi nên kiểm tra kỹ hơn?","Tôi nên ưu tiên ổn định hay mở rộng nguồn lực?"],
 study:["Tôi nên thay đổi cách học hoặc phát triển bản thân thế nào?","Điều gì đang cản trở tiến độ học tập của tôi?","Kỹ năng nào đáng ưu tiên trong giai đoạn này?"],
 decision:["Yếu tố nào tôi chưa cân nhắc đủ trước quyết định này?","Tiêu chí nào nên được ưu tiên khi tôi lựa chọn?","Điều gì sẽ giúp tôi nhìn quyết định này rõ hơn?"]
};
const AUTO_DOMAINS=[
 {topic:"general",label:"TỔNG QUAN",title:"Năng lượng hiện tại",lens:"bức tranh chung và điều đang chi phối nhịp sống"},
 {topic:"love",label:"TÌNH CẢM",title:"Quan hệ & cảm xúc",lens:"mối quan hệ, nhu cầu cảm xúc và cách kết nối"},
 {topic:"work",label:"CÔNG VIỆC",title:"Sự nghiệp & vận hành",lens:"công việc, trách nhiệm, vị trí và cơ hội phát triển"},
 {topic:"finance",label:"TÀI CHÍNH",title:"Nguồn lực & tiền bạc",lens:"cách quản lý nguồn lực, rủi ro và độ ổn định"},
 {topic:"study",label:"PHÁT TRIỂN",title:"Học tập & nội lực",lens:"kỹ năng, thói quen, tư duy và phát triển cá nhân"},
 {topic:"decision",label:"ƯU TIÊN",title:"Điều cần chú ý",lens:"điểm cần kiểm chứng trước khi hành động hoặc chốt lựa chọn"}
];
const KUA_INFO={
 1:{gua:"Khảm",element:"Thủy",group:"Đông tứ mệnh",directions:"Bắc • Đông • Nam • Đông Nam"},
 2:{gua:"Khôn",element:"Thổ",group:"Tây tứ mệnh",directions:"Đông Bắc • Tây • Tây Bắc • Tây Nam"},
 3:{gua:"Chấn",element:"Mộc",group:"Đông tứ mệnh",directions:"Bắc • Đông • Nam • Đông Nam"},
 4:{gua:"Tốn",element:"Mộc",group:"Đông tứ mệnh",directions:"Bắc • Đông • Nam • Đông Nam"},
 6:{gua:"Càn",element:"Kim",group:"Tây tứ mệnh",directions:"Đông Bắc • Tây • Tây Bắc • Tây Nam"},
 7:{gua:"Đoài",element:"Kim",group:"Tây tứ mệnh",directions:"Đông Bắc • Tây • Tây Bắc • Tây Nam"},
 8:{gua:"Cấn",element:"Thổ",group:"Tây tứ mệnh",directions:"Đông Bắc • Tây • Tây Bắc • Tây Nam"},
 9:{gua:"Ly",element:"Hỏa",group:"Đông tứ mệnh",directions:"Bắc • Đông • Nam • Đông Nam"}
};
const PURPOSE_NAME={general:"Việc chung",work:"Khai trương / công việc",contract:"Ký kết / hợp đồng",travel:"Xuất hành / đi xa",love:"Hẹn hò / tình cảm",study:"Thi cử / học tập"};

let profile=loadProfile(), dateCache=[], showAllDates=false;

function loadProfile(){try{return JSON.parse(localStorage.getItem(STORE))||null}catch{return null}}
function saveProfile(p){profile=p;localStorage.setItem(STORE,JSON.stringify(p));renderAll()}
function stripName(s){return (s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/gi,"d").toUpperCase().replace(/[^A-Z]/g,"")}
function reduceNum(n,masters=true){n=Math.abs(Number(n)||0);while(n>9&&!(masters&&[11,22,33].includes(n)))n=String(n).split("").reduce((a,b)=>a+Number(b),0);return n}
function sumDigits(s){return String(s).replace(/\D/g,"").split("").reduce((a,b)=>a+Number(b),0)}
function lifePath(ds){return reduceNum(sumDigits(ds),true)}
function birthdayNum(ds){return reduceNum(Number(ds.split("-")[2]),true)}
function letterValue(ch){const i="ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(ch);return i<0?0:(i%9)+1}
function expressionNum(name){return reduceNum([...stripName(name)].reduce((s,c)=>s+letterValue(c),0),true)}
function soulNum(name){return reduceNum([...stripName(name)].filter(c=>"AEIOUY".includes(c)).reduce((s,c)=>s+letterValue(c),0),true)}
function personalityNum(name){return reduceNum([...stripName(name)].filter(c=>!"AEIOUY".includes(c)).reduce((s,c)=>s+letterValue(c),0),true)}
function attitudeNum(ds){const [,m,d]=ds.split("-").map(Number);return reduceNum(m+d,true)}
function maturityNum(name,ds){return reduceNum(lifePath(ds)+expressionNum(name),true)}
function personalYear(ds,year=new Date().getFullYear()){const [,m,d]=ds.split("-").map(Number);return reduceNum(m+d+sumDigits(year),false)}
function personalMonth(ds,date=new Date()){return reduceNum(personalYear(ds,date.getFullYear())+(date.getMonth()+1),false)}
function personalDay(ds,date=new Date()){return reduceNum(personalMonth(ds,date)+date.getDate(),false)}

function yearCanChi(y){const si=(y+6)%10,bi=(y+8)%12;return {stemIndex:si,branchIndex:bi,stem:STEMS[si],branch:BRANCHES[bi],animal:ANIMALS[bi],icon:ICONS[bi],element:STEM_ELEMENT[si]}}
function jdFromDate(dd,mm,yy){let a=Math.floor((14-mm)/12),y=yy+4800-a,m=mm+12*a-3;let jd=dd+Math.floor((153*m+2)/5)+365*y+Math.floor(y/4)-Math.floor(y/100)+Math.floor(y/400)-32045;if(jd<2299161)jd=dd+Math.floor((153*m+2)/5)+365*y+Math.floor(y/4)-32083;return jd}
function dayCanChi(date){const jd=jdFromDate(date.getDate(),date.getMonth()+1,date.getFullYear());const si=((jd+9)%10+10)%10,bi=((jd+1)%12+12)%12;return {jd,stemIndex:si,branchIndex:bi,stem:STEMS[si],branch:BRANCHES[bi],animal:ANIMALS[bi],element:STEM_ELEMENT[si]}}
function hourBranchIndex(time){if(!time)return null;const [h,m]=time.split(":").map(Number),mins=h*60+m;if(mins>=23*60||mins<60)return 0;return Math.floor((mins-60)/120)+1}
function hourCanChi(date,time){const bi=hourBranchIndex(time);if(bi===null)return null;const day=dayCanChi(date);const si=((day.stemIndex%5)*2+bi)%10;return {stemIndex:si,branchIndex:bi,stem:STEMS[si],branch:BRANCHES[bi],animal:ANIMALS[bi],element:STEM_ELEMENT[si]}}
function relations(bi){const tri=TRINES.find(x=>x.includes(bi))||[];const cl=CLASH.find(x=>x.includes(bi))||[];return {trine:tri.filter(x=>x!==bi),clash:cl.find(x=>x!==bi)}}
function branchFull(i){return `${BRANCHES[i]} (${ANIMALS[i]} • ${BRANCH_ELEMENT[i]} • ${BRANCH_POLARITY[i]})`}
function stemFull(i){return `${STEMS[i]} (${STEM_ELEMENT[i]} • ${STEM_POLARITY[i]})`}
function trineInfo(i){return TRINE_DETAIL.find(x=>x.members.includes(i))}
function fourClashInfo(i){return FOUR_CLASH.find(x=>x.members.includes(i))}
function relationBetween(a,b){
 if(b===null||b===undefined)return "Chưa có dữ liệu";
 if(a===b)return `Đồng chi ${BRANCHES[a]} — cùng một Địa Chi`;
 const r=relations(a);
 if(r.trine.includes(b))return `Tam hợp — ${BRANCHES[a]} và ${BRANCHES[b]} cùng nhóm ${trineInfo(a).name}`;
 if(r.clash===b)return `Lục xung / đối xung trực tiếp — ${BRANCHES[a]} ↔ ${BRANCHES[b]}`;
 if(SIX_HARMONY[a]===b)return `Lục hợp (nhị hợp) — ${BRANCHES[a]} ↔ ${BRANCHES[b]}`;
 const fa=fourClashInfo(a); if(fa&&fa.members.includes(b))return `Cùng nhóm Tứ hành xung ${fa.name}, nhưng không phải cặp đối xung trực tiếp`;
 return `Không thuộc Tam hợp, Lục hợp hoặc cặp đối xung trực tiếp với ${BRANCHES[a]}`;
}
function zodiacRange(name){return ({"Ma Kết":"22/12 – 19/01","Bảo Bình":"20/01 – 18/02","Song Ngư":"19/02 – 20/03","Bạch Dương":"21/03 – 19/04","Kim Ngưu":"20/04 – 20/05","Song Tử":"21/05 – 20/06","Cự Giải":"21/06 – 22/07","Sư Tử":"23/07 – 22/08","Xử Nữ":"23/08 – 22/09","Thiên Bình":"23/09 – 22/10","Bọ Cạp":"23/10 – 21/11","Nhân Mã":"22/11 – 21/12"})[name]||"—"}
function western(ds){const [,m,d]=ds.split("-").map(Number),md=m*100+d;let idx=0;if(md>=120&&md<=218)idx=1;else if(md>=219&&md<=320)idx=2;else if(md>=321&&md<=419)idx=3;else if(md>=420&&md<=520)idx=4;else if(md>=521&&md<=620)idx=5;else if(md>=621&&md<=722)idx=6;else if(md>=723&&md<=822)idx=7;else if(md>=823&&md<=922)idx=8;else if(md>=923&&md<=1022)idx=9;else if(md>=1023&&md<=1121)idx=10;else if(md>=1122&&md<=1221)idx=11;return {name:ZODIAC[idx][0],icon:ZODIAC[idx][1],text:ZODIAC[idx][2]}}

// Vietnamese lunar calendar conversion (astronomical method, timezone UTC+7)
function newMoon(k){const T=k/1236.85,T2=T*T,T3=T2*T,dr=Math.PI/180;let Jd1=2415020.75933+29.53058868*k+0.0001178*T2-0.000000155*T3;Jd1+=0.00033*Math.sin((166.56+132.87*T-0.009173*T2)*dr);const M=359.2242+29.10535608*k-0.0000333*T2-0.00000347*T3;const Mpr=306.0253+385.81691806*k+0.0107306*T2+0.00001236*T3;const F=21.2964+390.67050646*k-0.0016528*T2-0.00000239*T3;let C1=(0.1734-0.000393*T)*Math.sin(M*dr)+0.0021*Math.sin(2*dr*M);C1=C1-0.4068*Math.sin(Mpr*dr)+0.0161*Math.sin(2*dr*Mpr);C1-=0.0004*Math.sin(3*dr*Mpr);C1+=0.0104*Math.sin(2*dr*F)-0.0051*Math.sin((M+Mpr)*dr)-0.0074*Math.sin((M-Mpr)*dr)+0.0004*Math.sin((2*F+M)*dr)-0.0004*Math.sin((2*F-M)*dr)-0.0006*Math.sin((2*F+Mpr)*dr)+0.0010*Math.sin((2*F-Mpr)*dr)+0.0005*Math.sin((2*Mpr+M)*dr);let deltat;if(T<-11)deltat=0.001+0.000839*T+0.0002261*T2-0.00000845*T3-0.000000081*T*T3;else deltat=-0.000278+0.000265*T+0.000262*T2;return Jd1+C1-deltat}
function sunLongitude(jdn){const T=(jdn-2451545.0)/36525,T2=T*T,dr=Math.PI/180;const M=357.52910+35999.05030*T-0.0001559*T2-0.00000048*T*T2;const L0=280.46645+36000.76983*T+0.0003032*T2;let DL=(1.914600-0.004817*T-0.000014*T2)*Math.sin(dr*M);DL+=(0.019993-0.000101*T)*Math.sin(dr*2*M)+0.000290*Math.sin(dr*3*M);let L=(L0+DL)*dr;L=L-Math.PI*2*Math.floor(L/(Math.PI*2));return L}
function getNewMoonDay(k,tz=TZ){return Math.floor(newMoon(k)+0.5+tz/24)}
function getSunLongitude(dayNumber,tz=TZ){return Math.floor(sunLongitude(dayNumber-0.5-tz/24)/Math.PI*6)}
function lunarMonth11(yy,tz=TZ){const off=jdFromDate(31,12,yy)-2415021,k=Math.floor(off/29.530588853),nm=getNewMoonDay(k,tz),sunLong=getSunLongitude(nm,tz);return sunLong>=9?getNewMoonDay(k-1,tz):nm}
function leapMonthOffset(a11,tz=TZ){const k=Math.floor(0.5+(a11-2415021.076998695)/29.530588853);let last=0,i=1,arc=getSunLongitude(getNewMoonDay(k+i,tz),tz);do{last=arc;i++;arc=getSunLongitude(getNewMoonDay(k+i,tz),tz)}while(arc!==last&&i<14);return i-1}
function solarToLunar(dd,mm,yy,tz=TZ){const dayNumber=jdFromDate(dd,mm,yy),k=Math.floor((dayNumber-2415021.076998695)/29.530588853);let monthStart=getNewMoonDay(k+1,tz);if(monthStart>dayNumber)monthStart=getNewMoonDay(k,tz);let a11=lunarMonth11(yy,tz),b11=a11,lunarYear;if(a11>=monthStart){lunarYear=yy;a11=lunarMonth11(yy-1,tz)}else{lunarYear=yy+1;b11=lunarMonth11(yy+1,tz)}const lunarDay=dayNumber-monthStart+1,diff=Math.floor((monthStart-a11)/29);let lunarLeap=0,lunarMonth=diff+11;if(b11-a11>365){const leapDiff=leapMonthOffset(a11,tz);if(diff>=leapDiff){lunarMonth=diff+10;if(diff===leapDiff)lunarLeap=1}}if(lunarMonth>12)lunarMonth-=12;if(lunarMonth>=11&&diff<4)lunarYear-=1;return {day:lunarDay,month:lunarMonth,year:lunarYear,leap:lunarLeap}}
function lunarForDate(date){return solarToLunar(date.getDate(),date.getMonth()+1,date.getFullYear(),TZ)}

function elementRelation(dayEl,userEl){if(dayEl===userEl)return {score:6,label:`Đồng hành ${dayEl}`,detail:`Can ngày và Can năm sinh cùng hành ${dayEl}`};if(GENERATES[dayEl]===userEl)return {score:10,label:`Ngày sinh trợ tuổi`,detail:`${dayEl} sinh ${userEl}: mô hình cộng điểm hỗ trợ`};if(GENERATES[userEl]===dayEl)return {score:3,label:`Tuổi sinh cho ngày`,detail:`${userEl} sinh ${dayEl}: thuận nhưng hao lực hơn`};if(CONTROLS[dayEl]===userEl)return {score:-10,label:`Ngày khắc tuổi`,detail:`${dayEl} khắc ${userEl}: mô hình trừ điểm`};if(CONTROLS[userEl]===dayEl)return {score:-4,label:`Tuổi khắc ngày`,detail:`${userEl} khắc ${dayEl}: có độ ma sát`};return {score:0,label:"Ngũ hành trung tính",detail:"Không có quan hệ sinh/khắc trực tiếp trong mô hình"}}
function fmtVN(date,opts={weekday:"long",day:"2-digit",month:"2-digit",year:"numeric"}){return new Intl.DateTimeFormat("vi-VN",opts).format(date)}
function iso(date){const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,"0"),d=String(date.getDate()).padStart(2,"0");return `${y}-${m}-${d}`}
function addDays(date,n){const x=new Date(date);x.setDate(x.getDate()+n);return x}
function numInfo(n){return NUM_TEXT[n]||[`Số ${n}`,"một chỉ số bổ sung trong hồ sơ","đối chiếu với các chỉ số khác thay vì đọc riêng lẻ"]}
function genderLabel(g){return g==="male"?"Nam":g==="female"?"Nữ":g==="other"?"Khác":"Chưa chọn"}
function kuaForYear(year,gender){
 if(!["male","female"].includes(gender))return null;
 const factor=reduceNum(sumDigits(String(year).slice(-2)),false);let n;
 if(year>=2000)n=gender==="male"?9-factor:6+factor;else n=gender==="male"?10-factor:5+factor;
 n=reduceNum(n,false);if(n===0)n=9;if(n===5)n=gender==="male"?2:8;
 return {number:n,...KUA_INFO[n]};
}
function numerologyGenderInsight(g,lp,ex,so,pe){
 if(g==="male")return `<strong>Hồ sơ Nam:</strong> giới tính không làm thay đổi các con số đã tính. Lớp diễn giải này chỉ bổ sung câu hỏi phản tư về cách bạn thể hiện vai trò và trách nhiệm. Với trục Chủ đạo <strong>${lp}</strong> và Biểu đạt <strong>${ex}</strong>, hãy kiểm tra xem bạn có đang cố tự xử lý mọi việc thay vì chia sẻ nhu cầu hay không. Linh hồn <strong>${so}</strong> so với Nhân cách <strong>${pe}</strong> cho thấy điều đáng quan sát là khoảng cách giữa điều bạn thực sự cần và hình ảnh mạnh mẽ/ổn định bạn muốn duy trì. Khi hai lớp lệch nhau, ưu tiên giao tiếp rõ ràng thay vì mặc định rằng người khác sẽ tự hiểu.`;
 if(g==="female")return `<strong>Hồ sơ Nữ:</strong> giới tính không làm thay đổi phép tính thần số học. Lớp này tập trung vào cách cân bằng tự chủ, ranh giới và trách nhiệm trong các mối quan hệ. Với Chủ đạo <strong>${lp}</strong> và Biểu đạt <strong>${ex}</strong>, hãy quan sát xem bạn đang chủ động theo giá trị của mình hay đang điều chỉnh quá nhiều theo kỳ vọng bên ngoài. Linh hồn <strong>${so}</strong> và Nhân cách <strong>${pe}</strong> hữu ích để nhận ra phần nhu cầu bên trong nào chưa được biểu đạt đủ rõ.`;
 if(g==="other")return `<strong>Hồ sơ không dùng phân loại Nam/Nữ:</strong> các chỉ số thần số học vẫn được tính đầy đủ. Hệ thống không ép một diễn giải nhị phân theo giới tính; hãy đọc Chủ đạo <strong>${lp}</strong>, Biểu đạt <strong>${ex}</strong>, Linh hồn <strong>${so}</strong> và Nhân cách <strong>${pe}</strong> theo trải nghiệm cá nhân của bạn.`;
 return `Bạn chưa chọn giới tính trong hồ sơ. Các phép tính thần số học vẫn chính xác theo dữ liệu tên/ngày sinh, nhưng phần diễn giải theo Nam/Nữ đang được bỏ qua.`;
}
function horoscopeGenderInsight(g,kua,yc,dc,hc){
 if(!kua)return g==="other"?`Cung phi Bát Trạch truyền thống dùng công thức phân biệt Nam/Nữ, nên hệ thống không tự quy đổi khi hồ sơ chọn “Khác”. Các phần Can Chi, Tam hợp, đối xung và ngũ hành vẫn giữ nguyên.`:`Chọn Nam hoặc Nữ trong hồ sơ để kích hoạt lớp Cung phi. Can Chi, Tam hợp và đối xung vẫn được tính bình thường dù chưa chọn giới tính.`;
 const focus=g==="male"?"Trong lớp diễn giải Nam, nên quan sát cách bạn dùng tính chủ động, trách nhiệm và ranh giới trong công việc lẫn quan hệ.":"Trong lớp diễn giải Nữ, nên quan sát cách bạn cân bằng tự chủ, ranh giới và trách nhiệm cảm xúc trong các mối quan hệ và công việc.";
 return `<strong>${genderLabel(g)} • Cung ${kua.gua} ${kua.element} • Quái số ${kua.number}.</strong> Thuộc <strong>${kua.group}</strong>; nhóm phương vị tham khảo: ${kua.directions}. ${focus} Trụ năm <strong>${yc.stem} ${yc.branch}</strong>, trụ ngày <strong>${dc.stem} ${dc.branch}</strong>${hc?` và trụ giờ <strong>${hc.stem} ${hc.branch}</strong>`:""} là lớp Can Chi không đổi theo giới tính.`;
}

function renderHeader(){
 if(!profile){$("#profileAvatar").textContent="?";$("#profileNameTop").textContent="Chưa có hồ sơ";$("#profileMetaTop").textContent="Thiết lập để cá nhân hóa";$("#homeName").textContent="Tạo hồ sơ để bắt đầu";$("#homeDateLabel").textContent="CHƯA CÓ DỮ LIỆU";$("#homeSummary").textContent="Ngày sinh sẽ được dùng cho các phép tính định lượng.";["homeLife","homeYearPillar","homeLunar","homeZodiac"].forEach(id=>$("#"+id).textContent="—");$("#homeSigil").textContent="✦";return}
 const bd=new Date(profile.birthDate+"T12:00:00"),yc=yearCanChi(bd.getFullYear()),lu=lunarForDate(bd),z=western(profile.birthDate),lp=lifePath(profile.birthDate);
 $("#profileAvatar").textContent=profile.fullName.trim().charAt(0).toUpperCase();$("#profileNameTop").textContent=profile.fullName;$("#profileMetaTop").textContent=`${genderLabel(profile.gender)} • ${yc.stem} ${yc.branch} • ${z.name}`;
 $("#homeName").textContent=profile.fullName;$("#homeDateLabel").textContent=`SINH ${fmtVN(bd,{day:"2-digit",month:"2-digit",year:"numeric"})}`;$("#homeSummary").textContent=`${yc.icon} ${ANIMALS[yc.branchIndex]} • ${yc.element} • ${z.icon} ${z.name}`;
 $("#homeLife").textContent=lp;$("#homeYearPillar").textContent=`${yc.stem} ${yc.branch}`;$("#homeLunar").textContent=`${lu.day}/${lu.month}${lu.leap?"N":""}/${lu.year}`;$("#homeZodiac").textContent=z.name;$("#homeSigil").textContent=yc.icon;
}

function renderNumerology(){
 const box=$("#numerologyMetrics"),form=$("#numerologyFormula"),cycle=$("#cycleStack");
 if(!profile){box.innerHTML=[1,2,3,4,5,6,7,8].map(()=>`<article class="metric-card"><small>CHỈ SỐ</small><strong>—</strong><span>Cần hồ sơ</span></article>`).join("");$("#numerologyReading").textContent="Tạo hồ sơ để xem phân tích.";$("#numerologyGenderTitle").textContent="Diễn giải theo hồ sơ Nam/Nữ";$("#numerologyGenderBadge").textContent="Cần hồ sơ";$("#numerologyGenderReading").textContent="Chọn giới tính trong hồ sơ để bổ sung lớp phân tích.";cycle.innerHTML="";form.innerHTML="";return}
 const ds=profile.birthDate,name=profile.fullName, lp=lifePath(ds),ex=expressionNum(name),so=soulNum(name),pe=personalityNum(name),bd=birthdayNum(ds),at=attitudeNum(ds),ma=maturityNum(name,ds),py=personalYear(ds);
 const metrics=[
  ["SỐ CHỦ ĐẠO",lp,numInfo(lp)[0],"Tổng toàn bộ chữ số ngày sinh"],
  ["SỐ BIỂU ĐẠT",ex,numInfo(ex)[0],"Tổng giá trị chữ cái họ tên"],
  ["SỐ LINH HỒN",so,numInfo(so)[0],"Chỉ tính nguyên âm trong họ tên"],
  ["SỐ NHÂN CÁCH",pe,numInfo(pe)[0],"Chỉ tính phụ âm trong họ tên"],
  ["SỐ NGÀY SINH",bd,numInfo(bd)[0],"Rút gọn ngày sinh"],
  ["SỐ THÁI ĐỘ",at,numInfo(at)[0],"Tháng sinh + ngày sinh"],
  ["SỐ TRƯỞNG THÀNH",ma,numInfo(ma)[0],"Chủ đạo + Biểu đạt"],
  ["NĂM CÁ NHÂN",py,`Chu kỳ ${py}`,`Theo năm ${new Date().getFullYear()}`]
 ];
 box.innerHTML=metrics.map((m,i)=>`<article class="metric-card ${i===0?"primary-metric":""}"><small>${m[0]}</small><strong>${m[1]}</strong><span>${m[2]}</span><p>${m[3]}</p></article>`).join("");
 const li=numInfo(lp),ei=numInfo(ex),si=numInfo(so),pi=numInfo(pe);
 $("#numerologyReading").innerHTML=`<strong>Trục chính ${lp} — ${li[0]}:</strong> thiên về ${li[1]}; điểm cần chú ý là ${li[2]}.<br><br><strong>Cách bạn đưa năng lực ra bên ngoài (Biểu đạt ${ex})</strong> nghiêng về ${ei[1]}. Trong khi đó, <strong>Linh hồn ${so}</strong> gợi động lực bên trong thiên về ${si[1]}, còn <strong>Nhân cách ${pe}</strong> mô tả lớp biểu hiện người khác dễ nhận thấy: ${pi[1]}.<br><br>Khi các chỉ số khác nhau, không cần ép chúng thành một “tính cách duy nhất”; có thể hiểu đó là khác biệt giữa động lực bên trong, cách biểu hiện và cách bạn vận hành trong thực tế.`;
 $("#numerologyGenderTitle").textContent=`${genderLabel(profile.gender)} • lớp diễn giải bổ sung`;$("#numerologyGenderBadge").textContent=genderLabel(profile.gender);$("#numerologyGenderReading").innerHTML=numerologyGenderInsight(profile.gender,lp,ex,so,pe);
 const now=new Date(),pm=personalMonth(ds,now),pd=personalDay(ds,now);$("#currentDateBadge").textContent=fmtVN(now,{day:"2-digit",month:"2-digit",year:"numeric"});
 cycle.innerHTML=[[py,"Năm cá nhân",CYCLE_TEXT[py],String(now.getFullYear())],[pm,"Tháng cá nhân",CYCLE_TEXT[pm],`Tháng ${now.getMonth()+1}`],[pd,"Ngày cá nhân",CYCLE_TEXT[pd],fmtVN(now,{day:"2-digit",month:"2-digit"})]].map(x=>`<div class="cycle-row"><div class="cycle-num">${x[0]}</div><div><strong>${x[1]}</strong><small>${x[2]}</small></div><span>${x[3]}</span></div>`).join("");
 const clean=stripName(name),vowels=[...clean].filter(c=>"AEIOUY".includes(c)).join(""),cons=[...clean].filter(c=>!"AEIOUY".includes(c)).join("");
 form.innerHTML=[
  ["Số chủ đạo",`digits(${ds}) → tổng ${sumDigits(ds)} → rút gọn = ${lp}`],
  ["Số biểu đạt",`${clean || "—"} → Pythagoras 1–9 → ${ex}`],
  ["Số linh hồn",`${vowels || "—"} → chỉ nguyên âm → ${so}`],
  ["Số nhân cách",`${cons || "—"} → chỉ phụ âm → ${pe}`],
  ["Số thái độ",`${Number(ds.split("-")[1])} + ${Number(ds.split("-")[2])} → ${at}`],
  ["Số trưởng thành",`${lp} + ${ex} → ${ma}`]
 ].map(x=>`<div class="formula-item"><b>${x[0]}</b><code>${x[1]}</code></div>`).join("");
}

function renderHoroscope(){
 if(!profile){
  $("#horoscopeName").textContent="Chưa có dữ liệu";$("#horoscopeSub").textContent="Thiết lập ngày sinh để phân tích.";$("#horoscopeTags").innerHTML="";
  ["yearPillar","dayPillar","hourPillar","lunarDate","elementTitle","westernZodiac"].forEach(id=>$("#"+id).textContent="—");$("#compatibilityBox").innerHTML="";$("#elementBars").innerHTML="";$("#horoscopeReading").textContent="Chưa đủ dữ liệu.";
  $("#genderAstroBadge").textContent="Cần hồ sơ";$("#genderAstroBox").innerHTML="";$("#genderAstroReading").textContent="Chọn giới tính Nam hoặc Nữ trong hồ sơ để hệ thống đánh dấu Cung phi tương ứng.";return
 }
 const bd=new Date(profile.birthDate+"T12:00:00"),yc=yearCanChi(bd.getFullYear()),dc=dayCanChi(bd),hc=hourCanChi(bd,profile.birthTime),lu=lunarForDate(bd),z=western(profile.birthDate),rel=relations(yc.branchIndex);
 const maleKua=kuaForYear(lu.year,"male"),femaleKua=kuaForYear(lu.year,"female"),selectedKua=kuaForYear(lu.year,profile.gender);
 $("#zodiacOrb").textContent=yc.icon;$("#horoscopeName").textContent=profile.fullName;$("#horoscopeSub").textContent=`${genderLabel(profile.gender)} • Dương lịch ${fmtVN(bd,{day:"2-digit",month:"2-digit",year:"numeric"})}${profile.birthTime?` • ${profile.birthTime}`:""}${profile.birthPlace?` • ${profile.birthPlace}`:""}`;
 $("#horoscopeTags").innerHTML=[genderLabel(profile.gender),`${yc.stem} ${yc.branch}`,yc.element,`${z.icon} ${z.name}`,`Âm ${lu.day}/${lu.month}${lu.leap?" nhuận":""}`].map(x=>`<span>${x}</span>`).join("");
 $("#yearPillar").textContent=`${yc.stem} ${yc.branch}`;$("#yearAnimal").textContent=`${yc.icon} ${yc.animal} • Can ${yc.element} • Chi ${BRANCH_ELEMENT[yc.branchIndex]}`;$("#yearPillarDesc").innerHTML=`<b>Thiên Can:</b> ${stemFull(yc.stemIndex)}.<br><b>Địa Chi:</b> ${branchFull(yc.branchIndex)}.<br><b>Năm dương lịch:</b> ${bd.getFullYear()}.`;
 $("#dayPillar").textContent=`${dc.stem} ${dc.branch}`;$("#dayAnimal").textContent=`${ICONS[dc.branchIndex]} ${dc.animal} • Can ${dc.element} • Chi ${BRANCH_ELEMENT[dc.branchIndex]}`;$("#dayPillarDesc").innerHTML=`<b>Thiên Can ngày:</b> ${stemFull(dc.stemIndex)}.<br><b>Địa Chi ngày:</b> ${branchFull(dc.branchIndex)}.<br><b>Cách tính:</b> Julian Day Number ${dc.jd}.`;
 if(hc){$("#hourPillar").textContent=`${hc.stem} ${hc.branch}`;$("#hourAnimal").textContent=`${ICONS[hc.branchIndex]} giờ ${hc.branch} • Can ${hc.element} • Chi ${BRANCH_ELEMENT[hc.branchIndex]}`;$("#hourPillarDesc").innerHTML=`<b>Giờ sinh:</b> ${profile.birthTime}.<br><b>Thiên Can giờ:</b> ${stemFull(hc.stemIndex)}.<br><b>Địa Chi giờ:</b> ${branchFull(hc.branchIndex)}.`}else{$("#hourPillar").textContent="Chưa nhập";$("#hourAnimal").textContent="—";$("#hourPillarDesc").innerHTML="Bổ sung <b>giờ sinh</b> để tính rõ Thiên Can giờ, Địa Chi giờ và con giáp của thời thần."}
 $("#lunarDate").textContent=`${lu.day}/${lu.month}/${lu.year}${lu.leap?" N":""}`;$("#lunarMeta").textContent=lu.leap?"Tháng nhuận • UTC+7":"Âm lịch Việt Nam • UTC+7";$("#lunarDesc").textContent="Quy đổi bằng mô hình thiên văn Sóc + kinh độ Mặt Trời.";
 const elements=[yc.element,dc.element,...(hc?[hc.element]:[])],counts={Mộc:0,Hỏa:0,Thổ:0,Kim:0,Thủy:0};elements.forEach(e=>counts[e]++);const total=elements.length;
 $("#elementTitle").textContent=`${yc.element} — Thiên Can năm ${yc.stem}`;
 $("#elementDesc").innerHTML=`<b>Thiên Can năm:</b> ${stemFull(yc.stemIndex)} → hành <b>${yc.element}</b>.<br><b>Thiên Can ngày:</b> ${stemFull(dc.stemIndex)} → hành <b>${dc.element}</b>.${hc?`<br><b>Thiên Can giờ:</b> ${stemFull(hc.stemIndex)} → hành <b>${hc.element}</b>.`:""}<br><b>Ý nghĩa lớp Can năm:</b> ${ELEMENT_TEXT[yc.element]}. Biểu đồ bên trên chỉ đếm hành của các <b>Thiên Can</b> đang có dữ liệu; không phải Bát tự/Tứ trụ đầy đủ.`;
 $("#elementBars").innerHTML=Object.entries(counts).map(([e,c])=>`<div class="element-row"><span>${e} — ${c}/${total} Can</span><div class="element-track"><div class="element-fill" style="width:${Math.round(c/total*100)}%"></div></div><b>${Math.round(c/total*100)}%</b></div>`).join("");
 const tri=trineInfo(yc.branchIndex),four=fourClashInfo(yc.branchIndex),harm=SIX_HARMONY[yc.branchIndex];
 const relationMain=[
  ["Địa Chi năm sinh",branchFull(yc.branchIndex),`Tuổi ${yc.animal}; đây là Chi dùng làm mốc để đọc các quan hệ bên dưới.`],
  ["Tam hợp",`${tri.name} • ${tri.bureau}`,`Ba Chi trong nhóm: ${tri.members.map(branchFull).join(" • ")}. Hai Chi tam hợp còn lại với ${yc.branch}: ${rel.trine.map(branchFull).join(" và ")}.`],
  ["Lục hợp / Nhị hợp",`${branchFull(yc.branchIndex)} ↔ ${branchFull(harm)}`,`Cặp hợp trực tiếp của Chi ${yc.branch} là ${BRANCHES[harm]}.`],
  ["Lục xung / Đối xung",`${branchFull(yc.branchIndex)} ↔ ${branchFull(rel.clash)}`,`Đây là Chi nằm đối diện trực tiếp với ${yc.branch} trong vòng 12 Địa Chi.`],
  ["Tứ hành xung",four.name,`Nhóm gồm: ${four.members.map(branchFull).join(" • ")}. Không phải mọi cặp trong nhóm đều đối xung trực tiếp.`]
 ];
 const relationExtra=[
  ["Chi ngày sinh",branchFull(dc.branchIndex),`So với Chi năm ${yc.branch}: ${relationBetween(yc.branchIndex,dc.branchIndex)}.`],
  ["Chi giờ sinh",hc?branchFull(hc.branchIndex):"Chưa nhập giờ sinh",hc?`So với Chi năm ${yc.branch}: ${relationBetween(yc.branchIndex,hc.branchIndex)}.`:"Nhập giờ sinh để xác định Địa Chi giờ."],
  ["Nam cùng năm sinh",`${tri.name} • đối xung ${yc.branch} ↔ ${BRANCHES[rel.clash]}`,`Các quan hệ Địa Chi không đổi theo giới tính.`],
  ["Nữ cùng năm sinh",`${tri.name} • đối xung ${yc.branch} ↔ ${BRANCHES[rel.clash]}`,`Khác biệt Nam/Nữ được thể hiện ở Cung phi Bát Trạch, không phải Tam hợp.`]
 ];
 const relationHTML=x=>`<div class="relation-item"><div class="relation-label">${x[0]}</div><strong>${x[1]}</strong><p>${x[2]}</p></div>`;
 $("#compatibilityBox").innerHTML=relationMain.map(relationHTML).join("")+`<details class="relation-more"><summary>Xem thêm Chi ngày, Chi giờ và ghi chú Nam/Nữ</summary><div class="relation-more-body">${relationExtra.map(relationHTML).join("")}</div></details>`;
 $("#westernZodiac").textContent=`${z.icon} ${z.name}`;$("#westernDesc").innerHTML=`<b>Ngày sinh dương lịch:</b> ${fmtVN(bd,{day:"2-digit",month:"2-digit",year:"numeric"})}.<br><b>Khoảng cung ${z.name}:</b> ${zodiacRange(z.name)}.<br><b>Diễn giải tham khảo:</b> ${z.text}.`;
 $("#genderAstroBadge").textContent=`Hồ sơ ${genderLabel(profile.gender)}`;
 $("#genderAstroBox").innerHTML=[
  {g:"male",label:"NAM",kua:maleKua},{g:"female",label:"NỮ",kua:femaleKua}
 ].map(x=>`<article class="gender-kua ${profile.gender===x.g?"active":""}"><div class="gender-kua-head"><span>${x.label}</span>${profile.gender===x.g?"<b>ĐANG DÙNG</b>":""}</div><strong>Quái số ${x.kua.number} • Cung ${x.kua.gua}</strong><p><b>Ngũ hành cung:</b> ${x.kua.element}</p><p><b>Nhóm mệnh:</b> ${x.kua.group}</p><small><b>Nhóm phương vị tham khảo:</b> ${x.kua.directions}</small></article>`).join("");
 $("#genderAstroReading").innerHTML=`<strong>Địa Chi không đổi theo giới tính:</strong> ${branchFull(yc.branchIndex)} thuộc Tam hợp <strong>${tri.name} — ${tri.bureau}</strong>; Lục hợp với <strong>${BRANCHES[harm]}</strong>; đối xung trực tiếp với <strong>${BRANCHES[rel.clash]}</strong>; nằm trong nhóm Tứ hành xung <strong>${four.name}</strong>.<br><br><strong>Phần thay đổi theo Nam/Nữ:</strong> cùng năm âm lịch ${lu.year}, <strong>Nam</strong> dùng Quái số ${maleKua.number} — cung ${maleKua.gua} — ${maleKua.element} — ${maleKua.group}; <strong>Nữ</strong> dùng Quái số ${femaleKua.number} — cung ${femaleKua.gua} — ${femaleKua.element} — ${femaleKua.group}.<br><br>${horoscopeGenderInsight(profile.gender,selectedKua,yc,dc,hc)}`;
 $("#horoscopeReading").innerHTML=`Hồ sơ <strong>${genderLabel(profile.gender)}</strong> có trụ năm <strong>${yc.stem} ${yc.branch}</strong> đặt nền ở hành <strong>${yc.element}</strong> — ${ELEMENT_TEXT[yc.element]}. Trụ ngày <strong>${dc.stem} ${dc.branch}</strong> mang Can ${dc.stem} thuộc <strong>${dc.element}</strong>${hc?`, trong khi giờ sinh tạo trụ <strong>${hc.stem} ${hc.branch}</strong> thuộc ${hc.element}`:""}.<br><br>Ở lớp phương Tây, <strong>${z.name}</strong> bổ sung mô-típ ${z.text}. ${selectedKua?`Cung phi theo hồ sơ ${genderLabel(profile.gender)} là <strong>${selectedKua.gua} ${selectedKua.element}</strong>, thuộc ${selectedKua.group}.`:"Chưa áp dụng Cung phi Nam/Nữ."} Các lớp này là hệ quy chiếu văn hóa để tự quan sát, không phải mô hình khoa học dự đoán tính cách hay tương lai.`;
}

function hashString(str){let h=2166136261>>>0;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=seed;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function normalizedQuestion(q){return (q||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^\p{L}\p{N}]+/gu," ").trim()}
function tarotTopicInterpret(topic,position,meaning){const lens=TOPIC_LENS[topic]||TOPIC_LENS.general;const verbs=["Nền tảng của vấn đề đang gợi","Trọng tâm hiện tại đang cho thấy","Hướng xử lý đáng cân nhắc là"];return `${verbs[position]} ${lens[position]}: ${meaning}.`}
function populateTarotPresets(){const topic=$("#tarotTopic").value,sel=$("#tarotPresetQuestion"),items=TAROT_PRESETS[topic]||TAROT_PRESETS.general,old=sel.value;sel.innerHTML=items.map(q=>`<option value="${q.replace(/"/g,"&quot;")}">${q}</option>`).join("");if(items.includes(old))sel.value=old}
function updateTarotModeUI(){
 const mode=$("#tarotMode").value;$("#tarotTopicField").classList.toggle("hidden",mode==="auto");$("#tarotPresetField").classList.toggle("hidden",mode!=="preset");$("#tarotQuestionField").classList.toggle("hidden",mode!=="custom");
 if(mode==="preset")populateTarotPresets();
 const info={
  auto:["Auto toàn cảnh 6 lá","Không cần chọn chủ đề hay nhập câu hỏi. Hệ thống đọc 6 vùng: tổng quan, tình cảm, công việc, tài chính, phát triển và điều cần ưu tiên."],
  open:["Không câu hỏi • 3 lá","Chỉ cần chọn chủ đề. Ba lá lần lượt mô tả nền tảng, trọng tâm hiện tại và hướng tiếp cận."],
  preset:["Câu hỏi gợi ý • 3 lá","Chọn chủ đề rồi chọn một câu hỏi được viết sẵn để trải bài có trọng tâm rõ."],
  custom:["Tự đặt câu hỏi • 3 lá","Viết câu hỏi của riêng bạn. Câu hỏi càng cụ thể, phần diễn giải theo ngữ cảnh càng dễ dùng."]
 }[mode];$("#tarotModeInfo").innerHTML=`<b>${info[0]}</b><p>${info[1]}</p>`;
}
function drawTarot(){
 if(!profile){openProfile();return}
 const mode=$("#tarotMode").value;let topic=mode==="auto"?"auto":$("#tarotTopic").value,q="",qKey="",count=3,positions=[],domains=[];
 if(mode==="auto"){
  q="Toàn cảnh cá nhân hôm nay";qKey="auto-all";count=AUTO_DOMAINS.length;domains=AUTO_DOMAINS;positions=AUTO_DOMAINS.map(x=>x.label);
 }else if(mode==="open"){
  q=`Không câu hỏi • ${TOPIC_NAME[topic]}`;qKey=`open-${topic}`;positions=["NỀN TẢNG","TRỌNG TÂM HIỆN TẠI","HƯỚNG TIẾP CẬN"];
 }else if(mode==="preset"){
  q=$("#tarotPresetQuestion").value||TAROT_PRESETS[topic][0];qKey=normalizedQuestion(q);positions=["NỀN TẢNG","TRỌNG TÂM HIỆN TẠI","HƯỚNG TIẾP CẬN"];
 }else{
  q=$("#tarotQuestion").value.trim();if(q.length<6){alert("Hãy nhập câu hỏi rõ hơn (ít nhất 6 ký tự), hoặc chọn chế độ Auto/Không câu hỏi.");return}qKey=normalizedQuestion(q);positions=["NỀN TẢNG","TRỌNG TÂM HIỆN TẠI","HƯỚNG TIẾP CẬN"];
 }
 const today=iso(new Date()),base=[stripName(profile.fullName),profile.birthDate,profile.birthTime||"",profile.gender||"",mode,topic,qKey,today].join("|"),seed=hashString(base),rand=rng(seed),pool=TAROT.map((_,i)=>i),picks=[];
 for(let i=0;i<count;i++){const idx=Math.floor(rand()*pool.length),ci=pool.splice(idx,1)[0];picks.push({card:TAROT[ci],rev:rand()<.32})}
 $("#tarotEmpty").classList.add("hidden");$("#tarotResult").classList.remove("hidden");$("#tarotDeepPanel").classList.remove("hidden");$("#tarotResultQuestion").textContent=q;$("#tarotSessionCode").textContent=(seed>>>0).toString(16).toUpperCase().padStart(8,"0");
 $("#tarotSpreadLabel").textContent=mode==="auto"?"TRẢI BÀI AUTO • 6 LÁ":"TRẢI BÀI 3 LÁ";$("#tarotAnalysisTitle").textContent=mode==="auto"?"Toàn cảnh theo 6 vùng đời sống":"Mạch chính của trải bài";$("#tarotAnalysisBadge").textContent=TAROT_MODE_NAME[mode];
 const yc=yearCanChi(new Date(profile.birthDate+"T12:00:00").getFullYear()),lp=lifePath(profile.birthDate),ctx=[TAROT_MODE_NAME[mode],`Ngày ${fmtVN(new Date(),{day:"2-digit",month:"2-digit",year:"numeric"})}`,`Hồ sơ ${genderLabel(profile.gender)}`,`Số chủ đạo ${lp}`,`${yc.stem} ${yc.branch}`];if(mode!=="auto")ctx.splice(1,0,TOPIC_NAME[topic]);$("#tarotContext").innerHTML=ctx.map(x=>`<span>${x}</span>`).join("");
 const grid=$("#tarotGrid");grid.classList.toggle("auto-spread",mode==="auto");
 grid.innerHTML=picks.map((p,i)=>{const [roman,name,icon,up,rv]=p.card,meaning=p.rev?rv:up;const interp=mode==="auto"?`${domains[i].title}: ${domains[i].lens}. Lá này nhấn mạnh ${meaning}.`:tarotTopicInterpret(topic,i,meaning);return `<article class="tarot-reading"><div class="tarot-pos">${positions[i]}</div><div class="tarot-card-face ${p.rev?"reversed":""}"><div class="tarot-roman">${roman}</div><div class="tarot-art">${icon}</div><div class="tarot-name">${name}</div><div class="tarot-state">${p.rev?"NGƯỢC":"XUÔI"}</div></div><div class="tarot-meaning"><b>${mode==="auto"?domains[i].title:(p.rev?"Mặt cần xem lại":"Ý nghĩa trọng tâm")}</b><p>${meaning}.</p><p>${interp}</p></div></article>`}).join("");
 const meanings=picks.map(p=>p.rev?p.card[4]:p.card[3]),revCount=picks.filter(p=>p.rev).length;
 if(mode==="auto"){
  $("#tarotSummary").innerHTML=`<h4>1. Toàn cảnh hôm nay</h4><p>Trải bài dùng sáu vị trí độc lập thay vì cố ép mọi vấn đề vào một câu hỏi. Có <strong>${revCount}/${count} lá ngược</strong>; trong mô hình này, lá ngược được đọc như vùng cần rà soát hoặc điều chỉnh nhiều hơn, không phải mặc định là “xấu”.</p>`+domains.map((d,i)=>`<h4>${i+2}. ${d.title} — ${picks[i].card[1]}</h4><p>Ở vùng <strong>${d.lens}</strong>, thông điệp trọng tâm là <strong>${meanings[i]}</strong>. Hãy đối chiếu với dữ kiện thực tế trong 7–30 ngày gần nhất trước khi coi đây là một ưu tiên.</p>`).join("")+`<h4>8. Cách sử dụng kết quả</h4><p>Chọn tối đa 1–2 vùng đang phản ánh đúng tình hình nhất để hành động. Các vùng còn lại nên được xem như câu hỏi kiểm tra, không phải dự báo chắc chắn.</p>`;
  $("#tarotActions").innerHTML=[`Chọn 2 trong 6 vùng có liên hệ thực tế rõ nhất với cuộc sống hiện tại.`,`Với vùng “${AUTO_DOMAINS[5].title}”, viết ra một việc nằm trong quyền kiểm soát có thể làm trong 72 giờ.`,`Nếu một lá khiến bạn lo lắng, kiểm tra lại bằng dữ kiện cụ thể thay vì rút lại bài để tìm kết quả dễ chịu hơn.`].map(x=>`<li>${x}</li>`).join("");
 }else{
  const source=mode==="open"?`chủ đề ${TOPIC_NAME[topic].toLowerCase()}`:"câu hỏi đã chọn";
  $("#tarotSummary").innerHTML=`<h4>1. Mạch diễn biến</h4><p>Nền tảng của ${source} xoay quanh <strong>${meanings[0]}</strong>. Ở hiện tại, lá thứ hai chuyển trọng tâm sang <strong>${meanings[1]}</strong>. Lá cuối được đọc như hướng xử lý hoặc điều cần kiểm chứng: <strong>${meanings[2]}</strong>.</p><h4>2. Liên hệ với ${TOPIC_NAME[topic].toLowerCase()}</h4><p>${tarotTopicInterpret(topic,0,meanings[0])} ${tarotTopicInterpret(topic,1,meanings[1])} ${tarotTopicInterpret(topic,2,meanings[2])}</p><h4>3. Điểm cần kiểm chứng ngoài đời thực</h4><p>Phân biệt ba lớp: dữ kiện đã biết, giả định chưa xác nhận và phần bạn có thể chủ động thay đổi. Tarot chỉ có ích khi giúp làm rõ ba lớp này thay vì thay thế quyết định thực tế.</p>`;
  $("#tarotActions").innerHTML=[`Viết ra 1 dữ kiện thực tế đang củng cố hoặc bác bỏ thông điệp của lá ${picks[1].card[1]}.`,`Chọn 1 hành động nhỏ liên quan đến “${TOPIC_LENS[topic][2]}” có thể hoàn thành trong 24–72 giờ.`,`Không rút lại chỉ vì không thích kết quả; nếu đổi câu hỏi hoặc bối cảnh, hãy thay dữ liệu đầu vào trước.`].map(x=>`<li>${x}</li>`).join("");
 }
}
function resetTarot(){$("#tarotResult").classList.add("hidden");$("#tarotDeepPanel").classList.add("hidden");$("#tarotEmpty").classList.remove("hidden");$("#tarotGrid").classList.remove("auto-spread")}

function weekdayFactor(date,purpose){const d=date.getDay();if(["work","contract","study"].includes(purpose)){if(d>=1&&d<=5)return {score:5,label:"Tính thực tiễn ngày làm việc",detail:"Ngày trong tuần thuận hơn cho cơ quan, ký kết hoặc học tập"};return {score:-3,label:"Tính thực tiễn cuối tuần",detail:"Cuối tuần có thể hạn chế lịch cơ quan/dịch vụ"}}if(purpose==="travel"){if(d===6||d===0)return {score:4,label:"Nhịp cuối tuần",detail:"Cộng nhẹ cho mục đích đi lại/du lịch"};return {score:1,label:"Ngày thường",detail:"Không có ưu/nhược điểm lớn theo lịch làm việc"}}return {score:0,label:"Thứ trong tuần",detail:"Không áp dụng hệ số thực tiễn đáng kể"}}
function purposeElementFactor(el,purpose){const preferred={general:["Thổ","Mộc"],work:["Hỏa","Kim"],contract:["Kim","Thổ"],travel:["Thủy","Mộc"],love:["Mộc","Hỏa"],study:["Mộc","Thủy"]};if((preferred[purpose]||[]).includes(el))return {score:6,label:`Can ngày ${el} hợp mục đích`,detail:`Mô hình ưu tiên ${preferred[purpose].join("/")} cho ${PURPOSE_NAME[purpose]}`};return {score:0,label:`Can ngày ${el}`,detail:"Không thuộc nhóm hành ưu tiên của mục đích"}}
function personalDayFactor(date,purpose){if(!profile)return {score:0,label:"Nhịp cá nhân",detail:"Không có hồ sơ"};const n=personalDay(profile.birthDate,date),map={general:[1,6,8],work:[1,4,8],contract:[2,4,8],travel:[3,5,9],love:[2,3,6],study:[4,7,9]};if((map[purpose]||[]).includes(n))return {score:5,label:`Ngày cá nhân ${n}`,detail:`Số ${n} được cộng nhẹ cho mục đích ${PURPOSE_NAME[purpose]}`};return {score:0,label:`Ngày cá nhân ${n}`,detail:"Không có hệ số cộng/trừ cho mục đích đã chọn"}}
function scoreDate(date,purpose){
 const by=yearCanChi(new Date(profile.birthDate+"T12:00:00").getFullYear()),dc=dayCanChi(date),factors=[];let score=58;
 const rel=relations(by.branchIndex);if(rel.trine.includes(dc.branchIndex))factors.push({score:18,label:"Tam hợp địa chi",detail:`Ngày ${dc.branch} nằm trong tam hợp với tuổi ${by.branch}`});else if(dc.branchIndex===rel.clash)factors.push({score:-28,label:"Địa chi đối xung",detail:`Ngày ${dc.branch} đối xung tuổi ${by.branch}`});else if(dc.branchIndex===by.branchIndex)factors.push({score:5,label:"Đồng chi",detail:`Ngày và tuổi cùng chi ${by.branch}`});else factors.push({score:0,label:"Quan hệ địa chi",detail:`${dc.branch} không tam hợp/đối xung trực tiếp với ${by.branch}`});
 factors.push(elementRelation(dc.element,by.element));factors.push(purposeElementFactor(dc.element,purpose));factors.push(weekdayFactor(date,purpose));factors.push(personalDayFactor(date,purpose));
 factors.forEach(f=>score+=f.score);score=Math.max(12,Math.min(96,score));return {date,score,dc,lunar:lunarForDate(date),factors}
}
function rankLabel(s){return s>=80?["Rất phù hợp","excellent"]:s>=68?["Khá phù hợp","good"]:s>=52?["Trung tính","neutral"]:["Nên cân nhắc","low"]}
function scanDates(){
 if(!profile){openProfile();return}const fv=$("#dateFrom").value,tv=$("#dateTo").value,p=$("#datePurpose").value;if(!fv||!tv){alert("Vui lòng chọn đủ từ ngày và đến ngày.");return}const from=new Date(fv+"T12:00:00"),to=new Date(tv+"T12:00:00"),diff=Math.round((to-from)/86400000);if(diff<0){alert("Đến ngày phải sau hoặc bằng từ ngày.");return}if(diff>60){alert("Khoảng phân tích tối đa 60 ngày.");return}
 dateCache=[];for(let i=0;i<=diff;i++)dateCache.push(scoreDate(addDays(from,i),p));dateCache.sort((a,b)=>b.score-a.score||a.date-b.date);showAllDates=false;const best=dateCache[0],good=dateCache.filter(x=>x.score>=68).length,by=yearCanChi(new Date(profile.birthDate+"T12:00:00").getFullYear());
 $("#bestDate").textContent=fmtVN(best.date,{day:"2-digit",month:"2-digit"});$("#bestDateMeta").textContent=`${fmtVN(best.date,{weekday:"short",day:"2-digit",month:"2-digit",year:"numeric"})} • ${best.dc.stem} ${best.dc.branch}`;$("#bestScore").textContent=best.score;$("#goodDateCount").textContent=good;$("#dateProfileBranch").textContent=`${by.stem} ${by.branch}`;$("#dateProfileElement").textContent=`Tuổi ${by.animal} • ${by.element}`;$("#dateRankingTitle").textContent=`${PURPOSE_NAME[p]} — xếp từ phù hợp cao xuống thấp`;renderDateList()
}
function renderDateList(){const list=showAllDates?dateCache:dateCache.slice(0,10);$("#toggleAllDates").classList.toggle("hidden",dateCache.length<=10);$("#toggleAllDates").textContent=showAllDates?"Thu gọn":"Xem tất cả";$("#dateResults").innerHTML=list.map((x,index)=>{const [label,cls]=rankLabel(x.score);return `<article class="date-item"><div class="date-main"><div class="date-cal"><small>${fmtVN(x.date,{month:"short"})}</small><strong>${String(x.date.getDate()).padStart(2,"0")}</strong><small>${fmtVN(x.date,{weekday:"short"})}</small></div><div class="date-info"><strong>${index===0?"⭐ ":""}${x.dc.stem} ${x.dc.branch} • Âm ${x.lunar.day}/${x.lunar.month}${x.lunar.leap?"N":""}</strong><p>${label}. ${index===0?"Đây là ngày đứng đầu trong khoảng đã chọn.":"Bấm bên dưới nếu muốn xem lý do cộng/trừ điểm."}</p></div><div class="score-badge ${cls}"><strong>${x.score}</strong><small>${label}</small></div></div><details class="factor-details"><summary>Vì sao ngày này được ${x.score} điểm?</summary><div class="score-breakdown">${x.factors.map(f=>`<div class="factor ${f.score>0?"plus":f.score<0?"minus":"zero"}"><span><b>${f.label}</b><br>${f.detail}</span><b>${f.score>0?"+":""}${f.score}</b></div>`).join("")}</div></details></article>`}).join("")}
function initDates(){const t=new Date();$("#dateFrom").value=iso(t);$("#dateTo").value=iso(addDays(t,21))}
function openProfile(){if(profile){$("#fullName").value=profile.fullName||"";$("#birthDate").value=profile.birthDate||"";$("#birthTime").value=profile.birthTime||"";$("#gender").value=profile.gender||"";$("#birthPlace").value=profile.birthPlace||"";$("#privacyAgree").checked=true}$("#profileModal").classList.remove("hidden");document.body.style.overflow="hidden"}
function closeProfile(){$("#profileModal").classList.add("hidden");document.body.style.overflow=""}
function switchView(name){$$(".view").forEach(v=>v.classList.toggle("active",v.id===`view-${name}`));$$(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===name));window.scrollTo({top:0,behavior:"smooth"})}
function renderAll(){renderHeader();renderNumerology();renderHoroscope();if(profile){const by=yearCanChi(new Date(profile.birthDate+"T12:00:00").getFullYear());$("#dateProfileBranch").textContent=`${by.stem} ${by.branch}`;$("#dateProfileElement").textContent=`Tuổi ${by.animal} • ${by.element}`}}
$$(".nav-link").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.view)));$$("[data-view-jump]").forEach(b=>b.addEventListener("click",e=>{e.preventDefault();switchView(b.dataset.viewJump)}));$$("[data-go='profile']").forEach(b=>b.addEventListener("click",openProfile));$("#profileChip").addEventListener("click",openProfile);$("#closeProfileModal").addEventListener("click",closeProfile);$("#profileModal").addEventListener("click",e=>{if(e.target.id==="profileModal")closeProfile()});
$("#profileForm").addEventListener("submit",e=>{e.preventDefault();saveProfile({fullName:$("#fullName").value.trim(),birthDate:$("#birthDate").value,birthTime:$("#birthTime").value,gender:$("#gender").value,birthPlace:$("#birthPlace").value.trim()});closeProfile()});
$("#clearProfileBtn").addEventListener("click",()=>{localStorage.removeItem(STORE);profile=null;$("#profileForm").reset();renderAll();closeProfile()});$("#drawTarotBtn").addEventListener("click",drawTarot);$("#resetTarotBtn").addEventListener("click",resetTarot);$("#tarotMode").addEventListener("change",updateTarotModeUI);$("#tarotTopic").addEventListener("change",()=>{if($("#tarotMode").value==="preset")populateTarotPresets()});$("#scanDatesBtn").addEventListener("click",scanDates);$("#toggleAllDates").addEventListener("click",()=>{showAllDates=!showAllDates;renderDateList()});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeProfile()});
initDates();updateTarotModeUI();renderAll();
})();