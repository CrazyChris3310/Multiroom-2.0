import * as Primitive from './xml-primitives';

// Source files:
// file://sga.expanded.xsd/


interface BaseType {
	_exists: boolean;
	_namespace: string;
}
interface _AnalysisJobImmediateQueryCommandInfoType extends BaseType {
	IsGremlin: boolean;
	Text: string;
}
export interface AnalysisJobImmediateQueryCommandInfoType extends _AnalysisJobImmediateQueryCommandInfoType { constructor: { new(): AnalysisJobImmediateQueryCommandInfoType }; }
export var AnalysisJobImmediateQueryCommandInfoType: { new(): AnalysisJobImmediateQueryCommandInfoType };

interface _AnalysisJobImmediateQueryResultInfoType extends BaseType {
	Command: AnalysisJobImmediateQueryCommandInfoType;
	Result: AnalysisJobImmediateQueryResultInfoTypeResultType;
}
export interface AnalysisJobImmediateQueryResultInfoType extends _AnalysisJobImmediateQueryResultInfoType { constructor: { new(): AnalysisJobImmediateQueryResultInfoType }; }
export var AnalysisJobImmediateQueryResultInfoType: { new(): AnalysisJobImmediateQueryResultInfoType };

interface _AnalysisJobImmediateQueryResultInfoTypeResultType extends BaseType {
	Entity?: GraphEntityInfo[];
}
interface AnalysisJobImmediateQueryResultInfoTypeResultType extends _AnalysisJobImmediateQueryResultInfoTypeResultType { constructor: { new(): AnalysisJobImmediateQueryResultInfoTypeResultType }; }

interface _AnalysisJobInfoType extends _InfoType {
	Id?: number;
	DbLogin: string;
	DbName: string;
	DbPassword: string;
	EndStamp: StampType;
	FilesImportedCount: number;
	FilesToImportCount: number;
	Name: string;
	PipelineId: number;
	PipelineName: string;
	QueueStamp: StampType;
	StartStamp: StampType;
	Status: DbAnalysisJobStatusKind;
	SuccessedStepsCount: number;
	TotalStepsCount: number;
}
export interface AnalysisJobInfoType extends _AnalysisJobInfoType { constructor: { new(): AnalysisJobInfoType }; }
export var AnalysisJobInfoType: { new(): AnalysisJobInfoType };

interface _AnalysisPipelineInfoType extends _InfoType {
	Id?: number;
	Analyzes: AnalysisPipelineInfoTypeAnalyzesType;
	Importers: AnalysisPipelineInfoTypeImportersType;
	Name: string;
}
export interface AnalysisPipelineInfoType extends _AnalysisPipelineInfoType { constructor: { new(): AnalysisPipelineInfoType }; }
export var AnalysisPipelineInfoType: { new(): AnalysisPipelineInfoType };

interface _AnalysisPipelineInfoTypeAnalyzesType extends BaseType {
	Analysis?: AnalysisPipelineInfoTypeAnalyzesTypeAnalysisType[];
}
interface AnalysisPipelineInfoTypeAnalyzesType extends _AnalysisPipelineInfoTypeAnalyzesType { constructor: { new(): AnalysisPipelineInfoTypeAnalyzesType }; }

interface _AnalysisPipelineInfoTypeAnalyzesTypeAnalysisType extends BaseType {
	Id: number;
}
interface AnalysisPipelineInfoTypeAnalyzesTypeAnalysisType extends _AnalysisPipelineInfoTypeAnalyzesTypeAnalysisType { constructor: { new(): AnalysisPipelineInfoTypeAnalyzesTypeAnalysisType }; }

interface _AnalysisPipelineInfoTypeImportersType extends BaseType {
	Importer?: AnalysisPipelineInfoTypeImportersTypeImporterType[];
}
interface AnalysisPipelineInfoTypeImportersType extends _AnalysisPipelineInfoTypeImportersType { constructor: { new(): AnalysisPipelineInfoTypeImportersType }; }

interface _AnalysisPipelineInfoTypeImportersTypeImporterType extends BaseType {
	Id: number;
}
interface AnalysisPipelineInfoTypeImportersTypeImporterType extends _AnalysisPipelineInfoTypeImportersTypeImporterType { constructor: { new(): AnalysisPipelineInfoTypeImportersTypeImporterType }; }

export type bool = boolean;
type _bool = Primitive._boolean;

interface _ChangeEmailSpecType extends BaseType {
	NewEmail: string;
	OldEmail: string;
	Password: string;
}
export interface ChangeEmailSpecType extends _ChangeEmailSpecType { constructor: { new(): ChangeEmailSpecType }; }
export var ChangeEmailSpecType: { new(): ChangeEmailSpecType };

interface _ChangePasswordSpecType extends BaseType {
	Email: string;
	NewPassword: string;
}
export interface ChangePasswordSpecType extends _ChangePasswordSpecType { constructor: { new(): ChangePasswordSpecType }; }
export var ChangePasswordSpecType: { new(): ChangePasswordSpecType };

export type DbAnalysisJobStatusKind = ("Queued" | "InProgress" | "Finished");
interface _DbAnalysisJobStatusKind extends _string { content: DbAnalysisJobStatusKind; }

interface _ErrorInfoType extends BaseType {
	TypeName: string;
	InnerError?: ErrorInfoType;
	Message: string;
	StackTrace: string;
}
export interface ErrorInfoType extends _ErrorInfoType { constructor: { new(): ErrorInfoType }; }
export var ErrorInfoType: { new(): ErrorInfoType };

