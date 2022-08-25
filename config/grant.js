const config = {
  skipEvaluationApproval: process.env.SKIP_EVALUATION_APPROVAL.toLocaleLowerCase() === 'true',
  skipOnboarding: process.env.SKIP_ONBOARDING.toLocaleLowerCase() === 'true',
  allowMilestonesOnTheGo: process.env.ALLOW_MILESTONES_ON_THE_GO.toLocaleLowerCase() === 'true',
  defaultCurrency: process.env.DEFAULT_CURRENCY || 'USN',
};

module.exports = config;
