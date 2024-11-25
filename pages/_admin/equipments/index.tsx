import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { PropertyPanelList } from '../../../libs/components/admin/properties/PropertyList';
import { Property } from '../../../libs/types/property/property';
import { PropertyLocation } from '../../../libs/enums/property.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { PropertyUpdate } from '../../../libs/types/property/property.update';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_EQUIPMENTS_BY_ADMIN } from '../../../apollo/admin/query';
import {
	REMOVE_EQUIPMENT_BY_ADMIN,
	REMOVE_PROPERTY_BY_ADMIN,
	UPDATE_EQUIPMENT_BY_ADMIN,
	UPDATE_PROPERTY_BY_ADMIN,
} from '../../../apollo/admin/mutation';
import { T } from '../../../libs/types/common';
import { AllEquipmentsInquiry } from '../../../libs/types/equipment/equipment.input';
import { Equipment } from '../../../libs/types/equipment/equipment';
import { EquipmentCondition, EquipmentStatus } from '../../../libs/enums/equipment.enum';
import { EquipmentPanelList } from '../../../libs/components/admin/equipments/EquipmentList';

const AdminEquipments: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [equipmentsInquiry, setEquipmentsInquiry] = useState<AllEquipmentsInquiry>(initialInquiry);
	const [equipments, setEquipments] = useState<Equipment[]>([]);
	const [equipmentsTotal, setEquipmentsTotal] = useState<number>(0);
	const [value, setValue] = useState(
		equipmentsInquiry?.search?.equipmentStatus ? equipmentsInquiry?.search?.equipmentStatus : 'ALL',
	);
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/

	const [updateEquipmentByAdmin] = useMutation(UPDATE_EQUIPMENT_BY_ADMIN);
	const [removeEquipmentByAdmin] = useMutation(REMOVE_EQUIPMENT_BY_ADMIN);

	const {
		loading: getAllEquipmentsByAdminLoadiing,
		data: getAllEquipmentsByAdminData,
		error: getAllEquipmentsByAdminError,
		refetch: getAllEquipmentsByAdminRefetch,
	} = useQuery(GET_ALL_EQUIPMENTS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: equipmentsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setEquipments(data?.getAllEquipmentsByAdmin?.list);
			setEquipmentsTotal(data?.getAllEquipmentsByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});
	if (getAllEquipmentsByAdminError) {
		console.error('getAllMembersByAdminError: ', getAllEquipmentsByAdminError);
	}

	/** LIFECYCLES **/
	useEffect(() => {
		getAllEquipmentsByAdminRefetch({ input: equipmentsInquiry }).then();
	}, [equipmentsInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		equipmentsInquiry.page = newPage + 1;
		await getAllEquipmentsByAdminRefetch({ input: equipmentsInquiry });
		setEquipmentsInquiry({ ...equipmentsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		equipmentsInquiry.limit = parseInt(event.target.value, 10);
		equipmentsInquiry.page = 1;
		await getAllEquipmentsByAdminRefetch({ input: equipmentsInquiry });
		setEquipmentsInquiry({ ...equipmentsInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setEquipmentsInquiry({ ...equipmentsInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setEquipmentsInquiry({ ...equipmentsInquiry, search: { equipmentStatus: EquipmentStatus.ACTIVE } });
				break;
			case 'RENT':
				setEquipmentsInquiry({ ...equipmentsInquiry, search: { equipmentStatus: EquipmentStatus.RENT } });
				break;
			case 'MAINTENANCE':
				setEquipmentsInquiry({ ...equipmentsInquiry, search: { equipmentStatus: EquipmentStatus.MAINTENANCE } });
				break;
			case 'RETIRED':
				setEquipmentsInquiry({ ...equipmentsInquiry, search: { equipmentStatus: EquipmentStatus.RETIRED } });
				break;
			default:
				delete equipmentsInquiry?.search?.equipmentStatus;
				setEquipmentsInquiry({ ...equipmentsInquiry });
				break;
		}
	};

	const removeEquipmentHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to delete?')) {
				await removeEquipmentByAdmin({
					variables: {
						input: id,
					},
				});

				await getAllEquipmentsByAdminRefetch({ input: equipmentsInquiry });
			}
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updateEquipmentHandler = async (updateData: PropertyUpdate) => {
		try {
			await updateEquipmentByAdmin({
				variables: {
					input: updateData,
				},
			});
			menuIconCloseHandler();
			await getAllEquipmentsByAdminRefetch({ input: equipmentsInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Equipments List
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'ACTIVE')}
									value="ACTIVE"
									className={value === 'ACTIVE' ? 'li on' : 'li'}
								>
									Active
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'RENT')}
									value="RENT"
									className={value === 'RENT' ? 'li on' : 'li'}
								>
									Rent
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'MAINTENANCE')}
									value="MAINTENANCE"
									className={value === 'MAINTENANCE' ? 'li on' : 'li'}
								>
									Maintenance
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'RETIRED')}
									value="RETIRED"
									className={value === 'RETIRED' ? 'li on' : 'li'}
								>
									Retired
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={searchType}>
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
										ALL
									</MenuItem>
									{Object.values(PropertyLocation).map((location: string) => (
										<MenuItem value={location} onClick={() => searchTypeHandler(location)} key={location}>
											{location}
										</MenuItem>
									))}
								</Select>
							</Stack>
							<Divider />
						</Box>
						<EquipmentPanelList
							equipments={equipments}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateEquipmentHandler={updateEquipmentHandler}
							removeEquipmentHandler={removeEquipmentHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={equipmentsTotal}
							rowsPerPage={equipmentsInquiry?.limit}
							page={equipmentsInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminEquipments.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminEquipments);
