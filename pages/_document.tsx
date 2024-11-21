import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/2.svg" />

				{/* SEO */}
				<meta name="keyword" content={'venuehub, venuehub.com, weding venues, wedding equipments'} />
				<meta
					name={'description'}
					content={
						`Plan your perfect event with VenueHub, England’s go-to platform for renting exceptional venues and premium equipment for any special occasion. From weddings and corporate conferences to private parties and community events, VenueHub connects you to the ideal spaces and top-notch equipment to make your event truly unforgettable.

						With a user-friendly platform, competitive pricing, and a vast selection of options, VenueHub makes event planning in England simple and hassle-free. Turn your vision into reality with VenueHub! |
						` +
						`Спланируйте свое идеальное мероприятие с помощью VenueHub, популярной английской платформы, где можно арендовать исключительные площадки и оборудование премиум-класса для любого особого случая. От свадеб и корпоративных конференций до частных вечеринок и общественных мероприятий — VenueHub предоставит вам идеальные помещения и первоклассное оборудование, чтобы сделать ваше мероприятие по-настоящему незабываемым.

						Благодаря удобной платформе, конкурентоспособным ценам и огромному выбору опций VenueHub делает планирование мероприятий в Англии простым и беспроблемным. Превратите свое видение в реальность с помощью VenueHub! |` +
						`특별한 행사를 위해 뛰어난 장소와 고급 장비를 대여할 수 있는 영국 최고의 플랫폼인 VenueHub를 통해 완벽한 이벤트를 계획하세요. 결혼식, 기업 컨퍼런스부터 개인 파티, 커뮤니티 이벤트까지 VenueHub는 귀하의 이벤트를 정말 잊지 못할 추억으로 만들어줄 이상적인 공간과 최고 수준의 장비를 제공합니다.

						사용자 친화적인 플랫폼, 경쟁력 있는 가격, 다양한 옵션을 갖춘 VenueHub는 영국에서 이벤트 계획을 간단하고 번거롭지 않게 만듭니다. VenueHub를 통해 비전을 현실로 바꿔보세요!`
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
