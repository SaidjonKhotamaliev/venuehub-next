import React, { useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Stack, Typography } from '@mui/material';
import PropertyCard from '../property/PropertyCard';
import EquipmentCard from '../equipment/EquipmentCard';
import { Property } from '../../types/property/property';
import { T } from '../../types/common';
import { GET_FAVORITES } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_EQUIPMENT, LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert } from '../../sweetAlert';
import { Equipment } from '../../types/equipment/equipment';

const MyFavorites: NextPage = () => {
	const device = useDeviceDetect();
	const [myFavorites, setMyFavorites] = useState<(Property | Equipment)[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFavorites, setSearchFavorites] = useState<T>({ page: 1, limit: 6 });

	/** APOLLO REQUESTS **/

	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);
	const [likeTargetEquipment] = useMutation(LIKE_TARGET_EQUIPMENT);

	const {
		loading: getFavoritesLoading,
		data: getFavoritesData,
		error: getFavoritesError,
		refetch: getFavoritesRefetch,
	} = useQuery(GET_FAVORITES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFavorites },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMyFavorites(data?.getFavorites?.list);
			setTotal(data?.getFavorites?.metaCounter[0]?.total ?? 0);
			console.log('Query Error:', getFavoritesError);
		},
	});
	const { getFavorites } = getFavoritesData || {};
	const equipmentList = getFavorites?.equipments?.list as Equipment[] | undefined;
	const propertyList = getFavorites?.properties?.list as Property[] | undefined;

	/** HANDLERS **/
	const likePropertyHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetProperty({
				variables: { input: id },
			});

			await getFavoritesRefetch({ input: searchFavorites });
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler: ', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};
	const likeEquipmentHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetEquipment({
				variables: { input: id },
			});

			await getFavoritesRefetch({ input: searchFavorites });
		} catch (err: any) {
			console.log('ERROR, likeEquipmentHandler: ', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchFavorites({ ...searchFavorites, page: value });
	};

	if (device === 'mobile') {
		return <div>VENUEHUB MY FAVORITES MOBILE</div>;
	} else {
		return (
			<div id="my-favorites-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Favorites</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="favorites-list-box">
					{equipmentList?.length
						? equipmentList.map((equipment: Equipment) => (
								<EquipmentCard
									key={equipment._id}
									equipment={equipment}
									myFavorites={true}
									likeEquipmentHandler={likeEquipmentHandler}
								/>
						  ))
						: null}

					{propertyList?.length
						? propertyList.map((property: Property) => (
								<PropertyCard
									key={property._id}
									property={property}
									myFavorites={true}
									likePropertyHandler={likePropertyHandler}
								/>
						  ))
						: null}

					{!equipmentList?.length && !propertyList?.length && (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>No Favorites found!</p>
						</div>
					)}
				</Stack>

				{myFavorites?.length ? (
					<Stack className="pagination-config">
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(total / searchFavorites.limit)}
								page={searchFavorites.page}
								shape="circular"
								color="secondary"
								onChange={paginationHandler}
							/>
						</Stack>
						<Stack className="total-result">
							<Typography>
								Total {total} favorite propert{total > 1 ? 'ies' : 'y'}
							</Typography>
						</Stack>
					</Stack>
				) : null}
			</div>
		);
	}
};

export default MyFavorites;
