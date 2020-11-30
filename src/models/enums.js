const RoleStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

const UserChangeType = {
  EMAIL_CHANGE: 'email_change',
  HENRY_GONE: 'henry_gone',
  STUDENT_GONE: 'student_gone',
  GRADUATED: 'graduated',
};

const ClientContractStatus = {
  NOT_STARTED: 'not_started',
  ACITVE: 'active',
  SUSPENDED: 'suspended',
  CLOSED: 'closed',
  COMPLETED: 'completed',
};

const StudentStatus = {
  ONBOARDING: 'onboarding',
  REGULAR: 'regular',
  MIGRATION: 'migration',
  GONE: 'gone',
  GRADUATED: 'graduated',
};

const ServiceChoices = {
  GITHUB: 'github',
};

const TeamStatus = {
  REGULAR: 'regular',
  MIGTATION: 'migration',
  GONE: 'gone',
};

const CheckListItemType = {
  FORM: 'form',
  CONTRACT: 'contract',
  IDENTITYVALIDATOR: 'identityValidator',
};

const ChecklistSublevels = {
  [CheckListItemType.CONTRACT]: {
    LINK: 'link',
    COMPLETED: 'completed',
  },
  [CheckListItemType.FORM]: {
    COMPLETED: 'completed',
  },
  [CheckListItemType.IDENTITYVALIDATOR]: {
    COMPLETED: 'completed',
  },
};

module.exports = {
  RoleStatus,
  UserChangeType,
  ClientContractStatus,
  StudentStatus,
  ServiceChoices,
  TeamStatus,
  CheckListItemType,
  ChecklistSublevels,
};
