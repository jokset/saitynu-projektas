import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import EventCard from "../components/events/EventCard";
import client from "../networking";

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const { data } = await client({
                    url: '/events',
                    method: 'GET'
                });

                setEvents(data);
            } catch (e) {
                setEvents([]);
            }
        })();
    }, []);

    return (
        <div className="container mt-6 pt-4">
            <div className="columns">
                {events && events.map(e => (
                    <div className="column is-4">
                        <EventCard event={e} onClickView={() => navigate('/event/' + e._id)} />
                    </div>   
                ))}
            </div>
        </div>
    );
}

export default Dashboard;