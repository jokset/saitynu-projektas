import { useEffect, useState } from "react";
import client from "../networking";
import { useParams } from "react-router-dom";
import ScheduleItem from "../components/schedules/ScheduleItem";
import DrawerPortal from "../components/ui/DrawerPortal";

const PublicEventPage = () => {
    const params = useParams();
    const [data, setData] = useState();
    const [name, setName] = useState();
    const [address, setAddress] = useState();
    const [email, setEmail] = useState();
    const [drawerState, setDrawerState] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await client({
                    url: `/events/${params.id}/public`,
                    method: 'GET'
                });
    
                setData(data);
            } catch (e) {}
        })();
    }, [params.id])

    const handleSubmit = async () => {
        try {
            const { ticket } = await client({
                url: `/tickets/`,
                method: 'POST',
                data: {
                    name,
                    address,
                    email,
                    event: data.event._id
                }
            });

            console.log(ticket)
            setDrawerState(false)
        } catch (e) {}
    }

    if (!data) return null;
    return data && (
        <div className="container mt-6 pt-4">
            <DrawerPortal title="Purchace ticket" isOpen={drawerState} 
                onClose={() => setDrawerState(false)}
            >
                <div className="field">
                    <label className="label">Your Full Name</label>
                    <div className="control has-icons-right mb-2">
                        <input value={name} className="input" type="text" 
                            onChange={(e) => setName(e.target.value)} required/>
                    </div>
                </div>

                <div className="field">
                        <label className="label">Your Address</label>
                        <div className="control has-icons-right mb-2">
                            <input value={address} className="input" type="text" 
                                onChange={(e) => setAddress(e.target.value)} required/>
                        </div>
                </div>

                <div className="field">
                        <label className="label">Your Email</label>
                        <div className="control has-icons-right mb-2">
                            <input value={email} className="input" type="email" 
                                onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                </div>

                <button className="button is-info" onClick={handleSubmit}>Purchace</button>
            </DrawerPortal>

            <div className="columns is-vcentered">
                <div className="column">
                    <h1 className="is-size-2 has-text-weight-bold">{data.event.name}</h1>
                    <p>This is your public portal.</p>
                </div>
                <div className="column is-narrow">
                    <button className="button is-info" 
                        onClick={() => setDrawerState(true)}
                    >
                        Purchace a ticket
                    </button>
                </div>
            </div>

            {data.timeline.scheduleEvents && data.timeline.scheduleEvents.sort((a, b) => a.start - b.start).map((e) => 
                <ScheduleItem key={e._id} data={{schedule: data.timeline._id, ...e}}/>
            )}
        </div>
    );
}

export default PublicEventPage;