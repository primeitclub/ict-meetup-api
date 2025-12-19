export enum AuditLogType {
  INFO = 'info',
  ERROR = 'error',
}

export enum AuditLogActionType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
}

export enum AuditLogScope {
  EVENTS = 'events',
  EVENT_SPEAKERS = 'event_speakers',
  SPONSORS = 'sponsors',

}
