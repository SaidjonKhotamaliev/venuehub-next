import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '';

			switch (router.pathname) {
				case '/property':
					title = 'Venues Search';
					desc = 'Check Availability and Reserve Your Spot!';
					bgImage = '/img/banner/header5.jpg';
					break;
				case '/equipment':
					title = 'Equipment Search';
					desc = 'Premium Equipment Available for Rent!';
					bgImage = '/img/banner/header11.jpg';
					break;
				case '/agent':
					title = 'Agents';
					desc = 'Meet Our Experienced Managers';
					bgImage = '/img/banner/header7.jpg';
					break;
				case '/agent/detail':
					title = 'Agent Page';
					desc = 'Let Our Managers Handle Your Every Need';
					bgImage = '/img/banner/header7.jpg';
					break;
				case '/mypage':
					title = 'my page';
					desc = 'Manage Your Profile and Preferences';
					bgImage = '/img/banner/header10.jpg';
					break;
				case '/community':
					title = 'Articles';
					desc = 'Engage, Share, and Learn from Your Fellow Members';
					bgImage = '/img/banner/header8.jpg';
					break;
				case '/community/detail':
					title = 'Articles';
					desc = 'What’s New? Share Your Thoughts with Us!';
					bgImage = '/img/banner/header8.jpg';
					break;
				case '/cs':
					title = 'CS';
					desc = 'Important Notice!';
					bgImage = '/img/banner/header9.jpg';
					break;
				case '/account/join':
					title = 'Login/Signup';
					desc = 'Authentication Process';
					bgImage = '/img/banner/header2.svg';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'Member Page';
					desc = 'Managing Your Property or Event with Expertise and Care';
					bgImage = '/img/banner/header10.jpg';
					break;
				default:
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>VenueHub</title>
						<meta name={'title'} content={`VenueHub`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>VenueHub</title>
						<meta name={'title'} content={`VenueHub`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={`header-basic ${authHeader && 'auth'}`}
							style={{
								backgroundImage: `url(${memoizedValues.bgImage})`,
								backgroundSize: 'cover',
								boxShadow: 'inset 10px 40px 150px 40px rgb(24 22 36)',
							}}
						>
							<Stack className={'container'}>
								<strong>{t(memoizedValues.title)}</strong>
								<span>{t(memoizedValues.desc)}</span>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
