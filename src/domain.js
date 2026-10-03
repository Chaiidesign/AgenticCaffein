import {BUSINESSES} from './fixtures.js';
export const money=(n)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n);
export const business=s=>BUSINESSES.find(b=>b.id===s.businessId);
export function deriveSituation(input) {
 for(const k of ['current','baseline','dose','stock','arrivalDays']) if(!Number.isFinite(input[k]) || input[k]<0) throw new Error('Use valid, non-negative numbers for '+k+'.');
 if(input.dose===0) throw new Error('Recipe quantity must be greater than zero.');
 const rate=input.current*input.dose, baselineRate=input.baseline*input.dose;
 const cover=rate>0?input.stock/rate:null;
 const gap=cover===null?0:Math.max(0,input.arrivalDays-cover);
 return {rate,baselineRate,cover,gap,acceleration:input.baseline>0?input.current/input.baseline-1:null,unitsAtRisk:Math.ceil(gap*input.current),ingredientAtRisk:gap*rate};
}
export function recommendation(s,d) {
 const b=business(s),v=deriveSituation(s.inventory);
 if(d.id==='supply') return {headline:v.gap>0?'Confirm a bridge with your current supplier.':'Your current replenishment covers demand.',body:v.gap>0?'A cheaper alternative also arrives too late. Protect availability first; keep the supplier comparison separate.':'There is no projected replenishment gap in this snapshot. No emergency purchase is needed.',next:v.gap>0?'Approve a simulated bridge plan':'Keep monitoring',attention:v.gap>0?'interrupt':'none',unknowns:['Emergency availability needs confirmation.','Demand is estimated from a comparable sales window.'],components:v.gap>0?['SituationSummary','SupplyTimeline','EvidenceChecklist','ApprovalPanel']:['SituationSummary','EvidenceChecklist']};
 if(d.id==='supplier') {
  if(d.sample==='failed')return {headline:'Keep your current supplier.',body:'The alternative did not meet the protected product standard in this sample. Lower price does not override that requirement.',next:'Close evaluation; keep incumbent',attention:'notify',unknowns:['One sample does not establish every production lot.'],components:['SituationSummary','TestPlan','EvidenceChecklist']};
  if(d.sample==='passed')return {headline:s.intent.priority==='savings'?'Run a limited trial before changing the main source.':'The sample passed. Keep the next step small.',body:'The product test supports this sample only. Delivery, batch consistency, and actual cost still need a controlled trial.',next:'Approve a limited trial',attention:'notify',unknowns:['Long-term consistency is not established.','Actual delivery reliability is untested.'],components:['SituationSummary','SupplierComparison','TestPlan','ApprovalPanel']};
  return {headline:'Test the product before changing the relationship.',body:s.intent.priority==='savings'?'Explore savings with a small sample first. A limited trial can follow if it passes your protected requirements.':'The alternative is cheaper, but product suitability is untested. Your established supplier remains the reference.',next:'Approve a sample plan',attention:'notify',unknowns:['Taste or material quality is untested.','Seller claims are not independent verification.'],components:['SituationSummary','SupplierComparison','EvidenceChecklist','TestPlan','ApprovalPanel']};
 }
 return {headline:'Get a diagnosis before replacing the equipment.',body:'A diagnostic appointment is reversible and stays within delegated limits. Replacement cost and downtime are not yet confirmed.',next:'Approve a diagnostic plan',attention:'ambient',unknowns:['Failure cause is not confirmed.','Repair feasibility and replacement lead time are unknown.'],components:['SituationSummary','EvidenceChecklist','ApprovalPanel']};
}
export function approvalAmount(s,d){return d.id==='supplier'&&d.sample==='passed'?Math.min(140,s.intent.trialCap):d.amount;}
export function canApprove(s,d) {
 if(!s.members.some(m=>m.id===s.role&&m.active))return false;
 if(['approved','completed','declined','stale'].includes(d.status))return false;
 if(d.id==='supplier'&&d.sample==='failed')return false;
 if(d.id==='supply'&&deriveSituation(s.inventory).gap===0)return false;
 const amount=approvalAmount(s,d);
 if(amount>s.intent.budget)return false;
 return s.role==='owner'||(s.role==='manager'&&d.id!=='supply'&&amount<=s.intent.trialCap);
}
export function visibleDecision(s,d){return s.role!=='employee'||d.assignee==='employee';}
export function planSurface(s,d) {
 const r=recommendation(s,d);
 const components=r.components.filter(x=>s.role!=='employee'||!['SupplierComparison','SupplyTimeline','ApprovalPanel'].includes(x));
 return {surfaceId:'decision-'+d.id,decisionVersion:d.version,catalogVersion:'1.0',source:'deterministic-fixture',audience:s.role,components:components.map(type=>({id:d.id+'-'+type,type})),slots:{headline:r.headline,explanation:r.body},authority:{mayApprove:canApprove(s,d),mayRecordObservation:d.id==='supplier'&&d.sample==='pending'&&['owner','manager','employee'].includes(s.role)}};
}
export function validateSurface(plan,s,d) {
 const allow=['SituationSummary','SupplyTimeline','SupplierComparison','EvidenceChecklist','TestPlan','ApprovalPanel'];
 if(plan.decisionVersion!==d.version||plan.audience!==s.role)throw new Error('The presentation belongs to an old decision or another audience.');
 if(plan.components.some(c=>!allow.includes(c.type)))throw new Error('Unknown component.');
 if(new Set(plan.components.map(c=>c.id)).size!==plan.components.length)throw new Error('Component IDs must be unique.');
 if(s.role==='employee'&&plan.components.some(c=>['SupplierComparison','SupplyTimeline','ApprovalPanel'].includes(c.type)))throw new Error('Restricted component for this audience.');
 return plan;
}
function log(s,title,detail,id,type='decision'){s.history.unshift({id:crypto.randomUUID(),at:new Date().toISOString(),actor:s.members.find(m=>m.id===s.role)?.fullName||s.role,title,detail,decisionId:id,type});}
function stale(s){for(const d of s.decisions){if(d.status==='approved'){d.status='stale';} d.version++;} for(const a of s.approvals){if(a.state==='active')a.state='superseded';}}
export function applyAction(previous,action) {
 const s=structuredClone(previous),d=s.decisions.find(x=>x.id===action.decisionId);
 if(!s.members.some(m=>m.id===s.role&&m.active))throw new Error('This membership is no longer active.');
 if(action.expectedRevision!==undefined&&action.expectedRevision!==s.revision)throw new Error('This workspace changed. Review the latest version first.');
 if(action.type==='approve'){
  if(!d||action.version!==d.version)throw new Error('This proposal changed. Review it again.');
  if(!canApprove(s,d))throw new Error('This action is outside your delegation or no longer available.');
  d.status='approved';if(d.id==='supplier'&&d.sample==='not_started')d.sample='pending';
  s.approvals.push({id:crypto.randomUUID(),decisionId:d.id,decisionVersion:d.version,intentVersion:s.intent.version,inventoryVersion:s.inventory.version,actor:s.role,amount:approvalAmount(s,d),state:'active',simulation:true,approvedAt:new Date().toISOString()});
  log(s,'Plan approved · simulated',d.id==='supplier'?'Approved '+recommendation(s,d).next.toLowerCase()+'. No order was placed.':'Approved '+d.payload.toLowerCase()+'. No order or message was sent.',d.id,'approval');
 }else if(action.type==='decline'){
  if(!d||s.role==='employee'||!['proposed','investigating'].includes(d.status))throw new Error('This decision cannot be declined from this view.');
  if(s.role==='manager'&&d.owner==='owner')throw new Error('Only the decision owner may decline this.');
  if(!action.reason?.trim())throw new Error('Tell us why this plan should change.');
  d.status='declined';d.rejectionReason=action.reason.trim();log(s,'Plan declined',d.rejectionReason,d.id);
 }else if(action.type==='sample'){
  if(!d||d.id!=='supplier'||d.sample!=='pending'||!['passed','failed'].includes(action.result))throw new Error('There is no approved sample awaiting this observation.');
  d.sample=action.result;d.status='proposed';d.version++;s.approvals.filter(a=>a.decisionId===d.id).forEach(a=>a.state='fulfilled');
  log(s,'Sample '+action.result+' · observed fixture',action.notes||'Recorded a simulated product comparison. Evidence supports this sample only.',d.id,'outcome');
 }else if(action.type==='complete'){
  if(!d||d.status!=='approved'||s.role==='employee')throw new Error('There is no active plan you can complete.');
  if(d.id==='supplier'&&d.sample==='pending')throw new Error('Record the sample result first.');
  d.status='completed';s.approvals.filter(a=>a.decisionId===d.id&&a.state==='active').forEach(a=>a.state='fulfilled');
  log(s,'Outcome recorded · simulated','Recorded completion of '+d.payload.toLowerCase()+'. This is not a real external action.',d.id,'outcome');
 }else if(action.type==='intent'){
  if(s.role!=='owner')throw new Error('Only the owner can change the business brief.');
  if(!action.values.goal?.trim()||!action.values.protected?.trim())throw new Error('A goal and protected qualities are required.');
  if(!Number.isFinite(action.values.budget)||action.values.budget<0||!Number.isFinite(action.values.trialCap)||action.values.trialCap<0||action.values.trialCap>action.values.budget)throw new Error('The delegated limit must fit within a valid budget.');
  s.intent={...s.intent,...action.values,version:s.intent.version+1};stale(s);log(s,'Business brief updated','Previous approvals require review against the new brief.');
 }else if(action.type==='inventory'){
  if(s.role==='employee')throw new Error('Ask your manager to change the operational snapshot.');
  deriveSituation(action.values);s.inventory={...action.values,version:s.inventory.version+1};stale(s);log(s,'Operational inputs corrected','Recomputed the situation and invalidated prior approvals.','supply');
 }else if(action.type==='reopen'){
  if(!d||s.role==='employee'||!['stale','declined','completed'].includes(d.status))throw new Error('You cannot reopen this proposal.');
  if(s.role==='manager'&&d.owner==='owner')throw new Error('Only the owner may reopen this proposal.');
  d.status='proposed';d.version++;log(s,'New proposal version prepared','A new approval is required.',d.id);
 }else if(action.type==='pause'){
  if(s.role!=='owner')throw new Error('Only the owner can pause delegation.');
  s.paused=!s.paused;log(s,s.paused?'Agent work paused':'Agent work resumed','No external jobs are connected in this prototype.');
 }else if(action.type==='team'){
  if(s.role!=='owner')throw new Error('Only the owner may edit delegation.');
  const member=s.members.find(m=>m.id===action.memberId);if(!member||member.id==='owner')throw new Error('This membership cannot be changed.');
  member.active=!member.active;log(s,member.active?'Team access restored':'Team access revoked',member.fullName+' · simulated membership.');
 }else if(action.type==='add_member'){
  if(s.role!=='owner'||!action.name?.trim())throw new Error('An owner and team member name are required.');
  s.members.push({id:crypto.randomUUID(),fullName:action.name.trim(),name:action.name.trim().split(' ')[0],role:'Observer',initials:action.name.trim().split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase(),active:true,description:'Observer in this fixture. No invitation sent.'});log(s,'Team member added locally',action.name.trim()+' · no invitation sent.');
 }else if(action.type==='channel'){
  if(s.role!=='owner'||!Object.hasOwn(s.channelRules,action.channel))throw new Error('Only the owner can change channel rules.');
  s.channelRules[action.channel]=!s.channelRules[action.channel];log(s,'Delivery rule updated',action.channel+' · preview only; no external connection.');
 }else if(action.type==='note'){
  if(!action.text?.trim())throw new Error('Write a note first.');s.notes.push({id:crypto.randomUUID(),text:action.text.trim(),actor:s.role,at:new Date().toISOString()});log(s,'Context note recorded',action.text.trim());
 }else throw new Error('Unknown action.');
 s.revision++;return s;
}
