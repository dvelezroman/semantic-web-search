import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Box } from '@material-ui/core';
import Input from '../components/Input';
import ButtonComponent from '../components/ButtonComponent';
import useSearch from '../hooks/useSearch';
import ListComponent from '../components/ListComponent';
import browser from 'webextension-polyfill';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import SelectComponent from '../components/SelectComponent';
import SelectComponentJobs from '../components/SelectComponentJobs';
import sites from '../resources/sites';
import SelectComponentNumbers from '../components/SelectComponentNumbers';

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
	// const { onSearch, allTitles } = useSearch();
	const [peers, setPeers] = useState([]);
	const [numPeers, setNumPeers] = useState(1);
	const [numJobs, setNumJobs] = useState(1);
	const [selectedPeer, setSelectedPeer] = useState('All');
	const [selectedJob, setSelectedJob] = useState('All');

	const handleSendAutomaticAction = () => {
		const triggerTime = performance.now();
		const num = peers.length;
		const sitesToProcess = sites.slice(1, numJobs);
		const sitesNum = sitesToProcess.length;
		let siteIndex = 0;
		let numId = 0;
		console.log({ numPeers });
		console.log({ sitesNum });
		for (let i in peers) {
			// reaparte un site a cada peer
			if (peers.hasOwnProperty(i)) {
				if (numId < numPeers - 1) {
					numId = numId + 1;
					const data = {
						peer: peers[i].username,
						job: sitesToProcess[siteIndex].name,
						group: {
							triggerTime,
							num,
							numId
						}
					};
					if (siteIndex < numPeers - 1) siteIndex = siteIndex + 1;
					else break;
					browser.runtime.sendMessage({
						type: 'send',
						data
					});
				} else {
					break;
				}
			}
		}
		// si todavia queda un site envialo local
		const data = {
			peer: 'myself',
			job: sites[0].name,
			numJobs: 1,
			group: {
				triggerTime,
				num,
				numId: 0
			}
		};
		browser.runtime.sendMessage({
			type: 'local',
			data
		});
	};

	const handleSendLocalAction = () => {
		// TODO: how to get my own username
		const data = {
			job: 'All',
			numJobs
		};
		browser.runtime.sendMessage({
			type: 'local',
			data
		});
	};

	const handleSendAction = () => {
		const data = {
			peer: selectedPeer,
			job: selectedJob
		};

		browser.runtime.sendMessage({
			type: 'send',
			data
		});
	};

	return (
		<>
			<Grid container className={classes.root} spacing={2}>
				<Grid item xs={12}>
					<Typography component='div'>
						<Box color='black' fontWeight='fontWeightBold' fontSize={24} m={1}>
							Ivi P2P news scrapper
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
					<SelectComponentNumbers
						options={sites}
						label={'# sites'}
						name='site-select-number'
						value={numJobs}
						onChange={setNumJobs}
					/>
					{/* <FormControl className={classes.formControl}>
						<InputLabel htmlFor='sites-num-native-simple'>{'Select # sites to Process'}</InputLabel>
						<Select
							native
							value={numJobs}
							onChange={event => setNumJobs(event.target.value)}
							inputProps={{
								name: 'sitesNum',
								id: `sites-num-native-simple`
							}}
						>
							{sites.map((option, i) => {
								return <option value={i}>{i}</option>;
							})}
						</Select>
					</FormControl> */}
				</Grid>
				<Grid item xs={12}>
					<SelectComponentNumbers
						options={Object.keys(peers)}
						label={'# Peers'}
						name='peers-select-number'
						value={numPeers}
						onChange={setNumPeers}
					/>
					{/* <FormControl className={classes.formControl}>
						<InputLabel htmlFor='pe-num-native-simple'>{'Select # peers to send'}</InputLabel>
						<Select
							native
							value={numPeers}
							onChange={event => setNumPeers(event.target.value)}
							inputProps={{
								name: 'peersNum',
								id: `peers-num-native-simple`
							}}
						>
							{peers.map((option, i) => {
								return <option value={i}>{i}</option>;
							})}
						</Select>
					</FormControl> */}
				</Grid>
				<Grid item xs={12}>
					<Grid container justify='center' spacing={4}>
						{/* <Grid item xs={6}>
							<Input label='Search' value={text} onTextChange={setText} />
						</Grid> */}
						<Grid item xs={6} className={classes.button}>
							<ButtonComponent
								color={'primary'}
								text='Local Process'
								onPress={() => handleSendLocalAction()}
							/>
						</Grid>
					</Grid>
					<Grid container justify='center' spacing={4}>
						{/* <Grid item xs={6}>
							<Input label='Search' value={text} onTextChange={setText} />
						</Grid> */}
						<Grid item xs={6} className={classes.button}>
							<ButtonComponent
								color={'primary'}
								text='Send to Selected Peer'
								onPress={() => handleSendAction()}
							/>
						</Grid>
					</Grid>
					<Grid container justify='center' spacing={4}>
						{/* <Grid item xs={6}>
							<Input label='Search' value={text} onTextChange={setText} />
						</Grid> */}
						<Grid item xs={6} className={classes.button}>
							<ButtonComponent
								color={'primary'}
								text='Automatic Send'
								onPress={() => handleSendAutomaticAction()}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid container className={classes.root} spacing={2}>
				{/* <Grid item xs={12}>
					<Typography component='div'>
						<Box color='black' fontWeight='fontWeightBold' fontSize={24} m={1}>
							Results
						</Box>
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<ListComponent result={allTitles} />
				</Grid> */}
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
