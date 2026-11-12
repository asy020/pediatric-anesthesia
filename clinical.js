/* Pediatric anesthesia prep — institution reference only. Updated 2026-11-12 */
(function(g){
"use strict";
const VERSION="2.0.0";
const OP=[
["Nikaidoh OP",["nikaidoh","나이카이도"],"대동맥근을 옮겨 좌심실 유출로를 재구성하는 선천성 심장수술입니다.","관상동맥·좌우 유출로·심실 기능·체외순환 계획"],
["Rastelli procedure",["rastelli","라스텔리"],"심실중격결손을 통한 좌심실–대동맥 경로를 만들고 우심실–폐동맥 연결을 재건합니다.","도관, 잔여 VSD 및 양쪽 유출로"],
["Arterial switch operation",["arterial switch","jatene","동맥전환술"],"전위된 대혈관을 바꾸고 관상동맥을 다시 연결하는 수술입니다.","관상동맥 혈류·심실 기능"],
["Norwood operation",["norwood","노우드"],"단심실 완화치료의 첫 단계로 전신 유출로를 재건합니다.","전신·폐혈류 균형 및 단락"],
["Glenn operation",["glenn","글렌"],"상대정맥을 폐동맥으로 연결하는 단심실 완화 수술입니다.","폐혈관저항 및 상대정맥 압력"],
["Fontan operation",["fontan","폰탄"],"전신 정맥혈을 폐동맥으로 직접 보내도록 만드는 단심실 완화 수술입니다.","정맥압 및 폐혈관저항"],
["TOF repair",["tof","tetralogy of fallot","팔로사징"],"팔로사징의 심실중격결손과 우심실 유출로 협착을 교정합니다.","RVOT·잔여 VSD·우심실 기능"],
["VSD closure",["vsd","심실중격결손"],"심실중격결손을 봉합 또는 패치로 닫는 수술입니다.","잔여 단락·전도장애"],
["ASD closure",["asd","심방중격결손"],"심방중격결손을 폐쇄하는 수술입니다.","잔여 단락·정맥환류"],
["PDA closure",["pda","동맥관개존"],"대동맥과 폐동맥 사이 열린 동맥관을 폐쇄합니다.","폐고혈압과 혈역학 변화"]
];
const round=(v,d=2)=>Math.round((v+Number.EPSILON)*10**d)/10**d;
function surgery(s){s=String(s||"").toLowerCase().replace(/[\-_]/g," ");if(!s.trim())return null;for(const [name,terms,description,check] of OP){if(terms.some(t=>t.length<=3&&/^[a-z]+$/.test(t)?new RegExp("(^|[^a-z])"+t+"($|[^a-z])").test(s):s.includes(t)))return {name,description,check};}return {name:"미등록 수술",description:"수술 설명 데이터에 없는 수술명입니다. 정식 수술명을 확인해 주세요.",check:"담당 의료진에게 수술 내용과 준비사항 확인"};}
function compute(a){
const fields=["years","months","days","height","weight"];if(fields.some(k=>String(a[k]??"").trim()===""))return {error:"세·개월·일·키·체중을 모두 입력해 주세요."};
const y=+a.years,m=+a.months,d=+a.days,h=+a.height,w=+a.weight;
if(![y,m,d,h,w].every(Number.isFinite)||![y,m,d].every(Number.isInteger)||y<0||y>17||m<0||m>11||d<0||d>30||h<30||h>220||w<0.5||w>150)return {error:"입력 범위를 확인하세요: 0–17세, 0–11개월, 0–30일, 30–220cm, 0.5–150kg."};
const adult=!!a.adultPrep&&w>=30;
const tubes=[3,3.5].map(base=>{const s=round(Math.round((base+y/4)*2)/2,1);return {s,mid:round(s*3,1),low:round(s*3-0.5,1),high:round(s*3+0.5,1)}});
const blade=w<3?"#00":w<5?"#0":w>=30?"#3 (체격 확인)":y>=3?"#2":"#1";
const mask=w<3?"빨강":w<10?"초록":w<20?"보라":w<30?"노랑":w<40?(adult?"파랑 (성인형 후보)":"노랑 / 파랑 후보"):"파랑";
const cuff=y>=16&&w>=50?"#11":w>=20?"#10":w>=10?"#9":w>=5.5?"#8":w>=4.5?"#7":w>=3.5?"#4":w>=2.5?"#3":w>=1.5?"#2":"#1";
const tee=y>=16&&w>=50?"성인용 (제조사 확인)":w>=6&&w<=30?"소아용":w>=5&&w<6?"신생아용 / 소아용 가능":w>=2.8&&w<5?"신생아용":"제품별 규격 확인";
const med=[["Midazolam",.1,.2,"mg"],["Pentotal Sodium",2,3,"mg"],["Esmeron (rocuronium)",.6,.6,"mg"],["Sufentanil",.2,.3,"mcg"],["Cefazolin (예방적 항생제)",30,30,"mg"]].map(([name,lo,hi,unit])=>({name,lo:round(w*lo),hi:round(w*hi),unit,factor:lo===hi?String(lo):lo+"–"+hi}));
const warnings=["기준값은 병원·제조사 기준과 담당 마취과 지시를 확인하세요."];
if(w>=5&&w<6)warnings.push("TEE 5–6kg: 소아용 사용 가능성 있으나 제조사 규격 및 담당의 결정 우선");
if(w>=30)warnings.push("30kg 이상: 체격과 수술에 따라 성인형 장비 준비 가능; 자동 전환하지 않음");
if(y===0&&m<=1)warnings.push("신생아/미숙아: 재태주수 등 별도 평가 필요");
if(y>=2)warnings.push("ETT 사용자 제공 공식은 보편적인 Cuffed/Uncuffed 공식과 다름");
if(w*30>2000)warnings.push("Cefazolin 환산값이 2g을 초과함: 실제 처방·기관 최대용량 및 재투여 기준을 반드시 확인");
return {y,m,d,h,w,adultPrep:adult,operation:String(a.operation||"").trim().slice(0,120),tubes,blade,mask,cuff,tee,meds:med,warnings,procedure:surgery(a.operation),version:VERSION};}
g.PediatricPrepRules=Object.freeze({VERSION,compute,surgery});
})(typeof window!=="undefined"?window:globalThis);
