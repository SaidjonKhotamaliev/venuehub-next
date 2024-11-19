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
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_NOTICES } from '../../../apollo/user/query';
import { Notice } from '../../types/notice/notice';
import { T } from '../../types/common';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import { CREATE_NOTICE, UPDATE_NOTICE } from '../../../apollo/user/mutation';
import { userVar } from '../../../apollo/store';
import { SelectChangeEvent } from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import { sweetBasicAlert, sweetConfirmAlert, sweetMixinSuccessAlert } from '../../sweetAlert';

const Notice = () => {
	const user = useReactiveVar(userVar);
	const device = useDeviceDetect();
	const [notices, setNotices] = useState<Notice[]>([]);
	const [openForm, setOpenForm] = useState(false);
	const [noticeTitle, setNoticeTitle] = useState('');
	const [noticeStatus, setNoticeStatus] = useState('');
	const [noticeContent, setNoticeContent] = useState('');

	/** APOLLO REQUESTS **/
	const [createNotice] = useMutation(CREATE_NOTICE);
	const [updateNotice] = useMutation(UPDATE_NOTICE);

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

	const userNotices = notices.filter((notice: Notice) => notice.noticeStatus === 'ACTIVE');

	/** HANDLERS **/

	const createNoticeHandler = async (input: any) => {
		await createNotice({ variables: { input: input } });

		await getNoticesRefetch();
	};

	const updateNoticeHandler = async (input: any, noticeStatus: string) => {
		console.log('nn', noticeStatus);

		if (noticeStatus === 'DELETE') {
			let confirmation = await sweetConfirmAlert('Do you really want to delete the notice?');
			if (confirmation) {
				await updateNotice({
					variables: {
						input: {
							_id: input._id,
							noticeStatus: noticeStatus,
						},
					},
				});

				await getNoticesRefetch();
				await sweetMixinSuccessAlert('Success');
			}
		} else {
			await updateNotice({
				variables: {
					input: {
						_id: input._id,
						noticeStatus: noticeStatus,
					},
				},
			});

			await getNoticesRefetch();
			await sweetMixinSuccessAlert('Notice updated successfully');
		}
	};

	const handleChange = async (event: SelectChangeEvent) => {
		const updatedStatus = event.target.value;
		setNoticeStatus(updatedStatus);
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
				{user?.memberType === 'AGENT' || user?.memberType === 'ADMIN' ? (
					<Stack className={'notice-content'}>
						<span className={'title'}>Notice</span>
						<Stack className={'main'}>
							<Box component={'div'} className={'top'}>
								<Stack flexDirection={'column'} gap={'10px'}>
									<h3>What’s in these terms?</h3>
									<p>
										This index is designed to help you understand some of the key updates we’ve made to our Terms of
										Service (Terms). We hope this serves as a useful guide, but please ensure you read the Terms in
										full.
									</p>
								</Stack>
							</Box>
							<Stack className={'bottom'}>
								{notices.map((notice: Notice) => (
									<div className={'notice-card'} key={notice._id}>
										<Stack flexDirection={'row'} justifyContent={'space-between'}>
											<Stack flexDirection={'column'}>
												<span>{notice?.noticeTitle}</span>
												<p>{notice?.noticeContent}</p>
											</Stack>
											{user?.memberType === 'AGENT' || user?.memberType === 'ADMIN' ? (
												<Stack flexDirection={'row'} gap={'10px'} width={'200px'} alignItems={'center'}>
													<FormControl sx={{ m: 1, maxWidth: 120 }} size="small">
														<InputLabel id="demo-select-small-label">Status</InputLabel>
														<Select
															labelId="demo-select-small-label"
															id="demo-select-small"
															value={notice?.noticeStatus}
															label="age"
															onChange={(e) => {
																handleChange(e);
															}}
														>
															<MenuItem
																value={'ACTIVE'}
																onClick={() => {
																	updateNoticeHandler(notice, 'ACTIVE');
																}}
															>
																Active
															</MenuItem>
															<MenuItem
																value={'HOLD'}
																onClick={() => {
																	updateNoticeHandler(notice, 'HOLD');
																}}
															>
																Hold
															</MenuItem>
														</Select>
													</FormControl>
													<Box
														onClick={() => {
															updateNoticeHandler(notice, 'DELETE');
														}}
														sx={{
															display: 'inline-flex',
															alignItems: 'center',
															justifyContent: 'center',
															borderRadius: '50%',
															transition: 'background-color 0.3s, transform 0.2s',
															'&:hover': {
																backgroundColor: 'rgba(0, 0, 0, 0.1)',
																transform: 'scale(1.1)',
															},
															padding: '8px',
														}}
													>
														<DeleteIcon
															color="action"
															sx={{
																fontSize: '1.5rem',
															}}
														/>
													</Box>
												</Stack>
											) : (
												''
											)}
										</Stack>
									</div>
								))}
							</Stack>
						</Stack>
					</Stack>
				) : (
					<Stack className={'notice-content'}>
						<span className={'title'}>Notice</span>
						<Stack className={'main'}>
							<Box component={'div'} className={'top'}>
								<Stack flexDirection={'column'} gap={'10px'}>
									<h3>What’s in these terms?</h3>
									<p>
										This index is designed to help you understand some of the key updates we’ve made to our Terms of
										Service (Terms). We hope this serves as a useful guide, but please ensure you read the Terms in
										full.
									</p>
								</Stack>
							</Box>
							<Stack className={'bottom'}>
								{userNotices.map((notice: Notice) => (
									<div className={'notice-card'} key={notice._id}>
										<Stack flexDirection={'row'} justifyContent={'space-between'}>
											<Stack flexDirection={'column'}>
												<span>{notice?.noticeTitle}</span>
												<p>{notice?.noticeContent}</p>
											</Stack>
										</Stack>
									</div>
								))}
							</Stack>
						</Stack>
					</Stack>
				)}

				{user?.memberType === 'AGENT' || user?.memberType === 'ADMIN' ? (
					<Box className={'new-notice'} onClick={handleNewNoticeClick}>
						New notice
					</Box>
				) : (
					''
				)}

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
