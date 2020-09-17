import { withStyles, Theme } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';

const styles = (theme: Theme) => ({
  root: {
    width: '200px',
  },
});
export default withStyles(styles)(Card);
