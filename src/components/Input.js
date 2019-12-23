import React from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: '100%'
		}
	}
}));

const Input = ({ onTextChange, label }) => {
	const classes = useStyles();
	return (
		<form className={classes.root}>
			<TextField
				id='input-search'
				label={label}
				variant='outlined'
				onChange={event => {
					onTextChange(event.target.value);
				}}
			/>
		</form>
	);
};

export default Input;
