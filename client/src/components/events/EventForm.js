import { useState } from "react";
import client from "../../networking";

const dateJoinOpts = [
    {year: 'numeric'}, {month: '2-digit'}, {day: '2-digit'}
]

function join(t, a) {
    function format(m) {
       let f = new Intl.DateTimeFormat('en', m);
       return f.format(t);
    }
    try {
        return a.map(format).join('-');
    } catch (e) {
        return new Date();
    }
}

const EventForm = ({ data, onSubmit, onUpdate }) => {
    const [name, setName] = useState(data && data.name ? data.name : "");
    const [description, setDescription] = useState(data && data.description ? data.description : "");
    const [capacity, setCapacity] = useState(data && data.capacity ? data.capacity : 0);
    const [location, setLocation] = useState(data && data.location ? data.location : "");
    const [date, setDate] = useState(data && data.date ? new Date(data.date) : new Date());
       
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (onSubmit) {
                const { data: event } = await client({
                    url: `/events`,
                    method: 'POST',
                    data: {
                        ...data,
                        name,
                        description,
                        date,
                        capacity,
                        location
                    }
                });
                onSubmit(event);
            } else if (onUpdate) {
                const { data: event } = await client({
                    url: `/events/${data._id}`,
                    method: 'PATCH',
                    data: {
                        ...data,
                        name,
                        description,
                        date,
                        capacity
                    }
                });
                onUpdate(event);
            }
        } catch (e) {
            console.log(e.response ? e.response.data.message : e.message);
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="field">
                    <label className="label">Event Name</label>
                    <div className="control has-icons-right mb-2">
                        <input value={name} className="input" type="text" 
                            onChange={(e) => setName(e.target.value)} required/>
                    </div>
            </div>

            <div className="field">
                    <label className="label">Event Description</label>
                    <div className="control has-icons-right mb-2">
                        <input value={description} className="input" type="text" 
                            onChange={(e) => setDescription(e.target.value)} required/>
                    </div>
            </div>

            <div className="field">
                    <label className="label">Event Location</label>
                    <div className="control has-icons-right mb-2">
                        <input value={location} className="input" type="text" 
                            onChange={(e) => setLocation(e.target.value)} required/>
                    </div>
            </div>

            <div className="field">
                    <label className="label">Date</label>
                    <div className="control has-icons-right mb-2">
                        <input value={join(date, dateJoinOpts)} className="input" type="date" 
                            onChange={(e) => setDate(new Date(e.target.value))} required/>
                    </div>
            </div>

            <div className="field">
                    <label className="label">Capacity</label>
                    <div className="control has-icons-right mb-2">
                        <input value={capacity} className="input" type="number" step="1" min="0"
                            onChange={(e) => setCapacity(e.target.value)} required/>
                    </div>
            </div>

            <button className="button is-info is-fullwidth mt-4">{onSubmit ? "Create Event" : "Update Event"}</button>
        </form>
    );
}

export default EventForm;