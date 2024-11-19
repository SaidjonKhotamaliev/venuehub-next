import React, { useState } from 'react';
import {
	Stack,
	Box,
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useMutation, useQuery } from '@apollo/client';
import { GET_NOTICES } from '../../../apollo/user/query';
import { Notice } from '../../types/notice/notice';
import { T } from '../../types/common';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import { CREATE_NOTICE } from '../../../apollo/user/mutation';

const Notice = () => {
	const device = useDeviceDetect();
	const [notices, setNotices] = useState<Notice[]>([]);
	const [openForm, setOpenForm] = useState(false);
	const [noticeTitle, setNoticeTitle] = useState('');
	const [noticeContent, setNoticeContent] = useState('');

	/** APOLLO REQUESTS **/
	const [createNotice] = useMutation(CREATE_NOTICE);

	const initialInput = {
		noticeCategory: NoticeCategory.TERMS,
	};
	const {
		loading: getNoticesLoading,
		data: getNoticesData,
		error: getNoticesError,
		refetch: getNoticesRefetch,
	} = useQuery(GET_NOTICES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNotices(data?.getNotices);
		},
	});

	/** HANDLERS **/
	const createNoticeHandler = async (input: any) => {
		await createNotice({ variables: { input: input } });

		await getNoticesRefetch();
	};

	const handleNewNoticeClick = () => {
		setOpenForm(true);
	};

	const handleCloseForm = () => {
		setOpenForm(false);
	};

	/** LIFECYCLES **/

	if (device === 'mobile') {
		return <div>NOTICE MOBILE</div>;
	} else {
		return (
			<>
				<Stack className={'notice-content'}>
					<span className={'title'}>Notice</span>
					<Stack className={'main'}>
						<Box component={'div'} className={'top'}>
							<Stack flexDirection={'column'} gap={'10px'}>
								<h3>What’s in these terms?</h3>
								<p>
									This index is designed to help you understand some of the key updates we’ve made to our Terms of
									Service (Terms). We hope this serves as a useful guide, but please ensure you read the Terms in full.
								</p>
							</Stack>
						</Box>
						<Stack className={'bottom'}>
							{notices.map((notice: Notice) => (
								<div className={'notice-card'} key={notice._id}>
									<Stack flexDirection={'column'}>
										<span>{notice?.noticeTitle}</span>
										<p>{notice?.noticeContent}</p>
									</Stack>
								</div>
							))}
						</Stack>
					</Stack>
				</Stack>

				<Box className={'new-notice'} onClick={handleNewNoticeClick}>
					New notice
				</Box>

				<Dialog open={openForm} onClose={handleCloseForm} className="new-notice-frame">
					<h2 style={{ paddingTop: '30px', paddingLeft: '30px' }}>Create New Notice</h2>
					<DialogContent>
						<TextField label="Notice Title" fullWidth margin="dense" onChange={(e) => setNoticeTitle(e.target.value)} />
						<TextField
							label="Notice Content"
							fullWidth
							margin="dense"
							onChange={(e) => setNoticeContent(e.target.value)}
						/>
					</DialogContent>
					<DialogActions sx={{ paddingBottom: '20px', paddingRight: '20px' }}>
						<Button
							onClick={handleCloseForm}
							color="warning"
							sx={{
								backgroundColor: 'red',
								color: '#fff',
								'&:hover': {
									backgroundColor: 'red',
									color: '#fff',
								},
							}}
						>
							Cancel
						</Button>

						<Button
							onClick={() => {
								handleCloseForm();
								createNoticeHandler({
									noticeCategory: NoticeCategory.TERMS,
									noticeTitle: noticeTitle,
									noticeContent: noticeContent,
									noticeStatus: NoticeStatus.ACTIVE,
								});
							}}
							color="primary"
							sx={{
								backgroundColor: '#188377',
								color: '#fff',
								'&:hover': {
									backgroundColor: '#188377',
									color: '#fff',
								},
							}}
						>
							Save
						</Button>
					</DialogActions>
				</Dialog>
			</>
		);
	}
};

export default Notice;
