import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_EQUIPMENTS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { Equipment } from '../../types/equipment/equipment';
import PopularEquipmentCard from './PopularEquipmentCard';
import { EquipmentsInquiry } from '../../types/equipment/equipment.input';

interface PopularEquipmentsProps {
	initialInput: EquipmentsInquiry;
}

const PopularEquipments = (props: PopularEquipmentsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularEquipments, setPopularEquipments] = useState<Equipment[]>([]);

	/** APOLLO REQUESTS **/

	const {
		loading: getEquipmentsLoading,
		data: getEquipmentsData,
		error: getEquipmentsError,
		refetch: getEquipmentsRefetch,
	} = useQuery(GET_EQUIPMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setPopularEquipments(data?.getEquipments?.list);
		},
	});

	/** HANDLERS **/

	if (!popularEquipments) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-equipments'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Popular equipments</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-equipment-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={25}
							modules={[Autoplay]}
						>
							{popularEquipments.map((equipment) => {
								return (
									<SwiperSlide key={equipment._id} className={'popular-equipment-slide'}>
										<PopularEquipmentCard equipment={equipment} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'popular-equipments'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Popular equipments</span>
							<p>Popularity is based on views</p>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-equipment-swiper'}
							slidesPerView={'auto'}
							spaceBetween={25}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
							}}
						>
							{popularEquipments.map((equipment) => {
								return (
									<SwiperSlide key={equipment._id} className={'popular-equipment-slide'}>
										<PopularEquipmentCard equipment={equipment} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon className={'swiper-popular-next'} />
					</Stack>
					<Stack alignItems={'flex-start'} marginTop={'10px'} style={{ width: '100%' }}>
						<Box className={'top-all-btn'} style={{ width: '114px', height: '34px' }}>
							<Link href={'/equipment'} style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
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
			</Stack>
		);
	}
};

PopularEquipments.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'equipmentViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularEquipments;
