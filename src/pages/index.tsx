import { useState, useEffect, useCallback } from 'react';
import { FavoriteTopics, OptionType } from '../types';
import Header from '../shared/Header';
import styled from 'styled-components';
import Card from '../components/Card';
import Tabs from '../components/Tabs';
import LoadingSpinner from '../components/LoadingSpinner';
import Select from 'react-select';
import dropdownOptions from '../shared/dropdownOptions';
import SelectOption from '../components/SelectOptions';

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

const SpinnerPosition = styled.div`
	position: fixed;
	bottom: 50px;
	right: 50px;
	z-index: 555;
`;

const Home = () => {
	const [loadingData, setLoadingData] = useState<boolean>(false);
	const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
	const [postsData, setPostData] = useState<FavoriteTopics[]>([]);
	const [topicSelected, setTopicSelected] = useState<OptionType>(
		dropdownOptions[0]
	);
	const [page, setPage] = useState<number>(0);
	const [favoriteTopics, setFavoriteTopics] = useState<string[]>([]);

	useEffect(() => {
		requestPosts();
		window.addEventListener('scroll', isScrolling);
		return () => window.removeEventListener('scroll', isScrolling);
	}, []);

	useEffect(() => {
		if (loadingData) {
			moreData();
		}
	}, [loadingData]);

	useEffect(() => {
		requestPosts();
	}, [topicSelected]);

	useEffect(() => {
		checkLocalTopicSelected();
	}, [isFirstLoad]);

	useEffect(() => {
		checkLocalFavoriteStories();
	}, []);

	const requestPosts = useCallback(async () => {
		setLoadingData(true);
		const response = await fetch(
			`https://hn.algolia.com/api/v1/search_by_date?query=${topicSelected.value}&page=${page}`
		);
		const data = await response.json();
		const filteredData = data.hits.filter(
			({
				story_title,
				story_url,
				created_at,
				objectID
			}: FavoriteTopics) =>
				story_title !== null &&
				story_url !== null &&
				created_at !== null &&
				objectID !== null
		);
		setIsFirstLoad(false);
		setPostData([...postsData, ...filteredData]);
		setLoadingData(false);
	}, [topicSelected, page, postsData]);

	const moreData = async () => {
		setPage(page + 1);
		const response = await fetch(
			`https://hn.algolia.com/api/v1/search_by_date?query=${topicSelected.value}&page=${page}`
		);
		const data = await response.json();
		const filteredData = data.hits.filter(
			({
				story_title,
				story_url,
				created_at,
				objectID
			}: FavoriteTopics) =>
				story_title !== null &&
				story_url !== null &&
				created_at !== null &&
				objectID !== null
		);
		setPostData([...postsData, ...filteredData]);
		setLoadingData(false);
	};
	const isScrolling = () => {
		if (
			window.innerHeight + document.documentElement.scrollTop !==
			document.documentElement.offsetHeight
		) {
			return;
		}
		setLoadingData(true);
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

	const addLocalStoreFavoriteStory = (objectID: string) => {
		if (postsData.length > 0) {
			const currentFavoriteTopic = postsData?.find(
				(post) => post.objectID === objectID
			);
			const getLocalFavoriteTopics =
				localStorage.getItem('localFavoriteTopics') || '';
			let newLocalFavoriteTopics = [];

			if (
				typeof getLocalFavoriteTopics === 'string' &&
				getLocalFavoriteTopics !== ''
			) {
				const parseLocalFavoriteTopics = JSON.parse(
					getLocalFavoriteTopics
				);
				if (parseLocalFavoriteTopics.length > 0) {
					newLocalFavoriteTopics = parseLocalFavoriteTopics;
					const favoriteTopicAlreadyAdded =
						newLocalFavoriteTopics.find(
							(post: FavoriteTopics) => post.objectID === objectID
						);
					if (favoriteTopicAlreadyAdded === undefined) {
						newLocalFavoriteTopics.push(currentFavoriteTopic);
					} else {
						const removeFavoriteTopic =
							newLocalFavoriteTopics.filter(
								(post: FavoriteTopics) =>
									post.objectID !== objectID
							);
						newLocalFavoriteTopics = removeFavoriteTopic;
					}
				} else {
					newLocalFavoriteTopics.push(currentFavoriteTopic);
				}
			}

			localStorage.setItem(
				'localFavoriteTopics',
				JSON.stringify(newLocalFavoriteTopics)
			);
		}
	};

	const checkLocalFavoriteStories = () => {
		const getLocalFavoriteTopics =
			localStorage.getItem('localFavoriteTopics') || '';

		if (
			typeof getLocalFavoriteTopics === 'string' &&
			getLocalFavoriteTopics !== ''
		) {
			const parseLocalFavoriteTopics: FavoriteTopics[] = JSON.parse(
				getLocalFavoriteTopics
			);
			if (parseLocalFavoriteTopics.length > 0) {
				const newFavoriteTopics = parseLocalFavoriteTopics.map(
					(post) => {
						return post.objectID;
					}
				);
				setFavoriteTopics(newFavoriteTopics);
			}
		}
	};

	const addLocalStorageTopicSelected = (topicSelected: OptionType) => {
		localStorage.setItem('localTopicSelected', topicSelected.value);
	};

	const checkLocalTopicSelected = () => {
		if (isFirstLoad) {
			const getLocalTopicSelected =
				localStorage.getItem('localTopicSelected') || '';

			if (
				typeof getLocalTopicSelected === 'string' &&
				getLocalTopicSelected !== ''
			) {
				let getdropdownOptionsIndex = 0;
				dropdownOptions.find(({ value }, index) => {
					if (value === getLocalTopicSelected) {
						getdropdownOptionsIndex = index;
					}
				});

				setTopicSelected(dropdownOptions[getdropdownOptionsIndex]);
			}
		}
	};

	if (isFirstLoad) {
		return <div>Unpacking Posts...</div>;
	}

	return (
		<>
			<Header />
			{loadingData && (
				<SpinnerPosition>
					<LoadingSpinner />
				</SpinnerPosition>
			)}
			<Container>
				<Tabs active="all" />
				<Select
					value={topicSelected}
					options={dropdownOptions}
					formatOptionLabel={(technology) => (
						<SelectOption technology={technology} />
					)}
					onChange={(selectedOption) => {
						setTopicSelected(selectedOption as OptionType);
						addLocalStorageTopicSelected(
							selectedOption as OptionType
						);
						setPage(0);
						setPostData([]);
					}}
				/>
				<CardGrid>
					{postsData.map((post) => (
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
								addLocalStoreFavoriteStory
							}
						/>
					))}
				</CardGrid>
			</Container>
		</>
	);
};

export default Home;