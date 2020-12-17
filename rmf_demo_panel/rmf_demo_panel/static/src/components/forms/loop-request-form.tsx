import * as React from "react";
import { Box, Button, TextField, Typography } from "@material-ui/core";
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';
import { useFormStyles } from '../styles';

interface LoopDescription {
  num_loops: number,
  start_name: string,
  finish_name: string
}

interface LoopFormProps {
  availablePlaces: string[]
}

const LoopRequestForm = (props: LoopFormProps): React.ReactElement => {
  const { availablePlaces } = props;
  const [startLocation, setStartLocation] = React.useState("");
  const [endLocation, setEndLocation] = React.useState("");
  const [places, setPlaces] = React.useState(availablePlaces);
  const [numLoops, setNumLoops] = React.useState(1);
  const [minsFromNow, setMinsFromNow] = React.useState(0);
  const [evaluator, setEvaluator] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState("");

  const classes = useFormStyles();

  React.useEffect(() => {
    setPlaces(availablePlaces)
  }, [availablePlaces]);

  const isFormValid = () => {
    if(startLocation == endLocation) {
      setErrorMessage("Start and end locations cannot be the same");
      return false;
    } else if(numLoops <= 0) {
      setErrorMessage("Number of loops can only be > 0")
      return false;
    }
    return true;
  }

  const cleanUpForm = () => {
    setStartLocation("");
    setEndLocation("");
    setNumLoops(1);
    setErrorMessage('');
  }

  const submitLoopRequest = () => {
    let description: LoopDescription = {
      num_loops: numLoops,
      start_name: startLocation,
      finish_name: endLocation,
    }
    let start_time = minsFromNow;
    let evaluator_option = evaluator;
      console.log("submit task: ", start_time, description);
      console.log("Submitting Task");
      try {
        fetch('/submit_task', {
        method: "POST",
        body: JSON.stringify({
                task_type: "Loop", 
                start_time: start_time,
                evaluator: evaluator_option,
                description: description
              }),
        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        } 
      })
        .then(res => res.json())
        .then(data => JSON.stringify(data));
      } catch (err) {
        setErrorMessage("Unable to submit loop request");
        console.log('Unable to submit loop request');
      }
      cleanUpForm();
      console.log("loop request submitted");
  }

  const handleSubmit = (ev: React.FormEvent): void => {
    ev.preventDefault();
    if(isFormValid()) {
      submitLoopRequest();
    }
  }

  const evaluators: string[] = ["lowest_delta_cost", "lowest_cost", "quickest_time"];

  return (
        <Box className={classes.form}>
            <div className={classes.divForm}>
            <Typography variant="h6">Schedule a Loop Request</Typography>
                <Autocomplete
                options={places}
                getOptionLabel={(place) => place}
                id="set-start-location"
                openOnFocus
                onChange={(_, value) => setStartLocation(value)}
                renderInput={(params: AutocompleteRenderInputParams) => <TextField {...params} label="Select start location" variant="outlined" margin="normal" />}
                />
            </div>
            <div className={classes.divForm}>
                <Autocomplete id="set-end-location"
                openOnFocus
                options={places}
                getOptionLabel={(place) => place}
                onChange={(_, value) => setEndLocation(value)}
                renderInput={(params: AutocompleteRenderInputParams) => <TextField {...params} label="Select end location" variant="outlined" margin="normal" />}
                />
            </div>
            <div className={classes.divForm}>
                <TextField
                className={classes.input}
                onChange={(e) => {
                setNumLoops(e.target.value ? parseInt(e.target.value) : 0);
                }}
                placeholder="Set number of loops"
                type="number"
                value={numLoops || 0}
                label="Number of Loops"
                variant="outlined"
                id="set-num-loops"
                />
            </div>
            <div className={classes.divForm}>
                <TextField
                  className={classes.input}
                  onChange={(e) => {
                  setMinsFromNow(e.target.value ? parseInt(e.target.value) : 0);
                  }}
                  placeholder="Set start time (mins from now)"
                  type="number"
                  value={minsFromNow || 0}
                  label="Set start time (mins from now)"
                  variant="outlined"
                  id="set-start-time"
                />
            </div>
            <div className={classes.divForm}>
                <Autocomplete id="set-evaluator"
                openOnFocus
                options={evaluators}
                getOptionLabel={(evaluator) => evaluator}
                onChange={(_, value) => setEvaluator(value)}
                renderInput={(params: AutocompleteRenderInputParams) => <TextField {...params} label="Choose an evaluator (optional)" variant="outlined" margin="normal" />}
                />
            </div>
            <div className={classes.buttonContainer}>
                <Button variant="contained" color="primary" onClick={handleSubmit} className={classes.button}>Submit Request</Button>
            </div>
            <Typography variant="h6">{errorMessage}</Typography>
        </Box>
    );
}

export default LoopRequestForm;
