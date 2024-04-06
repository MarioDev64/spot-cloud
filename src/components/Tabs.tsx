import { useEffect } from 'react';
import styles from '../styles/Home.module.css';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 45px;
`;

const Tab = styled.button`
	width: 98px;
	height: 31px;
	font-size: 16px;
	font-family: Roboto, sans-serif;
	text-align: center;
	justify-content: center;
	line-height: 28px;
	background-color: #fff;
	border-radius: 2px;
	border: solid 1px #d6d6d6;
	cursor: pointer;
`;

interface TabsProps {
	active: string;
}

const Tabs = ({ active }: TabsProps): JSX.Element => {
	const navigate = useNavigate();

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		switchTab(event.currentTarget.id);
	};

	const switchTab = (tab: string) => {
		switch (tab) {
			case 'all':
				navigate('/');
				break;
			case 'faves':
				navigate('favorites');
				break;
			default:
				navigate('/');
		}
	};

	useEffect(() => {
		let element = undefined;

		if (active === 'all') {
			element = document.getElementById('all');
			element?.classList.add(styles.tabActive);
		}

		if (active === 'faves') {
			element = document.getElementById('faves');
			element?.classList.add(styles.tabActive);
		}
	}, [active]);

	return (
		<Container>
			<Tab id="all" onClick={handleClick}>
				All
			</Tab>
			<Tab id="faves" onClick={handleClick}>
				My faves
			</Tab>
		</Container>
	);
};

export default Tabs;
