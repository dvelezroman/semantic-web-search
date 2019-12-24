import React from 'react';
import { ListItem, ListItemText, Grid, Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	item: {
		flexDirection: 'column',
		alignItems: 'flex-start'
	}
}));

const ItemComponent = ({ item }) => {
	const classes = useStyles();

	return (
		<>
			<ListItem className={classes.item}>
				<ListItemText primary={item.title} secondary={item.description} />
				<Grid item>
					{item.author.length > 1 && (
						<Typography variant='body2'>{`author: ${item.author}`}</Typography>
					)}
					<Typography variant='body2'>{item.date}</Typography>
				</Grid>
			</ListItem>
			<Divider variant='inset' component='li' />
		</>
	);
};

export default ItemComponent;
