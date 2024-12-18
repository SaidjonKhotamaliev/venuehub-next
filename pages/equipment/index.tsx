import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Direction, Message } from '../../libs/enums/common.enum';
import { useMutation, useQuery } from '@apollo/client';
import { GET_EQUIPMENTS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { LIKE_TARGET_EQUIPMENT } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Equipment } from '../../libs/types/equipment/equipment';
import EquipmentCard from '../../libs/components/equipment/EquipmentCard';
import EquipmentFilter from '../../libs/components/equipment/EquipmentFilter';
import { EquipmentsInquiry } from '../../libs/types/equipment/equipment.input';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const EquipmentList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<EquipmentsInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [equipments, setEquipments] = useState<Equipment[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');

	/** APOLLO REQUESTS **/
	const [likeTargetEquipment] = useMutation(LIKE_TARGET_EQUIPMENT);

	const {
		loading: getEquipmentsLoading,
		data: getEquipmentsData,
		error: getEquipmentsError,
		refetch: getEquipmentsRefetch,
	} = useQuery(GET_EQUIPMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true, // refetching bolganda state ni update qilib loading ni korsatadi
		onCompleted: (data: T) => {
			setEquipments(data?.getEquipments?.list);
			setTotal(data?.getEquipments?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		getEquipmentsRefetch({ input: searchFilter }).then(); //no need
	}, [searchFilter]);

	/** HANDLERS **/
	const likeEquipmentHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetEquipment({
				variables: { input: id },
			});

			await getEquipmentsRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			console.log('ERROR, likeEquipmentHandler: ', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/equipment?input=${JSON.stringify(searchFilter)}`,
			`/equipment?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
				setFilterSortName('New');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'equipmentRentPrice', direction: Direction.ASC });
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'equipmentRentPrice', direction: Direction.DESC });
				setFilterSortName('Highest Price');
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <h1>EUIPMENTS MOBILE</h1>;
	} else {
		return (
			<div id="property-list-page" style={{ position: 'relative' }}>
				<div className="container">
					<Stack flexDirection={'row'}>
						<Stack className={'filter-config'}>
							{/* @ts-ignore */}
							<EquipmentFilter
								sortingOpen={sortingOpen}
								filterSortName={filterSortName}
								anchorEl={anchorEl}
								sortingHandler={sortingHandler}
								sortingCloseHandler={sortingCloseHandler}
								sortingClickHandler={sortingClickHandler}
								searchFilter={searchFilter}
								setSearchFilter={setSearchFilter}
								initialInput={initialInput}
							/>
						</Stack>
					</Stack>
					<Stack className={'property-page'}>
						<Stack className="main-config" mb={'76px'}>
							<Stack className={'list-config'}>
								{equipments?.length === 0 ? (
									<div className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No Equipments found!</p>
									</div>
								) : (
									equipments.map((equipment: Equipment) => {
										return (
											<EquipmentCard
												equipment={equipment}
												likeEquipmentHandler={likeEquipmentHandler}
												key={equipment?._id}
											/>
										);
									})
								)}
							</Stack>
							<Stack className="pagination-config">
								{equipments.length !== 0 && (
									<Stack className="pagination-box">
										<Pagination
											page={currentPage}
											count={Math.ceil(total / searchFilter.limit)}
											onChange={handlePaginationChange}
											shape="circular"
											color="secondary"
										/>
									</Stack>
								)}

								{equipments.length !== 0 && (
									<Stack className="total-result">
										<Typography>
											Total {total} equipment{total > 1 ? 's' : ''} available
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

EquipmentList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			pricesRangeEquipment: {
				start: 0,
				end: 50000,
			},
		},
	},
};

export default withLayoutBasic(EquipmentList);
