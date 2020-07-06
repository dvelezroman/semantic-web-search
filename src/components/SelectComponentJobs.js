import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SelectComponentJobs({
  name,
  options,
  handleChange,
  selected,
  allOption,
}) {
  const classes = useStyles();

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-native-simple">{name}</InputLabel>
        <Select
          native
          value={selected}
          onChange={(event) => handleChange(event.target.value)}
          inputProps={{
            name: name,
            id: `${name}-native-simple`,
          }}
        >
          {allOption && <option value="All">{`All the jobs`}</option>}
          {options.map((option) => {
            return (
              <option value={option.name}>{`Job to process: ${option.name}`}</option>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
