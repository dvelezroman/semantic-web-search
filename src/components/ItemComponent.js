import React from 'react';
import { ListItem, ListItemText, Grid, Typography, Divider } from '@material-ui/core';
import EmojiEmotionsOutlinedIcon from '@material-ui/icons/EmojiEmotionsOutlined';
import SentimentVeryDissatisfiedOutlinedIcon from '@material-ui/icons/SentimentVeryDissatisfiedOutlined';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	item: {
		flexDirection: 'column',
		alignItems: 'flex-start'
	}
}));

const ItemComponent = ({ item }) => {
	const classes = useStyles();
	const title = (
		<span>
			<a href={item.href}>{item.title}</a>
		</span>
	);

	const getSentimentFace = score => {
		if (score >= 3)
			return (
				<Typography variant='body2'>
					Sentimiento: <EmojiEmotionsOutlinedIcon />
				</Typography>
			);
		if (score >= -2 && score <= 2)
			return (
				<Typography variant='body2'>
					Sentimiento: <SentimentSatisfiedIcon />
				</Typography>
			);
		if (score < -2)
			return (
				<Typography variant='body2'>
					Sentimiento: <SentimentVeryDissatisfiedOutlinedIcon />
				</Typography>
			);
	};
	return (
		<>
			<ListItem className={classes.item}>
				<ListItemText primary={title} secondary={item.description} />
				<Grid item>
					{item?.author?.length > 1 && (
						<Typography variant='body2'>{`author: ${item.author}`}</Typography>
					)}
					<Typography variant='body2'>{item.date}</Typography>
					{getSentimentFace(item.sentimentScore.score)}
				</Grid>
			</ListItem>
			<Divider variant='inset' component='li' />
		</>
	);
};

export default ItemComponent;
