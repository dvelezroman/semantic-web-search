/* global chrome*/
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Box } from '@material-ui/core';
import Input from '../components/Input';
import ButtonComponent from '../components/ButtonComponent';
import useSearch from '../hooks/useSearch';
import ListComponent from '../components/ListComponent';
import SelectComponentJobs from '../components/SelectComponentJobs';
import sites from '../resources/sites';
import SelectComponentNumbers from '../components/SelectComponentNumbers';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: 600,
  },
  paper: {
    height: 140,
    width: 100,
  },
  button: {
    margin: theme.spacing(1),
  },
  results: {
    padding: theme.spacing(2),
  },
}));

const ControlPanel = () => {
  const classes = useStyles();
  // const { onSearch, allTitles } = useSearch();
  const [numJobs, setNumJobs] = useState(1);
  const [selectedJob, setSelectedJob] = useState('All');

  const handleSendLocalAction = () => {
    // TODO: how to get my own username
    const data = {
      job: 'All',
      numJobs,
    };
    chrome.runtime.sendMessage({
      type: 'local',
      data,
    });
  };

  const sendMessage = () =>
    new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          type: 'clearStorage',
        },
        (response) => {
          if (response.complete) {
            resolve(response.farewell);
          } else {
            reject('Something wrong...');
          }
        }
      );
    });

  const handleClearStorage = async () => {
    await sendMessage();
  };

  return (
    <>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Typography component="div">
            <Box color="black" fontWeight="fontWeightBold" fontSize={24} m={1}>
              IVI WEB NEWS SCRAPPER
            </Box>
          </Typography>
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
            name="site-select-number"
            value={numJobs}
            onChange={setNumJobs}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={4}>
            {/* <Grid item xs={6}>
              <Input label="Search" value={text} onTextChange={setText} />
            </Grid> */}
            <Grid item xs={6} className={classes.button}>
              <ButtonComponent
                color={'primary'}
                text="Local Process"
                onPress={() => handleSendLocalAction()}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={4}>
            {/* <Grid item xs={6}>
              <Input label="Search" value={text} onTextChange={setText} />
            </Grid> */}
            <Grid item xs={6} className={classes.button}>
              <ButtonComponent
                color={'primary'}
                text="Clean storage"
                onPress={handleClearStorage}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container className={classes.root} spacing={2}>
        {/* <Grid item xs={12}>
          <Typography component="div">
            <Box color="black" fontWeight="fontWeightBold" fontSize={24} m={1}>
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

export default ControlPanel;
