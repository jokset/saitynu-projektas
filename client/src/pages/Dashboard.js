import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import EventCard from "../components/events/EventCard";
import EventForm from "../components/events/EventForm";
import DrawerPortal from "../components/ui/DrawerPortal";
import client from "../networking";

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [drawerState, setDrawerState] = useState({ open: false, id: undefined });

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

    const handleEventSubmit = (event) => {
        const eventsCopy = [...events];
        eventsCopy.push(event);
        setEvents(eventsCopy);
        setDrawerState({ open: false, event: undefined })
    }

    return (
        <div className="container mt-6 pt-4">
            <DrawerPortal title="New Event" isOpen={drawerState.open} 
                onClose={() => setDrawerState({ open: false, id: undefined})}
            >
                <EventForm data={events.find(e => e._id === drawerState.id)} onSubmit={handleEventSubmit} />
            </DrawerPortal>

            <div className="columns is-vcentered">
                <div className="column">
                    <h1 className="is-size-2 has-text-weight-bold">Your events</h1>
                    <p>These are the events that you manage or organize.</p>
                </div>
                <div className="column is-narrow">
                    <button className="button is-info" 
                        onClick={() => setDrawerState({ open: true, which: 0 })}
                    >
                        Create a new event
                    </button>
                </div>
            </div>

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