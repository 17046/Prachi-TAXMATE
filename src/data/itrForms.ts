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
  ITR3: {
    name: 'ITR-3',
    description: 'For individuals and HUFs having income from business or profession',
    applicableFor: ['Business/Profession', 'Salary', 'House Property', 'Capital Gains', 'Other Sources']
  }
};

export const taxSavingOptions = [
  {
    section: '80C',
    options: [
      { name: 'PPF (Public Provident Fund)', maxLimit: 150000 },
      { name: 'ELSS (Equity Linked Saving Scheme)', maxLimit: 150000 },
      { name: 'Life Insurance Premium', maxLimit: 150000 }
    ]
  },
  {
    section: '80D',
    options: [
      { name: 'Health Insurance Premium', maxLimit: 25000 },
      { name: 'Parents Health Insurance Premium', maxLimit: 50000 }
    ]
  }
];
