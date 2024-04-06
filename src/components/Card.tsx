
import styled from 'styled-components';
import NonFavoriteIcon from '../assets/img/iconmonstr-favorite-2.svg';
import FavoriteIcon from '../assets/img/iconmonstr-favorite-3.svg';
import TimeIcon from '../assets/img/iconmonstr-time-2.svg';
import { formatDistance } from 'date-fns';

const CardParent = styled.div`
	padding: 26px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border: 2px solid #979797;
	border-radius: 6px;
	position: relative;
	overflow: hidden;
	background-color: #fff;
	&:hover{
		opacity: 0.7;
	}
`;

const FavoriteBox = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	width: 15%;
	height: 100%;
	background-color: #fcfcfc;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
`;

const TimeAgo = styled.p`
	font-size: 11px;
	fontfamily: Roboto, sans-serif;
	color: #767676;
	display: flex;
	align-items: center;
	span {
		margin-left: 5px;
	}
`;

const Title = styled.h3`
	width: 95%;
	font-family: Roboto-Medium, sans-serif;
	font-size: 14px;
	letter-spacing: 0.5px;
	line-height: 20px;
	color: #6b6b6b;
	a {
		width: 100%;
	}
`;

interface CardProps {
	story_title: string;
	story_url: string;
	isFavorite?: boolean;
	created_at: string;
	author: string;
	objectID: string,
	updateFavoriteStory: (objectID: string) => void;
	updateLocalFavoriteStory: (objectID: string) => void;
}

const Card = ({
	story_title,
	story_url,
	isFavorite,
	created_at,
	author,
	objectID,
	updateFavoriteStory,
	updateLocalFavoriteStory
}: CardProps): JSX.Element => {
	return (
		<CardParent>
			<div>
				<TimeAgo>
					<img
						src={TimeIcon}
						alt="Time ago icon"
						width={16}
						height={16}
					/>
					<span>
						{formatDistance(new Date(created_at), new Date())} ago by { author }
					</span>
				</TimeAgo>
				<Title>
					<a target="_blank" rel="noreferrer" href={story_url}>
						{story_title}
					</a>
				</Title>
			</div>
			<FavoriteBox onClick={() => {
					updateFavoriteStory(objectID)
					updateLocalFavoriteStory(objectID)
				}}>
				{isFavorite ? (
					<img
						alt="Favorite heart"
						src={FavoriteIcon}
						width={22}
						height={22}
					/>
				) : (
					<img
						alt="Non Favorite heart"
						src={NonFavoriteIcon}
						width={22}
						height={22}
					/>
				)}
			</FavoriteBox>
		</CardParent>
	);
};

export default Card;
