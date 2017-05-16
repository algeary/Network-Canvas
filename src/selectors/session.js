/* eslint-disable no-shadow */
import { createSelector } from 'reselect';

const stageIndex = state => state.session.stage.index;
const promptIndex = state => state.session.prompt.index;
const protocol = state => state.protocol.protocolConfig;

const stage = createSelector(
  stageIndex,
  protocol,
  (stageIndex, protocol) => protocol.stages[stageIndex],
);

const prompt = createSelector(
  promptIndex,
  stage,
  (promptIndex, stage) => stage.params.prompts[promptIndex],
);

export const getStages = createSelector(
  protocol,
  protocol => protocol.stages,
);

export const activePromptAttributes = createSelector(
  prompt,
  prompt => prompt.nodeAttributes,
);

export const activeStageAttributes = createSelector(
  stage,
  stage => ({ type: stage.params.nodeType }),
);

export const activeOriginAttributes = createSelector(
  prompt,
  stage,
  (prompt, stage) => ({ stageId: stage.id, promptId: prompt.id }),
);

export const newNodeAttributes = createSelector(
  activePromptAttributes,
  activeStageAttributes,
  activeOriginAttributes,
  (activePromptAttributes, activeStageAttributes, activeOriginAttributes) =>
    ({ ...activePromptAttributes, ...activeStageAttributes, ...activeOriginAttributes }),
);
