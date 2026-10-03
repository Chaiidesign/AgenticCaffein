// Target API contracts. The frontend currently uses local deterministic fixtures.
export type Role = 'owner' | 'manager' | 'employee';
export type Attention = 'none' | 'ambient' | 'notify' | 'interrupt';
export type DecisionState = 'investigating' | 'proposed' | 'approved' | 'stale' | 'declined' | 'completed';
export type EvidenceKind = 'observed' | 'owner_reported' | 'supplier_claim' | 'assumption' | 'prediction' | 'sample';
export interface Evidence {id:string; subjectId:string; kind:EvidenceKind; assertion:string; sourceRef:string; capturedAt:string; effectiveAt:string; expiresAt?:string; verificationStatus:'unverified'|'supported'|'contradicted'|'expired'; method?:string; scope?:string; limitations:string[];}
export interface Money {minorUnits:number;currency:string;}
export interface Principal {userId:string;businessId:string;role:Role;scopes:string[];}
export interface Authority {action:string;resourceScope:string[];maxSpend?:Money;conditions:string[];validUntil?:string;delegatedBy:string;version:number;}
export interface Decision {id:string;version:number;businessId:string;intentVersion:number;inputSnapshotId:string;state:DecisionState;ownerId:string;assigneeIds:string[];attention:Attention;goal:string;evidence:Evidence[];unknowns:string[];alternatives:string[];proposedAction?:{type:string;payloadHash:string;amount?:Money};requiredHumanDecision:string;authority:Authority[];simulation:boolean;}
export type ComponentType='SituationSummary'|'SupplyTimeline'|'SupplierComparison'|'EvidenceChecklist'|'TestPlan'|'ApprovalPanel';
export interface SurfacePlan {surfaceId:string;decisionVersion:number;catalogVersion:string;source:'jev'|'deterministic-fixture'|'fallback';audience:Role;components:{id:string;type:ComponentType;dataRef?:string}[];slots:Record<string,string>;}
export interface Approval {id:string;decisionId:string;decisionVersion:number;intentVersion:number;inputSnapshotId:string;quoteVersion?:number;payloadHash:string;actorId:string;maxSpend:Money;expiresAt:string;state:'active'|'superseded'|'fulfilled';idempotencyKey:string;}
export interface StreamEnvelope {runId:string;businessId:string;decisionId:string;decisionVersion:number;audienceId:string;sequence:number;type:'state'|'surface'|'copy_patch'|'attention'|'error';payload:unknown;}
