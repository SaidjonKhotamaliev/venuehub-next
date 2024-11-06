import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';

interface OurTeamProps {
	agent: Member;
}
const OurTeamCard = (props: OurTeamProps) => {
	const { agent } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const agentImage = agent?.memberImage
		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	const [isReadMore, setIsReadMore] = useState(false);

	const description = agent?.memberDesc || 'No description...';

	const truncatedDescription = description.length > 70 ? description.substring(0, 70) + '...' : description;

	/** HANDLERS **/
	const pushAgentHandler = async (memberId: string) => {
		await router.push({ pathname: '/agent/detail', query: { id: memberId } });
	};

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card">
				<img src={agentImage} alt="" />

				<strong>{agent?.memberNick}</strong>
				<span>{agent?.memberType}</span>
			</Stack>
		);
	} else {
		return (
			<>
				<Stack className="top-agent-card" flexDirection={'column'}>
					<Stack flexDirection={'row'} gap={'30px'}>
						<img
							onClick={() => {
								pushAgentHandler(agent._id);
							}}
							src={agentImage}
							alt=""
						/>
						<Stack flexDirection={'column'}>
							<strong
								onClick={() => {
									pushAgentHandler(agent._id);
								}}
							>
								{agent?.memberNick}
							</strong>
							<span>{agent?.memberType}</span>
						</Stack>
					</Stack>
					<div>
						<p>
							{isReadMore ? description : truncatedDescription}
							{description.length > 70 && !isReadMore && (
								<span
									onClick={() => setIsReadMore(true)}
									style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px' }}
								>
									Read More
								</span>
							)}
						</p>
					</div>
				</Stack>

				<Divider
					orientation="vertical"
					flexItem
					sx={{
						height: '150px',
						width: '1px',
						bgcolor: 'grey.400',
					}}
				/>
			</>
		);
	}
};

export default OurTeamCard;
