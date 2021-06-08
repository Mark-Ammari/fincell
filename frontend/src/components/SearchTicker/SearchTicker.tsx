import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { InputBase, Dialog, ListItemText, ListItem, List, Divider, AppBar, Toolbar, IconButton, Typography, Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { CloseRounded, SearchRounded } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: 'relative',
            backgroundColor: '#1e1e1e',
            width: "100%",
            padding: "0px"
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
        iconButton: {
            color: "white",
            margin: "0 5px"
        },
        textField: {
            color: "white",
            widith: "100%",
            paddingLeft: "1em",
            borderBottom: "1px solid white"
        }
    }),
);

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function SearchTicker() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <IconButton className={classes.iconButton} onClick={handleClickOpen}>
                <SearchRounded />
            </IconButton>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseRounded />
                        </IconButton>
                        <InputBase
                            className={classes.textField}
                            fullWidth
                            placeholder="Search Ticker..."
                        />
                    </Toolbar>
                </AppBar>
                <List>
                    <ListItem button>
                        <ListItemText primary="Phone ringtone" secondary="Titania" />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                        <ListItemText primary="Default notification ringtone" secondary="Tethys" />
                    </ListItem>
                </List>
            </Dialog>
        </div>
    );
}