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

export default function SelectComponent({
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
          {allOption && <option value="All">{`All`}</option>}
          {Object.keys(options).map((key) => {
            const item = options[key];
            return <option value={item.username}>{item.username}</option>;
          })}
        </Select>
      </FormControl>
    </div>
  );
}
