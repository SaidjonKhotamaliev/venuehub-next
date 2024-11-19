import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useQuery } from '@apollo/client';
import { GET_NOTICES } from '../../../apollo/user/query';
import { Notice } from '../../types/notice/notice';
import { T } from '../../types/common';
import { NoticeCategory } from '../../enums/notice.enum';

const Notice = () => {
	const device = useDeviceDetect();
	const [notices, setNotices] = useState<Notice[]>([]);

	/** APOLLO REQUESTS **/

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

	/** LIFECYCLES **/
	/** HANDLERS **/

	const data = [
		{
			no: 1,
			event: true,
			title: 'Register to use and get discounts',
			date: '01.03.2024',
		},
		{
			no: 2,
			title: "It's absolutely free to upload and trade properties",
			date: '31.03.2024',
		},
	];

	if (device === 'mobile') {
		return <div>NOTICE MOBILE</div>;
	} else {
		return (
			<Stack className={'notice-content'}>
				<span className={'title'}>Notice</span>
				<Stack className={'main'}>
					<Box component={'div'} className={'top'}>
						<Stack flexDirection={'column'} gap={'10px'}>
							<h3>What’s in these terms?</h3>
							<p>
								This index is designed to help you understand some of the key updates we’ve made to our Terms of Service
								(Terms). We hope this serves as a useful guide, but please ensure you read the Terms in full.
							</p>
						</Stack>
					</Box>
					<Stack className={'bottom'}>
						{notices.map((notice: Notice) => (
							<div className={'notice-card'}>
								<Stack flexDirection={'column'}>
									<span>{notice?.noticeTitle}</span>
									<p>{notice?.noticeContent}</p>
								</Stack>
							</div>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Notice;
