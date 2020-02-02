import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Box } from '@material-ui/core';
import Input from '../components/Input';
import ButtonComponent from '../components/ButtonComponent';
import useSearch from '../hooks/useSearch';
import ListComponent from '../components/ListComponent';
import browser from 'webextension-polyfill';
import SelectComponent from '../components/SelectComponent';
import SelectComponentJobs from '../components/SelectComponentJobs';
import sites from '../resources/sites';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		width: 600
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
	useEffect(() => {
		try {
			browser.storage.local.get('peers', ({ peers }) => {
				setPeers(peers);
			});
		} catch (e) {
			console.log({ e });
		}
	}, []);

	const classes = useStyles();
	const { onSearch, allTitles } = useSearch();
	const [peers, setPeers] = useState([]);
	const [selectedPeer, setSelectedPeer] = useState('All');
	const [selectedJob, setSelectedJob] = useState('Select');

	const handleSendAction = () => {
		if (selectedJob !== 'Select') {
			const data = {
				peer: selectedPeer,
				job: selectedJob
			};

			browser.runtime.sendMessage({
				type: 'send',
				data
			});
		} else {
			alert('You have to select one job for a selected peer to process.');
		}
	};

	return (
		<>
			<Grid container className={classes.root} spacing={2}>
				<Grid item xs={12}>
					<Typography component='div'>
						<Box color='black' fontWeight='fontWeightBold' fontSize={24} m={1}>
							Ivi information search
						</Box>
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<SelectComponent
						name={'Peers'}
						allOption
						options={peers}
						selected={selectedPeer}
						handleChange={setSelectedPeer}
					/>
				</Grid>
				<Grid item xs={12}>
					<SelectComponentJobs
						name={'Jobs'}
						allOption
						options={sites}
						selected={selectedJob}
						handleChange={setSelectedJob}
					/>
				</Grid>
				<Grid item xs={12}>
					<Grid container justify='center' spacing={4}>
						{/* <Grid item xs={6}>
							<Input label='Search' value={text} onTextChange={setText} />
						</Grid> */}
						<Grid item xs={6} className={classes.button}>
							<ButtonComponent
								color={'primary'}
								text='Go get it...'
								onPress={() => handleSendAction()}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid container className={classes.root} spacing={2}>
				<Grid item xs={12}>
					{/* <Typography component='div'>
						<Box color='black' fontWeight='fontWeightBold' fontSize={24} m={1}>
							Results
						</Box>
					</Typography> */}
				</Grid>
				<Grid item xs={12}>
					<ListComponent result={allTitles} />
				</Grid>
			</Grid>
		</>
	);
};

export default FirstScreen;

// const sendUrlCustom = () => {
// 	try {
// 		let usuarios = document.getElementById('listusers');
// 		let usuarioSelected = usuarios.selectedIndex;
// 		let usuario = '';

// 		if (usuarioSelected != undefined && usuarioSelected >= 0) {
// 			usuario = usuarios.options[usuarioSelected].value;
// 			p2pExtension.sendRequest(
// 				{
// 					data: {
// 						url: url.value
// 					}
// 				},
// 				usuario
// 			);
// 		}
// 	} catch (error) {
// 		console.log('Error al utilizar sendurl');
// 	}
// };

// const loadUsersCustom = event => {
// 	try {
// 		let listaUsuarios = p2pExtension.getDataCallBack();

// 		if (listaUsuarios != null || listaUsuarios != undefined || listaUsuarios !== 'undefined') {
// 			let usuarios = document.getElementById('listusers');
// 			let optionOne = new Option('All', 'All');
// 			usuarios.options.length = 0;
// 			usuarios.options[usuarios.options.length] = optionOne;
// 			for (let i in listaUsuarios) {
// 				if (listaUsuarios.hasOwnProperty(i)) {
// 					console.log('Key is: ' + i + '. Value is: ' + listaUsuarios[i]);
// 					let optionNew = new Option(listaUsuarios[i].username, listaUsuarios[i].username);
// 					usuarios.options[usuarios.options.length] = optionNew;
// 				}
// 			}
// 		}
// 	} catch (e) {
// 		console.log('Error al cargar lista de usuarios');
// 		console.log(e);
// 	}
// };
