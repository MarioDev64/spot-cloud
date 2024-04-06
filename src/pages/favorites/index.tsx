import { useState, useEffect, useCallback } from 'react';
import { FavoriteTopics } from '../../types';
import styled from 'styled-components';
import Header from '../../shared/Header';
import Card from '../../components/Card';
import Tabs from '../../components/Tabs';

const Container = styled.div`
	position: relative;
	padding: 0px 150px;
	background-color: #fcfcfc;
	@media (max-width: 820px) {
		padding: 0px 20px;
	}
`;

const CardGrid = styled.div`
	margin-top: 10px;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
	grid-gap: 20px;
	@media (max-width: 820px) {
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}
`;

const Favorites = () => {
	const [favoriteTopics, setFavoriteTopics] = useState<string[]>([]);
	const [postsData, setPostData] = useState<FavoriteTopics[]>([]);
	const [emptyPost, setEmptyPost] = useState<boolean>(true);

	const removeLocalStoreFavoriteStory = (objectID: string) => {
		const newPostData: FavoriteTopics[] = [];
		if (postsData.length > 0) {
			postsData.forEach((post) => {
				if (post.objectID !== objectID) {
					newPostData.push(post);
				}
			});

			localStorage.setItem(
				'localFavoriteTopics',
				JSON.stringify(newPostData)
			);
			setPostData(newPostData);
		}
	};

	const updateFavoriteStory = useCallback(
		(objectID: string) => {
			const newFavoriteTopics = favoriteTopics.includes(objectID)
				? favoriteTopics.filter((topic) => topic !== objectID)
				: [...favoriteTopics, objectID];
			setFavoriteTopics(newFavoriteTopics);
		},
		[favoriteTopics]
	);

	useEffect(() => {
		const localFavoriteTopics =
			localStorage.getItem('localFavoriteTopics') || '';

		if (
			typeof localFavoriteTopics === 'string' &&
			localFavoriteTopics !== ''
		) {
			const favoriteTopics = JSON.parse(localFavoriteTopics);
			if (favoriteTopics.length > 0) {
				const newFavoriteTopics = favoriteTopics.map(
					(post: FavoriteTopics) => {
						return post.objectID;
					}
				);
				setFavoriteTopics(newFavoriteTopics);
				setPostData(favoriteTopics);
				setEmptyPost(false);
			}else{
				setEmptyPost(true);
			}
		}
	}, []);

	return (
		<>
			<Header />
			<Container>
				<Tabs active="faves" />
				{emptyPost ? 'No favorite topics selected yet' : ''}
				<CardGrid>
					{postsData.map((post: FavoriteTopics) => (
						<Card
							key={post.objectID}
							objectID={post.objectID}
							story_title={post.story_title}
							story_url={post.story_url}
							created_at={post.created_at}
							author={post.author}
							isFavorite={favoriteTopics.includes(post.objectID)}
							updateFavoriteStory={updateFavoriteStory}
							updateLocalFavoriteStory={
								removeLocalStoreFavoriteStory
							}
						/>
					))}
				</CardGrid>
			</Container>
		</>
	);
};

export default Favorites;
