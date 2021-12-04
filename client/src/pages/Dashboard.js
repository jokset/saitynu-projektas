import { useEffect, useState } from "react";
import EventCard from "../components/events/EventCard";
import Header from "../components/ui/Header";
import client from "../networking";

const Dashboard = () => {
    const [events, setEvents] = useState([]);

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
    });

    return (
        <>
            <Header />
            
            <div className="container mt-6 pt-4">
                <div className="columns">
                    {events && events.map(e => (
                        <div className="column is-4">
                            <EventCard event={e} />
                        </div>   
                    ))}
                </div>
            </div>
        </>
    );
}

export default Dashboard;