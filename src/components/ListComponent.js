import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import ItemComponent from './ItemComponent';

const useStyles = makeStyles(them => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper
	}
}));

const ListComponent = ({ results }) => {
	const classes = useStyles();
	return (
		<List className={classes.root}>
			{results.map((item, index) => (
				<ItemComponent key={index}></ItemComponent>
			))}
		</List>
	);
};

export default ListComponent;
