const GrantApplicationModel = require('../modules/GrantApplication/GrantApplicationModel');
const { reportError } = require('../services/errorReportingService');
const logger = require('./logger');

// eslint-disable-next-line max-lines-per-function
const loadAndVerifyMilestoneAndGrant = async (req, res) => {
  try {
    const { id, milestoneId } = req.params;
    const { accountId: nearId } = req.near;

    logger.info('Verifying milestone and save data', { nearId, id, milestoneId });

    const grantApplication = await GrantApplicationModel.findOne({
      id,
      nearId,
    });

    if (!grantApplication) {
      res.status(404).json({
        message: 'No such GrantApplication under this near account',
      });
      return;
    }

    const milestone = grantApplication.milestones[milestoneId];

    if (milestoneId > 0 && !grantApplication.milestones[milestoneId - 1].dateValidation) {
      res.status(400).json({
        message: 'The previous milestone needs to be accepted before submitting this one',
      });
      return;
    }

    // eslint-disable-next-line consistent-return
    return { milestone, grantApplication };
  } catch (error) {
    reportError(error, 'Could not verify or load milestone data');
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = loadAndVerifyMilestoneAndGrant;
