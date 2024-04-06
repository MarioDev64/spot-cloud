import { StaticImageData } from 'next/image';

export interface FavoriteTopics {
	story_title: string;
	story_url: string;
	isFavorite?: boolean;
	created_at: string;
	author: string;
	objectID: string;
	story_id: number;
}

export interface OptionType {
	label: string;
	value: string;
	img: StaticImageData;
}
