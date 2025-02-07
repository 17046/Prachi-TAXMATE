export const itrForms = {
  ITR1: {
    name: 'ITR-1 (Sahaj)',
    description: 'For individuals having income from salary, one house property, other sources (interest etc.)',
    applicableFor: ['Salary', 'House Property', 'Other Sources'],
    maxIncome: 5000000
  },
  ITR2: {
    name: 'ITR-2',
    description: 'For individuals and HUFs having income from capital gains, more than one house property',
    applicableFor: ['Salary', 'House Property', 'Capital Gains', 'Other Sources']
  },
