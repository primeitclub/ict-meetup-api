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
  EVENT_REGISTRATIONS = 'event_registrations',
  HERO_SECTIONS = 'hero_sections',
  ACHIEVEMENT_METRICS = 'achievement_metrics',
  ABOUT_SECTIONS = 'about_sections',
  SPEAKERS='speakers',
  GALLERY_ITEMS='gallery_items',
  TEAM_MEMBERS='team_members',
  VERSION_SETTINGS='version_settings',
  USERS='users',


}
