import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},
	selectEmpty: {
		marginTop: theme.spacing(2)
	}
}));

export default function SelectComponentNumbers({ options, label, name, value, onChange }) {
	const classes = useStyles();

	return (
		<div>
			<FormControl className={classes.formControl}>
				<InputLabel htmlFor={`${name}-native-simple`}>{label}</InputLabel>
				<Select
					native
					value={value}
					onChange={event => {
						console.log(event.target.value);
						onChange(parseInt(event.target.value));
					}}
					inputProps={{
						name: name,
						id: `${name}-native-simple`
					}}
				>
					{options.map((option, i) => {
						return <option value={i + 1}>{i + 1}</option>;
					})}
				</Select>
			</FormControl>
		</div>
	);
}
