import React, { SyntheticEvent, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import {
	AccordionDetails,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import { GET_NOTICES } from '../../../apollo/user/query';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { T } from '../../types/common';
import { Notice } from '../../types/notice/notice';
import { CREATE_NOTICE, UPDATE_NOTICE } from '../../../apollo/user/mutation';
import { userVar } from '../../../apollo/store';
import DeleteIcon from '@mui/icons-material/Delete';
import { sweetConfirmAlert, sweetMixinSuccessAlert } from '../../sweetAlert';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);
const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const [category, setCategory] = useState<string>('property');
	const [expanded, setExpanded] = useState<string | false>('panel1');
	const [notices, setNotices] = useState<Notice[]>([]);
	const [noticeTitle, setNoticeTitle] = useState('');
	const [noticeContent, setNoticeContent] = useState('');
	const [noticeTopic, setNoticeTopic] = useState('');
	const [openForm, setOpenForm] = useState(false);
	const [noticeStatus, setNoticeStatus] = useState('');

	/** APOLLO REQUESTS **/

	const [createNotice] = useMutation(CREATE_NOTICE);
	const [updateNotice] = useMutation(UPDATE_NOTICE);

	const initialInput = {
		noticeCategory: NoticeCategory.FAQ,
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

	/** LIFECYCLES **/

	/** HANDLERS **/
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

	const createNoticeHandler = async (input: any) => {
		await createNotice({ variables: { input: input } });

		await getNoticesRefetch();
		setNoticeTopic('');
	};

	const handleNewNoticeClick = () => {
		setOpenForm(true);
	};

	const handleCloseForm = () => {
		setOpenForm(false);
	};

	const changeCategoryHandler = (category: string) => {
		setCategory(category);
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	const handleChangeEvent = async (event: SelectChangeEvent) => {
		const updatedStatus = event.target.value;
		setNoticeStatus(updatedStatus);
	};
	const data: any = {
		property: notices.filter((notice: Notice) => notice.noticeTopic === 'PROPERTY'),
		equipment: notices.filter((notice: Notice) => notice.noticeTopic === 'EQUIPMENT'),
		payment: notices.filter((notice: Notice) => notice.noticeTopic === 'PAYMENT'),
		buyers: notices.filter((notice: Notice) => notice.noticeTopic === 'BUYERS'),
		agents: notices.filter((notice: Notice) => notice.noticeTopic === 'AGENTS'),
		membership: notices.filter((notice: Notice) => notice.noticeTopic === 'MEMBERSHIP'),
		community: notices.filter((notice: Notice) => notice.noticeTopic === 'COMMUNITY'),
		other: notices.filter((notice: Notice) => notice.noticeTopic === 'OTHER'),
	};

	const userdata: any = {
		property: userNotices.filter((notice: Notice) => notice.noticeTopic === 'PROPERTY'),
		equipment: userNotices.filter((notice: Notice) => notice.noticeTopic === 'EQUIPMENT'),
		payment: userNotices.filter((notice: Notice) => notice.noticeTopic === 'PAYMENT'),
		buyers: userNotices.filter((notice: Notice) => notice.noticeTopic === 'BUYERS'),
		agents: userNotices.filter((notice: Notice) => notice.noticeTopic === 'AGENTS'),
		membership: userNotices.filter((notice: Notice) => notice.noticeTopic === 'MEMBERSHIP'),
		community: userNotices.filter((notice: Notice) => notice.noticeTopic === 'COMMUNITY'),
		other: userNotices.filter((notice: Notice) => notice.noticeTopic === 'OTHER'),
	};

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	} else {
		return (
			<>
				{user?.memberType === 'AGENT' || user?.memberType === 'ADMIN' ? (
					<Stack className={'faq-content'}>
						<Box className={'categories'} component={'div'}>
							<div
								className={category === 'property' ? 'active' : ''}
								onClick={() => {
									changeCategoryHandler('property');
								}}
							>
								Property
							</div>
							<div
								className={category === 'equipment' ? 'active' : ''}
								onClick={() => {
									changeCategoryHandler('equipment');
								}}
							>
								Equipment
							</div>
							<div
								className={category === 'payment' ? 'active' : ''}
								onClick={() => {
									changeCategoryHandler('payment');
								}}
							>
								Payment
							</div>
							<div
								className={category === 'buyers' ? 'active' : ''}
								onClick={() => {
									changeCategoryHandler('buyers');
								}}
							>
								Foy Buyers
							</div>
							<div
								className={category === 'agents' ? 'active' : ''}
								onClick={() => {
									changeCategoryHandler('agents');
								}}
							>
								For Managers
							</div>
							<div
								className={category === 'membership' ? 'active' : ''}
								onClick={() => {
									changeCategoryHandler('membership');
								}}
							>
								Membership
							</div>
							<div
								className={category === 'community' ? 'active' : ''}
								onClick={() => {
									changeCategoryHandler('community');
								}}
							>
								Articles
							</div>
							<div
								className={category === 'other' ? 'active' : ''}
								onClick={() => {
									changeCategoryHandler('other');
								}}
							>
								Other
							</div>
						</Box>
						<Box className={'wrap'} component={'div'}>
							{data?.[category].map((notice: Notice) => (
								<Accordion
									expanded={expanded === notice?._id}
									onChange={handleChange(notice?._id)}
									key={notice?.noticeTitle}
								>
									<AccordionSummary id="panel1d-header" aria-controls="panel1d-content">
										<Stack
											width={'100%'}
											flexDirection={'row'}
											justifyContent={'space-between'}
											alignItems={'center'}
											className="question"
										>
											<Stack flexDirection={'row'} alignItems={'center'}>
												<Typography className="badge" variant={'h4'}>
													Q
												</Typography>
												<Typography> {notice?.noticeTitle}</Typography>
											</Stack>

											<Stack flexDirection={'row'} gap={'10px'}>
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
																	handleChangeEvent(e);
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
										</Stack>
									</AccordionSummary>
									<AccordionDetails>
										<Stack className={'answer flex-box'}>
											<Typography className="badge" variant={'h4'} color={'primary'}>
												A
											</Typography>
											<Typography> {notice?.noticeContent}</Typography>
										</Stack>
									</AccordionDetails>
								</Accordion>
							))}
						</Box>
					</Stack>
				) : (
					<Stack className={'faq-content'}>
						<Box className={'categories'} component={'div'}>
							<div
								className={category === 'property' ? 'active' : ''}
								onClick={() => {
									changeCategoryHandler('property');
								}}
							>
								Property
							</div>
							<div
								className={category === 'equipment' ? 'active' : ''}
								onClick={() => {
									changeCategoryHandler('equipment');
								}}
							>
								Equipment
							</div>
							<div
								className={category === 'payment' ? 'active' : ''}
								onClick={() => {
									changeCategoryHandler('payment');
								}}
							>
								Payment
							</div>
							<div
								className={category === 'buyers' ? 'active' : ''}
								onClick={() => {
									changeCategoryHandler('buyers');
								}}
							>
								Foy Buyers
							</div>
							<div
								className={category === 'agents' ? 'active' : ''}
								onClick={() => {
									changeCategoryHandler('agents');
								}}
							>
								For Managers
							</div>
							<div
								className={category === 'membership' ? 'active' : ''}
								onClick={() => {
									changeCategoryHandler('membership');
								}}
							>
								Membership
							</div>
							<div
								className={category === 'community' ? 'active' : ''}
								onClick={() => {
									changeCategoryHandler('community');
								}}
							>
								Articles
							</div>
							<div
								className={category === 'other' ? 'active' : ''}
								onClick={() => {
									changeCategoryHandler('other');
								}}
							>
								Other
							</div>
						</Box>
						<Box className={'wrap'} component={'div'}>
							{userdata?.[category].map((notice: Notice) => (
								<Accordion
									expanded={expanded === notice?._id}
									onChange={handleChange(notice?._id)}
									key={notice?.noticeTitle}
								>
									<AccordionSummary id="panel1d-header" className="question" aria-controls="panel1d-content">
										<Typography className="badge" variant={'h4'}>
											Q
										</Typography>
										<Typography> {notice?.noticeTitle}</Typography>
									</AccordionSummary>
									<AccordionDetails>
										<Stack className={'answer flex-box'}>
											<Typography className="badge" variant={'h4'} color={'primary'}>
												A
											</Typography>
											<Typography> {notice?.noticeContent}</Typography>
										</Stack>
									</AccordionDetails>
								</Accordion>
							))}
						</Box>
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
						<TextField
							label="Notice Title"
							fullWidth
							margin="normal"
							onChange={(e) => setNoticeTitle(e.target.value)}
						/>
						<TextField
							label="Notice Content"
							fullWidth
							margin="normal"
							onChange={(e) => setNoticeContent(e.target.value)}
						/>
						<Select
							sx={{ marginTop: '20px' }}
							label="Notice Topic"
							fullWidth
							margin="dense"
							value={noticeTopic}
							onChange={(e) => setNoticeTopic(e.target.value)}
							displayEmpty
						>
							<MenuItem value="" disabled>
								Select a Notice Topic
							</MenuItem>
							<MenuItem value="PROPERTY">PROPERTY</MenuItem>
							<MenuItem value="EQUIPMENT">EQUIPMENT</MenuItem>
							<MenuItem value="PAYMENT">PAYMENT</MenuItem>
							<MenuItem value="BUYERS">BUYERS</MenuItem>
							<MenuItem value="AGENTS">AGENTS</MenuItem>
							<MenuItem value="MEMBERSHIP">MEMBERSHIP</MenuItem>
							<MenuItem value="COMMUNITY">COMMUNITY</MenuItem>
							<MenuItem value="OTHER">OTHER</MenuItem>
						</Select>
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
									noticeCategory: NoticeCategory.FAQ,
									noticeTitle: noticeTitle,
									noticeContent: noticeContent,
									noticeTopic: noticeTopic,
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

export default Faq;
