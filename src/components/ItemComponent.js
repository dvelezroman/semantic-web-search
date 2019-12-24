import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, ListItemText } from '@material-ui/core';

const useStyles = makeStyles(theme => ({}));

const ItemComponent = ({ item }) => {
	return (
		<ListItem>
			<ListItemText primary={item} secondary={'Description'}></ListItemText>
		</ListItem>
	);
};

export default ItemComponent;
