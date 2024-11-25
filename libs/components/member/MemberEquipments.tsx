import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PropertyCard } from '../mypage/PropertyCard';
import { Property } from '../../types/property/property';
import { PropertiesInquiry } from '../../types/property/property.input';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_EQUIPMENTS, GET_PROPERTIES } from '../../../apollo/user/query';
import { Equipment } from '../../types/equipment/equipment';
import { EquipmentCard } from '../mypage/EquipmentCard';

const MyEquipments: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>({ ...initialInput });
	const [agentEquipments, setAgentEquipments] = useState<Equipment[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/

	const initialInput2 = {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: { memberId: memberId },
	};

	const {
		loading: getEquipmentsLoading,
		data: getEquipmentsData,
		error: getEquipmentsError,
		refetch: getEquipmentsRefetch,
	} = useQuery(GET_EQUIPMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput2 },
		skip: !searchFilter?.search?.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentEquipments(data?.getEquipments?.list);
			setTotal(data?.getEquipments?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getEquipmentsRefetch().then();
	}, [searchFilter]);

	useEffect(() => {
		if (memberId)
			setSearchFilter({ ...initialInput, search: { ...initialInput.search, memberId: memberId as string } });
	}, [memberId]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') {
		return <div>VENUEHUB EQUIPMENTS MOBILE</div>;
	} else {
		return (
			<div id="member-properties-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Equipments</Typography>
					</Stack>
				</Stack>
				<Stack className="properties-list-box">
					<Stack className="list-box">
						{agentEquipments?.length > 0 && (
							<Stack className="listing-title-box">
								<Typography className="title-text">Equipments</Typography>
								<Typography className="title-text">Condition</Typography>
								<Typography className="title-text">Created</Typography>
								<Typography className="title-text">Status</Typography>
								<Typography className="title-text">View</Typography>
								<Typography className="title-text">Like</Typography>
							</Stack>
						)}
						{agentEquipments?.length === 0 && (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Property found!</p>
							</div>
						)}
						{agentEquipments?.map((equipment: Equipment) => {
							return <EquipmentCard equipment={equipment} memberPage={true} key={equipment?._id} />;
						})}

						{agentEquipments.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="secondary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} equipment available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyEquipments.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			memberId: '',
		},
	},
};

export default MyEquipments;
