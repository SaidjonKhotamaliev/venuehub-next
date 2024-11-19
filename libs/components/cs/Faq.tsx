import React, { SyntheticEvent, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import {
	AccordionDetails,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	MenuItem,
	Select,
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
import { CREATE_NOTICE } from '../../../apollo/user/mutation';
import { userVar } from '../../../apollo/store';

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

	/** APOLLO REQUESTS **/

	const [createNotice] = useMutation(CREATE_NOTICE);

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

	/** LIFECYCLES **/

	/** HANDLERS **/
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
	console.log('pr', data?.property);

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	} else {
		return (
			<>
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
							For Agents
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
							Community
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
