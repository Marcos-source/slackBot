// Holds every email type with their respective dinamic attributes

const ONBOARDING_COMPLETION_EMAIL = {
  type: 'ONBOARDING_COMPLETION_EMAIL',
  subject: 'HENRY - Estudiante Regular',
  bodyText: `
  Felicitaciones _name, has completado efectivamente los requisitos para convertirte en estudiante de Henry
  Atesora la siguiente información: 
  Curso: _course
  Cohorte: _cohort
  Fecha de tu comienzo: _startDate 
  `,
  attributes: ['name', 'course', 'cohort', 'startDate'],
};

const EMAIL_CHANGE = {
  type: 'EMAIL_CHANGE',
  subject: 'HENRY - Solicitud de cambio de Email',
  bodyText: `
  Para completar la solicitud de cambio de Email, has click en el siguiente enlace: _link
  `,
  expirationTime: 60 * 60 * 48 * 1000,
  attributes: ['name', 'link', 'expirationDate'],
};

module.exports = {
  ONBOARDING_COMPLETION_EMAIL,
  EMAIL_CHANGE,
};

