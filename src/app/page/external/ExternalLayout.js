
import { motion } from 'framer-motion';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FuseSuspense from '@fuse/core/FuseSuspense';
import * as yup from 'yup';
import _ from '@lodash';
import NBKLogo from 'app/shared-components/Logo';
import UploadPageConfig from 'app/page/external/UploadPageConfig';
import { useRoutes } from 'react-router-dom';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	email: yup.string().email('You must enter a valid email').required('You must enter a email')
});

const defaultValues = {
	email: ''
};

function useQuery() {
	const parsed = queryString.parse(useLocation().search);
	return parsed;
}

function ExternalLayout() {
	return (
		<div className="flex flex-col flex-auto items-center justify-center p-16 sm:p-32">
			<div className="flex flex-col items-center justify-center w-full">
				<motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
					<Card className="w-tablet">
						<CardContent className="flex flex-col items-center p-16 sm:p-32">
							<NBKLogo customSize="24" />
							<FuseSuspense>{useRoutes(UploadPageConfig.routes)} </FuseSuspense>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}

export default ExternalLayout;
