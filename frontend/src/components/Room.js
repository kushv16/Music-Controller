import React,{useState,useEffect} from 'react'
import {useParams,useHistory} from 'react-router-dom'
import {Typography,Button,Grid} from '@material-ui/core'
import CreateRoom from "./CreateRoom"

const Room = ({leaveRoomCallback}) => {
    
    let [guestPlaybackState,setGuestPlaybackState] = useState(false);
    let [votesToSkip,setVotesToSkip] = useState(2);
    let [isHost,setIsHost] = useState('false') 
    let [showSettings,setShowSettings] = useState(false)
    let params = useParams();
    let history = useHistory();
    
    const roomCode = params.roomCode
    
    const getRoomDetails = () => {
        fetch('/api/get-room'+'?code='+roomCode).
            then(response => {
                if(!response.ok){
                    leaveRoomCallback();
                    history.push('/')

                }
                return response.json()
            }).
            then(data => {
                setVotesToSkip(data.votes_to_skip)
                setGuestPlaybackState(data.guest_can_pause)
                setIsHost(data.is_host)
            })
    }
    getRoomDetails();
    
    const handleLeaveRoomButton = () => {
        const requestOptions = {
            method:"POST",
            headers:{"Content-Type":"application/json"}
        }
        fetch("/api/leave-room",requestOptions)
        .then(response => {
            leaveRoomCallback();
            history.push('/')
        })
    }

    const updateShowSettingsState = (value) => {
        setShowSettings(value);
    }

    const renderSettingsButton = () => {
        return(
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => updateShowSettingsState(true)}>
                    Settings
                </Button>
            </Grid>
        )
    }

    const renderSettings = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoom
                    update={true}
                    votesToSkip={votesToSkip}
                    guestCanPause={guestPlaybackState}
                    roomCode = {roomCode}
                    updateCallback={getRoomDetails}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={() => updateShowSettingsState(false)}>
                        Close Settings
                    </Button>
                </Grid>
            </Grid>
        )
    }

        if(showSettings) {
            return renderSettings()
        } 
        return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h2" component="h2">
                    Room code : {roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Votes : {votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Playback : {guestPlaybackState.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Host : {isHost.toString()}
                </Typography>
            </Grid>
            {isHost ? renderSettingsButton() : null }
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" onClick={handleLeaveRoomButton}>
                    Leave Room
                </Button>
            </Grid>
         </Grid>
        )
    

}

export default Room
