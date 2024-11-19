import { NoticeCategory, NoticeStatus, NoticeTopic } from '../../enums/notice.enum';

export interface NoticeUpdate {
	_id: string;
	noticeStatus?: NoticeStatus;
	noticeTopic?: NoticeTopic;
	noticeTitle?: string;
	noticeContent?: string;
}
export interface NoticeInquiry {
	noticeCategory: NoticeCategory;
	noticeStatus?: NoticeStatus;
}
export interface NoticeInquiryAgent {
	noticeCategory: NoticeCategory;
}