interface _ExtendedErrorInfoType extends _ErrorInfoType {
	RawErrorInfo: string;
}
export interface ExtendedErrorInfoType extends _ExtendedErrorInfoType { constructor: { new(): ExtendedErrorInfoType }; }
export var ExtendedErrorInfoType: { new(): ExtendedErrorInfoType };

interface _GraphEntityInfo extends BaseType {
	Id: string;
	Kind: string;
	Fields: GraphEntityInfoFieldsType;
}
export interface GraphEntityInfo extends _GraphEntityInfo { constructor: { new(): GraphEntityInfo }; }
export var GraphEntityInfo: { new(): GraphEntityInfo };

interface _GraphEntityInfoFieldsType extends BaseType {
	Field?: GraphEntityInfoFieldsTypeFieldType[];
}
interface GraphEntityInfoFieldsType extends _GraphEntityInfoFieldsType { constructor: { new(): GraphEntityInfoFieldsType }; }

interface _GraphEntityInfoFieldsTypeFieldType extends BaseType {
	Name: string;
	Value?: string;
	Entity?: GraphEntityInfo[];
}
interface GraphEntityInfoFieldsTypeFieldType extends _GraphEntityInfoFieldsTypeFieldType { constructor: { new(): GraphEntityInfoFieldsTypeFieldType }; }

export type Guid = string;
type _Guid = _string;

interface _ImporterInfoType extends _InfoType {
	Id?: number;
	FileNamePattern: string;
	Name: string;
	ParserGrammarText: string;
}
export interface ImporterInfoType extends _ImporterInfoType { constructor: { new(): ImporterInfoType }; }
export var ImporterInfoType: { new(): ImporterInfoType };

interface _InfoType extends BaseType {}
export interface InfoType extends _InfoType { constructor: { new(): InfoType }; }
export var InfoType: { new(): InfoType };

export type int = number;
type _int = Primitive._number;

interface _ListType extends BaseType {
	Count: number;
	From: number;
	TotalCount: number;
	AnalysisJobInfo?: AnalysisJobInfoType[];
	AnalysisPipelineInfo?: AnalysisPipelineInfoType[];
	ImporterInfo?: ImporterInfoType[];
	ModelAnalysisInfo?: ModelAnalysisInfoType[];
}
export interface ListType extends _ListType { constructor: { new(): ListType }; }
export var ListType: { new(): ListType };

interface _LoginSpecType extends BaseType {
	Login: string;
	Password: string;
}
export interface LoginSpecType extends _LoginSpecType { constructor: { new(): LoginSpecType }; }
export var LoginSpecType: { new(): LoginSpecType };

export type long = number;
type _long = Primitive._number;

interface _ModelAnalysisInfoType extends _InfoType {
	Id?: number;
	GraphQueryText: string;
	IsPositiveRequirement: boolean;
	Name: string;
	UseGremlin: boolean;
}
export interface ModelAnalysisInfoType extends _ModelAnalysisInfoType { constructor: { new(): ModelAnalysisInfoType }; }
export var ModelAnalysisInfoType: { new(): ModelAnalysisInfoType };

interface _OkType extends BaseType {}
export interface OkType extends _OkType { constructor: { new(): OkType }; }
export var OkType: { new(): OkType };

interface _ProfileFootprintInfoType extends BaseType {
	EmailFootprint: string;
	IsActivated: boolean;
	Login: string;
}
export interface ProfileFootprintInfoType extends _ProfileFootprintInfoType { constructor: { new(): ProfileFootprintInfoType }; }
export var ProfileFootprintInfoType: { new(): ProfileFootprintInfoType };

interface _RegisterSpecType extends BaseType {
	Email: string;
	Login: string;
	Password: string;
}
export interface RegisterSpecType extends _RegisterSpecType { constructor: { new(): RegisterSpecType }; }
export var RegisterSpecType: { new(): RegisterSpecType };

interface _RequestActivationSpecType extends BaseType {
	Email: string;
}
export interface RequestActivationSpecType extends _RequestActivationSpecType { constructor: { new(): RequestActivationSpecType }; }
export var RequestActivationSpecType: { new(): RequestActivationSpecType };

interface _ResetPasswordSpecType extends BaseType {
	Email: string;
	Login: string;
}
export interface ResetPasswordSpecType extends _ResetPasswordSpecType { constructor: { new(): ResetPasswordSpecType }; }
export var ResetPasswordSpecType: { new(): ResetPasswordSpecType };

interface _StampType extends BaseType {
	Ticks: number;
}
export interface StampType extends _StampType { constructor: { new(): StampType }; }
export var StampType: { new(): StampType };

export type string = string;
type _string = Primitive._string;

export type word = string;
type _word = _string;

export interface document extends BaseType {
	AnalysisJobImmediateQueryCommand: AnalysisJobImmediateQueryCommandInfoType;
	AnalysisJobImmediateQueryResult: AnalysisJobImmediateQueryResultInfoType;
	AnalysisJobInfo: AnalysisJobInfoType;
	AnalysisPipelineInfo: AnalysisPipelineInfoType;
	ChangeEmailSpec: ChangeEmailSpecType;
	ChangePasswordSpec: ChangePasswordSpecType;
	ErrorInfo: ErrorInfoType;
	ImporterInfo: ImporterInfoType;
	List: ListType;
	LoginSpec: LoginSpecType;
	ModelAnalysisInfo: ModelAnalysisInfoType;
	Ok: OkType;
	ProfileFootprintInfo: ProfileFootprintInfoType;
	RegisterSpec: RegisterSpecType;
	RequestActivationSpec: RequestActivationSpecType;
	ResetPasswordSpec: ResetPasswordSpecType;
}
export var document: document;
