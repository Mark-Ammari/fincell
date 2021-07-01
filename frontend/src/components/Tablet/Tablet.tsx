import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { IconButton, useMediaQuery } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        maxWidth: "100%",
        color: "white",
        background: "#1e1e1e",
        position: "static"
    },
    icon: {
        color: "white",
        "&:disabled": {
            color: "#999"
        }
    }
});

interface TabletProps {
    steps: number,
    activeStep: number,
    handleNext?: React.MouseEventHandler<HTMLButtonElement> | undefined,
    handleBack?: React.MouseEventHandler<HTMLButtonElement> | undefined,
    disableNext?: boolean | undefined,
    disableBack?: boolean | undefined
}

const Tablet: React.FC<TabletProps> = ({ steps, activeStep, handleNext, handleBack, disableNext, disableBack }) => {
    const classes = useStyles();
    const match = useMediaQuery('(min-width:1366px)')

    return (
        <>
            {
                match ? null :
                    <MobileStepper
                        variant="text"
                        steps={steps}
                        activeStep={activeStep}
                        className={classes.root}
                        nextButton={
                            <IconButton className={classes.icon} size="small" onClick={handleNext} disabled={disableNext}><KeyboardArrowRight /> </IconButton>
                        }
                        backButton={
                            <IconButton className={classes.icon} size="small" onClick={handleBack} disabled={disableBack}><KeyboardArrowLeft /></IconButton>
                        }
                    />
            }
        </>
    );
};

export default Tablet;