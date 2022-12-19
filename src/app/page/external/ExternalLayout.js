import FuseCountdown from '@fuse/core/FuseCountdown';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import queryString from 'query-string';
import { useState, lazy } from 'react';
import { useDispatch } from 'react-redux';
import { useDeepCompareEffect } from '@fuse/hooks';
import { useParams, useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import FuseSuspense from '@fuse/core/FuseSuspense';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FileChip from 'app/shared-components/MailAttachment';
import clsx from 'clsx';
import * as yup from 'yup';
import _ from '@lodash';
import allRequests, { requestNBK } from 'api/allRequests';
import axios from 'axios';
import NBKLogo from 'app/shared-components/Logo';
import UploadPageConfig from 'app/page/external/UploadPageConfig';
import { Route, Switch } from 'react-router';
import { renderRoutes } from 'react-router-config';
// /PartyDoc/UploadDocument?WorkflowId=1&ProjectId=3722&PartyID=3022&PartyTypeID=10&UrlKey=st4X3hXMCtf4lYbM

const useStyles = makeStyles(theme => ({
	root: {}
}));

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
							<FuseSuspense>{renderRoutes(UploadPageConfig.routes)} </FuseSuspense>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}

export default ExternalLayout;
