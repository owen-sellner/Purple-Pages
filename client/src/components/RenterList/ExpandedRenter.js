import React from 'react';
import Typography from "@material-ui/core/Typography";
import { Button, Box, CssBaseline, ThemeProvider } from '@material-ui/core';
import { appTheme } from "../../themes/theme";


const serverURL = "";

const ExpandedRenter = ({ userId, renter, removeFromExpanded }) => {

    /*
        Check if renter is friends
    */

    // Creates state variable
    const [friendStatus, setFriendStatus] = React.useState(0)

    // Activates the intital APIs
    React.useEffect(() => {
        isFriend();
    }, []);

    const isFriend = () => {
        callApiIsFriend()
            .then(res => {
                console.log("callApiIsFriend returned: ", res)
                var parsed = JSON.parse(res.express);
                console.log("callApiIsFriend parsed: ", parsed);
                setFriendStatus(parsed[0].count);
            });
    }

    const callApiIsFriend = async () => {
        const url = serverURL + "/api/isFriend";
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                friend_id: renter.renter_id,
                renter_id: userId
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log("isFriend: ", body);
        return body;
    }

    /*
        Change friendship status
    */

    const handleChangeFriendStatus = () => {
        addFriend()
    }

    const addFriend = () => {
        callApiAddFriend()
            .then(res => {
                console.log("callApiAddFriend returned: ", res)
                var parsed = JSON.parse(res.express);
                console.log("callApiAddFriend parsed: ", parsed);
                isFriend();
            });
    }

    const callApiAddFriend = async () => {
        const url = serverURL + "/api/addFriend";
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                renter_id: userId,
                friend_id: renter.renter_id,
                friend_status: friendStatus
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log("Friend: ", body);
        return body;
    }

    return (
        <>
            <ThemeProvider theme={appTheme}>
                <CssBaseline enableColorScheme />
                <Box
                    display="flex"
                    flexGrow={1}
                >
                    <Typography variant="h5">
                        {renter.first_name} {renter.last_name}
                    </Typography>

                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        flexGrow={1}
                        alignItems="flex-start">

                        <Button variant="contained"
                            style={{ backgroundColor: "#5A189A", color: "#ffffff" }}
                            onClick={handleChangeFriendStatus}
                        >
                            {friendStatus === 0 ? "Friend" : "Unfriend"}
                        </Button>
                    </Box>
                </Box>

                <Box
                    marginLeft={2}
                    marginBottom={2}
                >
                    <Typography variant="subtitle1">
                        Birthday: {renter.birthday}, Roomate Gender: {renter.gender}
                    </Typography>

                    <Typography variant="subtitle1">
                        Typical bedtime: {renter.bedtime}, Cooking Frequency: {renter.cook}
                    </Typography>

                    <Typography variant="subtitle1">
                        Phone Number: {renter.phone}, Email address: {renter.email}
                    </Typography>
                </Box>

                <Button
                    onClick={() => removeFromExpanded(renter.renter_id)}
                    variant="contained"
                    style={{ backgroundColor: "#5A189A", color: "#ffffff" }}>
                    Hide Details
                </Button>
            </ThemeProvider>
        </>
    )
}

export default ExpandedRenter;