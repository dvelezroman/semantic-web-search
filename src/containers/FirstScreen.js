import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline, Typography, Container, Paper, Grid } from '@material-ui/core';
import Input from '../components/Input';
import ButtonComponent from '../components/ButtonComponent';
import useSearch from '../hooks/useSearch';
import ListComponent from '../components/ListComponent';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1
	},
	paper: {
		height: 140,
		width: 100
	},
	button: {
		margin: theme.spacing(1)
	},
	results: {
		padding: theme.spacing(2)
	}
}));

const FirstScreen = () => {
	const classes = useStyles();
	const { onSearch } = useSearch();
	const [text, setText] = useState('');
	const [result, setResult] = useState([]);

	const handleSearch = async () => {
		const response = await onSearch(text);
		setResult(response);
		console.log({ response });
	};

	return (
		<>
			<Grid container className={classes.root} spacing={2}>
				<Grid item xs={12}>
					<Typography variant='subtitle1' gutterBottom>
						Ivi information search
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Grid container justify='center' spacing={4}>
						<Grid item xs={6}>
							<Input label='Search' value={text} onTextChange={setText} />
						</Grid>
						<Grid item xs={6} className={classes.button}>
							<ButtonComponent
								color={'primary'}
								text='Go get it...'
								onPress={() => handleSearch()}
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Paper className={classes.results}>
						<Grid container>
							<Grid item>{/* Results */}</Grid>
						</Grid>
					</Paper>
				</Grid>
			</Grid>
			<Grid container className={classes.root} spacing={2}>
				<ListComponent result={result} />
			</Grid>
		</>
	);
};

export default FirstScreen;

{
	/* <Fragment>
<CssBaseline></CssBaseline>
<Container maxWidth='sm'>
  <Typography
    component='div'
    style={{ backgroundColor: '#cfe8fc', height: '100vh' }}
  ></Typography>
</Container>
</Fragment> */
}
