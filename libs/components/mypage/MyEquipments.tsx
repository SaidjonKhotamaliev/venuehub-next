import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { T } from '../../types/common';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { UPDATE_EQUIPMENT } from '../../../apollo/user/mutation';
import { GET_AGENT_EQUIPMENTS } from '../../../apollo/user/query';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';
import { AgentEquipmentsInquiry } from '../../types/equipment/equipment.input';
import { Equipment } from '../../types/equipment/equipment';
import { EquipmentStatus } from '../../enums/equipment.enum';
import { EquipmentCard } from './EquipmentCard';

const MyEquipments: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<AgentEquipmentsInquiry>(initialInput);
	const [agentEquipments, setAgentEquipments] = useState<Equipment[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/
	const [updateEquipment] = useMutation(UPDATE_EQUIPMENT);

	const {
		loading: getAgentEquipmentsLoading,
		data: getAgentEquipmentsData,
		error: getAgentEquipmentsError,
		refetch: getAgentEquipmentsRefetch,
	} = useQuery(GET_AGENT_EQUIPMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentEquipments(data?.getAgentEquipments?.list);
			setTotal(data?.getAgentEquipments?.metaCounter[0]?.total ?? 0);
			console.log('Fetched Data:', getAgentEquipmentsData);
			console.log('Query Error:', getAgentEquipmentsError);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: EquipmentStatus) => {
		setSearchFilter({ ...searchFilter, search: { equipmentStatus: value } });
	};

	const deleteEquipmentHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure that you want to delete this equipment?')) {
				await updateEquipment({
					variables: {
						input: { _id: id, equipmentStatus: 'DELETE' },
					},
				});
				await getAgentEquipmentsRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const updateEquipmentHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(`Are you sure to change to ${status} status?`)) {
				await updateEquipment({
					variables: {
						input: { _id: id, equipmentStatus: status },
					},
				});
				await getAgentEquipmentsRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>VENUEHUB EQUIPMENTS MOBILE</div>;
	} else {
		return (
			<div id="my-property-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Equipments</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="property-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(EquipmentStatus.ACTIVE)}
							className={searchFilter.search.equipmentStatus === 'ACTIVE' ? 'active-tab-name' : 'tab-name'}
						>
							On Sale
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(EquipmentStatus.RENT)}
							className={searchFilter.search.equipmentStatus === 'RENT' ? 'active-tab-name' : 'tab-name'}
						>
							Rented
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(EquipmentStatus.MAINTENANCE)}
							className={searchFilter.search.equipmentStatus === 'MAINTENANCE' ? 'active-tab-name' : 'tab-name'}
						>
							On Maintenance
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(EquipmentStatus.RETIRED)}
							className={searchFilter.search.equipmentStatus === 'RETIRED' ? 'active-tab-name' : 'tab-name'}
						>
							Retired
						</Typography>
					</Stack>
					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Equipments</Typography>
							<Typography className="title-text">Condition</Typography>
							<Typography className="title-text">Created</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">View</Typography>
							<Typography className="title-text">Like</Typography>
							{searchFilter.search.equipmentStatus === 'ACTIVE' && (
								<Typography className="title-text">Action</Typography>
							)}
						</Stack>

						{agentEquipments?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Equipment found!</p>
							</div>
						) : (
							agentEquipments.map((equipment: Equipment) => {
								return (
									<EquipmentCard
										equipment={equipment}
										deleteEquipmentHandler={deleteEquipmentHandler}
										updateEquipmentHandler={updateEquipmentHandler}
									/>
								);
							})
						)}

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
			equipmentStatus: 'ACTIVE',
		},
	},
};

export default MyEquipments;
