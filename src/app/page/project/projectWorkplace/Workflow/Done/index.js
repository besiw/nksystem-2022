import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { lazy } from 'react';

const stepMap = {
	w1s1: lazy(() => import('./Wf1S1')),
	w1s2: lazy(() => import('./Wf1S2')),
	w1s3: lazy(() => import('./Wf1S3')),
	w1s5: lazy(() => import('./Wf1S5')),
	w1s6: lazy(() => import('./Wf1S6')),
	w1s7: lazy(() => import('./Wf1S7')),
	w1s8: lazy(() => import('./Wf1S8')),
	w1s9: lazy(() => import('./Wf1S9')),
	w1s10: lazy(() => import('./Wf1S10')),
	w1s11: lazy(() => import('./Wf1S11')),
	w1s12: lazy(() => import('./Wf1S12')),
	w1s13: lazy(() => import('./Wf1S13')),
	w1s14: lazy(() => import('./Wf1S14')),
	w1s15: lazy(() => import('./Wf1S15'))
};

const Done = props => {
	const project = useSelector(({ projectApp }) => projectApp.project);
	const { stepId, projectId } = props;
	const params = stepId.split('-');
	const stepNumbers = params[0];
	const workflowStringIndex = stepNumbers.indexOf('w');
	const getWorkflowId = stepNumbers.substring(workflowStringIndex + 1, workflowStringIndex + 2);
	const completedSteps = project.workflows[getWorkflowId].processedSteps;
	const { info } = completedSteps[params[2]];

	const Component = stepMap[stepNumbers];
	return (
		<div>
			<Component {...info} />
		</div>
	);
};

export default Done;
