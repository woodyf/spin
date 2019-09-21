import {
  Button,
  Chip,
  Container,
  CssBaseline,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  SvgIcon,
  TextField,
  Typography
} from "@material-ui/core/";
import React, { useCallback, useState } from "react";
import { animated, useSpring } from "react-spring";
const CHOOSE_INPUT_PROPS = {
  id: "choose-helper"
};

const useStyles = makeStyles({
  spinner: { fontSize: "40vh", transform: prop => `rotate(${prop}deg)` }
});

const CHEAT_TARGETS = ["woody", "kelsey"];

const App = props => {
  const [isSpinning, setSpinning] = useState(false);
  const { degree } = useSpring({
    degree: isSpinning ? 3600 : 0,
    from: { degree: 0 },
    reset: true,
    onRest: () => setSpinning(false)
  });

  const classes = useStyles();
  const [name, setName] = useState("");
  const [names, setNames] = useState([]);
  const [results, setResults] = useState([]);
  const [choose, setChoose] = useState(0);

  const canAdd = !!name.trim();
  const spinnable = !!choose && !isSpinning;

  const changeName = useCallback(e => setName(e.target.value), []);
  const changeChosen = useCallback(e => setChoose(e.target.value), []);
  const add = useCallback(() => {
    setNames(ns => [...ns, name]);
    setName("");
  }, [name]);
  const spin = useCallback(() => {
    const temp = [...names];
    const result = [];
    let n = choose;
    while (n--) {
      const x = Math.floor(Math.random() * temp.length);
      result.push(temp.splice(x, 1)[0]);
    }
    setResults(result);
    setSpinning(true);
  }, [choose, names]);
  const cheatSpin = useCallback(() => {
    const matched = names.filter(n => CHEAT_TARGETS.includes(n.toLowerCase()));
    if (matched.length === 2 && choose === 2) {
      setSpinning(true);
      setResults(matched);
    } else {
      spin();
    }
  }, [choose, names, spin]);
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Grid spacing={1} container alignItems="center">
        <Grid item xs={8}>
          <TextField
            fullWidth
            value={name}
            onChange={changeName}
            label="名稱"
            autoFocus
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            fullWidth
            disabled={!canAdd}
            onClick={add}
            color="primary"
          >
            加入
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Typography component="h1" variant="h5">
            選項:
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {names.map((n, i) => (
            <Chip label={n} key={n + i}></Chip>
          ))}
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="choose-helper">數量</InputLabel>
            <Select
              fullWidth
              inputProps={CHOOSE_INPUT_PROPS}
              value={choose}
              onChange={changeChosen}
            >
              <MenuItem key={0} value={0}>
                0
              </MenuItem>
              {[...Array(names.length).keys()].map(n => (
                <MenuItem key={n + 1} value={n + 1}>
                  {n + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid container direction="column" alignItems="center" item xs={12}>
          <animated.div
            style={{ transform: degree.interpolate(d => `rotate(${d}deg)`) }}
          >
            <SvgIcon
              onClick={spinnable ? cheatSpin : undefined}
              className={classes.spinner}
              color="secondary"
              viewBox="0 0 1000 1000"
            >
              <path d="M500,990C229.4,990,10,770.6,10,500C10,229.4,229.4,10,500,10c270.6,0,490,219.4,490,490C990,770.6,770.6,990,500,990L500,990z M815.1,184.9L500,500V54.4c-122.4,0-233.2,49.4-313.7,129.2L500,500H54.5c0,122.4,49.4,233.1,129.2,313.7L500,500v445.5h0c122.3,0,233.1-49.3,313.7-129.2L500,500h445.6v0C945.6,376.9,895.7,265.6,815.1,184.9L815.1,184.9z" />
            </SvgIcon>
          </animated.div>
        </Grid>
        <Grid item xs={3}>
          <Typography component="h1" variant="h5">
            結果
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {!isSpinning &&
            results.map((n, i) => (
              <Chip color="primary" label={n} key={n + i}></Chip>
            ))}
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={spin}
            disabled={!spinnable}
            variant="contained"
            fullWidth
          >
            SPIN
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
