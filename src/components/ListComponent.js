import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import ItemComponent from './ItemComponent';

const useStyles = makeStyles(theme => ({
	root: {
		backgroundColor: theme.palette.background.paper
	}
}));

const ListComponent = ({ result }) => {
	const classes = useStyles();
	return (
		<List className={classes.root}>
			{result.map((item, index) => (
				<ItemComponent key={index} item={item}></ItemComponent>
			))}
		</List>
	);
};

export default ListComponent;
