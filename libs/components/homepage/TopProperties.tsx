import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import TopPropertyCard from './TopPropertyCard';
import { PropertiesInquiry } from '../../types/property/property.input';
import { Property } from '../../types/property/property';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import Link from 'next/link';

interface TopPropertiesProps {
	initialInput: PropertiesInquiry;
}

const TopProperties = (props: TopPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [topProperties, setTopProperties] = useState<Property[]>([]);

	// /** APOLLO REQUESTS **/
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopProperties(data?.getProperties?.list);
			console.log('top.Properties: ', topProperties);
		},
	});

	/** HANDLERS **/

	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetProperty({
				variables: { input: id },
			});

			await getPropertiesRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			console.log('ERROR, likfePropertyHandler: ', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'top-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top properties</span>
					</Stack>
					<Stack className={'card-box'}>
						<Stack flexDirection={'row'} className={'top-properties-box'}>
							<Stack></Stack>
							<Stack flexDirection={'row'}>
								<Stack flexDirection={'column'}>
									<Stack flexDirection={'row'}></Stack>
									<Stack flexDirection={'row'}></Stack>
								</Stack>
								<Stack flexDirection={'column'}>
									<Stack flexDirection={'row'}></Stack>
									<Stack flexDirection={'row'}></Stack>
								</Stack>
							</Stack>
						</Stack>
						<Stack flexDirection={'row'} className={'top-properties-box'}>
							<Stack flexDirection={'row'}>
								<Stack flexDirection={'column'}>
									<Stack flexDirection={'row'}></Stack>
									<Stack flexDirection={'row'}></Stack>
								</Stack>
								<Stack flexDirection={'column'}>
									<Stack flexDirection={'row'}></Stack>
									<Stack flexDirection={'row'}></Stack>
								</Stack>
								<Stack></Stack>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'top-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Top properties</span>
							<p>Check out our Top Properties</p>
						</Box>
					</Stack>

					<Box className="card-box">
						<Box className="top-properties-grid">
							{/* Big Top Properties Boxes */}
							<Box className="big-top-properties-box">
								<TopPropertyCard property={topProperties[0]} likePropertyHandler={likePropertyHandler} />
							</Box>

							<Box className="big-top-properties-box">
								{/* Nested grid structure for mid and small boxes */}
								<Box className="mid-top-properties-box">
									<Box className="small-top-properties-box">
										<TopPropertyCard property={topProperties[1]} likePropertyHandler={likePropertyHandler} />{' '}
									</Box>
									<Box className="small-top-properties-box">
										{' '}
										<TopPropertyCard property={topProperties[2]} likePropertyHandler={likePropertyHandler} />{' '}
									</Box>
								</Box>
								<Box className="mid-top-properties-box">
									<Box className="small-top-properties-box">
										{' '}
										<TopPropertyCard property={topProperties[3]} likePropertyHandler={likePropertyHandler} />{' '}
									</Box>
									<Box className="small-top-properties-box">
										{' '}
										<TopPropertyCard property={topProperties[4]} likePropertyHandler={likePropertyHandler} />{' '}
									</Box>
								</Box>
							</Box>

							<Box className="big-top-properties-box">
								{/* Nested grid structure for mid and small boxes */}
								<Box className="mid-top-properties-box">
									<Box className="small-top-properties-box">
										{' '}
										<TopPropertyCard property={topProperties[5]} likePropertyHandler={likePropertyHandler} />{' '}
									</Box>
									<Box className="small-top-properties-box">
										{' '}
										<TopPropertyCard property={topProperties[6]} likePropertyHandler={likePropertyHandler} />{' '}
									</Box>
								</Box>
								<Box className="mid-top-properties-box">
									<Box className="small-top-properties-box">
										{' '}
										<TopPropertyCard property={topProperties[7]} likePropertyHandler={likePropertyHandler} />
									</Box>
									<Box className="small-top-properties-box">
										<TopPropertyCard property={topProperties[8]} likePropertyHandler={likePropertyHandler} />{' '}
									</Box>
								</Box>
							</Box>

							<Box className="big-top-properties-box">
								<TopPropertyCard property={topProperties[9]} likePropertyHandler={likePropertyHandler} />{' '}
							</Box>
						</Box>
					</Box>

					<Box className={'top-all-btn'} style={{ width: '114px', height: '34px', marginTop: '500px' }}>
						<Link href={'/property'} style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
							<span>See All</span>
							<img
								src="/img/icons/rightup.svg"
								alt=""
								width={'13px'}
								height={'18px'}
								style={{ filter: 'brightness(0) invert(1)' }}
							/>
						</Link>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

TopProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'propertyRentPrice',
		direction: 'DESC',
		search: {},
	},
};

export default TopProperties;
