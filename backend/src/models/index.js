import { Team } from './team.model.js';
import { Case } from './case.model.js';
import { Document } from './document.model.js';
import { Task } from './task.model.js';

// Define additional associations
Case.hasMany(Document, { foreignKey: 'caseId', as: 'documents' });
Case.hasMany(Task, { foreignKey: 'caseId', as: 'tasks' });

Team.hasMany(Case, { foreignKey: 'assignedTo', as: 'assignedCases' });
Team.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });
Team.hasMany(Task, { foreignKey: 'createdBy', as: 'createdTasks' });
Team.hasMany(Document, { foreignKey: 'uploadedBy', as: 'uploadedDocuments' });

export {
  Team,
  Case,
  Document,
  Task
}; 