import {default as AppBar} from '@material-ui/core/AppBar';
import {default as Toolbar} from '@material-ui/core/Toolbar';
import {default as Typography} from '@material-ui/core/Typography';
import * as React from 'react';

class NavBar extends React.Component<any,any> {
    constructor(props:any) {
        super(props);
    }
    public render() {
        return(
            <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                    Map menu goes here
                    </Typography>
                </Toolbar>
            </AppBar>
            </div>
        );
    }
}
export default NavBar;