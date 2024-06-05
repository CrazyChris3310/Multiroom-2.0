export interface MultistreamConferenceConfigurationType {
        DbFileName: string;
        ServiceHostUrl: string;
        SessionTimeout: TimeSpanType;
        TokenTimeout: TimeSpanType;
        DeliveryTimeout: TimeSpanType;
        Smtp: SmtpConfigurationType;
        LogsDirPath: string;
        LinkTemplates: MultistreamConferenceLinkTemplatesType;
}
export interface TimeSpanType {
        Days: Int32;
        Hours: Int32;
        Minutes: Int32;
        Seconds: Int32;
}
export type Int32 = number;
export interface SmtpConfigurationType {
        SmtpServerHost: string;
        SmtpServerPort: Int32;
        SmtpLogin: string;
        SmtpPassword: string;
        SmtpUseSsl: boolean;
        SmtpUseDefaultCredentials: boolean;
        SmtpPickupDirectoryLocation: string;
}
export interface MultistreamConferenceLinkTemplatesType {
        ActivationLink: string;
        PasswordRestoreLink: string;
}
export interface OkType {
}
export interface GraphEntityInfo {
        Id: string;
        Kind: string;
        Fields: Array<GraphEntityInfoField>;
}
export interface GraphEntityInfoField {
        Name: string;
        Value: string;
        Items: Array<GraphEntityInfo>;
}
export interface StampType {
        Ticks: Int64;
}
export type Int64 = number;
export interface InfoType {
}
export interface ConferenceCreationResponse {
        RoomId: string;
}
export interface ConferenceInfoType {
        Id: string;
        Title: string;
        Description: string;
        State: ConferenceStateKindType;
        StateStamp: StampType;
        CreationStamp: StampType;
        StartStamp: StampType;
        EndStamp: StampType;
        Participants: Int32;
}
export enum ConferenceStateKindType {
        Scheduled = "Scheduled",
        Running = "Running",
        Finished = "Finished"
}
export interface UserInfoType {
        Id: Int64;
        Name: string;
}
export interface RegisterSpecType {
        Login: string;
        Password: string;
        Email: string;
}
export interface RequestActivationSpecType {
        Email: string;
}
export interface ChangePasswordSpecType {
        NewPassword: string;
        Email: string;
}
export interface ChangeEmailSpecType {
        Password: string;
        OldEmail: string;
        NewEmail: string;
}
export interface ResetPasswordSpecType {
        Login: string;
        Email: string;
}
export interface LoginSpecType {
        Login: string;
        Password: string;
}
export interface ProfileFootprintInfoType {
        Login: string;
        EmailFootprint: string;
        IsActivated: boolean;
}
export type ListType_Items = ConferenceInfoType | UserInfoType;
export interface ListType {
        TotalCount: Int64;
        From: Int64;
        Count: Int64;
        Items: Array<ListType_Items>;
}
export interface AnalysisJobImmediateQueryCommandInfoType {
        IsGremlin: boolean;
        Text: string;
}
export interface AnalysisJobImmediateQueryResultInfoType {
        Result: Array<GraphEntityInfo>;
        Command: AnalysisJobImmediateQueryCommandInfoType;
}
export interface ErrorInfoType {
        TypeName: string;
        Message: string;
        StackTrace: string;
        InnerError: ErrorInfoType;
}
export interface ExtendedErrorInfoType {
        TypeName: string;
        RawErrorInfo: string;
        Message: string;
        StackTrace: string;
        InnerError: ErrorInfoType;
}
