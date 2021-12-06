import { useState } from "react";
import client from "../../networking";

const ScheduleForm = ({ data, onSubmit, onUpdate }) => {
    const [name, setName] = useState(data && data.name ? data.name : "");
    const [description, setDescription] = useState(data && data.description ? data.description : "");
    const [location, setLocation] = useState(data && data.location ? data.location : "");
    const [startHours, setStartHours] = useState(data && data.start ? Math.floor(data.start/60) : 9);
    const [startMinutes, setStartMinutes] = useState(data && data.start ? data.start%60 : 30);
    const [endHours, setEndHours] = useState(data && data.end ? Math.floor(data.end/60) : 10);
    const [endMinutes, setEndMinutes] = useState(data && data.end ? data.end%60 : 30);
       
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (onSubmit) {
                const { data: item } = await client({
                    url: `/schedules/${data.schedule}/items`,
                    method: 'POST',
                    data: {
                        ...data,
                        name,
                        description,
                        location,
                        start: parseInt(startHours)*60 + parseInt(startMinutes),
                        end: parseInt(endHours*60) + parseInt(endMinutes)
                    }
                });
                onSubmit(item);
            } else if (onUpdate) {
                const { data: item } = await client({
                    url: `/schedules/${data.schedule}/items/${data._id}`,
                    method: 'PATCH',
                    data: {
                        ...data,
                        name,
                        description,
                        location,
                        start: startHours*60 + startMinutes,
                        end: endHours*60 + endMinutes
                    }
                });
                onUpdate(item);
            }
        } catch (e) {
            console.log(e.response ? e.response.data.message : e.message);
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="field">
                    <label className="label">Timeline Event Name</label>
                    <div className="control has-icons-right mb-2">
                        <input value={name} className="input" type="text" 
                            onChange={(e) => setName(e.target.value)} required/>
                    </div>
            </div>

            <div className="field">
                    <label className="label">Timeline Event Description</label>
                    <div className="control mb-2">
                        <input value={description} className="input" type="text" 
                            onChange={(e) => setDescription(e.target.value)}/>
                    </div>
            </div>

            <div className="field pb-4">
                    <label className="label">Timeline Event Location</label>
                    <div className="control mb-2">
                        <input value={location} className="input" type="text" 
                            onChange={(e) => setLocation(e.target.value)}/>
                    </div>
            </div>

            <div className="field is-horizontal">
                <div className="field-label is-normal">
                    <label className="label">From</label>
                </div>
                <div className="field-body">
                    <div className="field is-grouped">
                        <div className="control is-expanded mb-2">
                            <input value={startHours} className="input" 
                                type="number" step="1" min="0" max="23" 
                                onChange={(e) => setStartHours(e.target.value)} required/>
                        </div>
                        <div className="control is-expanded mb-2">
                            <input value={startMinutes} className="input" 
                                type="number" step="1" min="0" max="59" 
                                onChange={(e) => setStartMinutes(e.target.value)} required/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">To</label>
                </div>
                <div className="field-body">
                    <div className="field is-grouped">
                        <div className="control is-expanded has-icons-right mb-2">
                            <input value={endHours} className="input" 
                                type="number" step="1" min="0" max="23" 
                                onChange={(e) => setEndHours(e.target.value)} required/>
                        </div>
                        <div className="control is-expanded has-icons-right mb-2">
                            <input value={endMinutes} className="input" 
                                type="number" step="1" min="0" max="59" 
                                onChange={(e) => setEndMinutes(e.target.value)} required/>
                        </div>
                    </div>
                </div>
            </div>

            <button className="button is-info is-fullwidth mt-5">{onSubmit ? "Create Event" : "Update Event"}</button>
        </form>
    );
}

export default ScheduleForm;