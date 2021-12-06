import { useState } from "react";
import Select from "react-select";
import client from "../../networking";

const dateJoinOpts = [
    {year: 'numeric'}, {month: '2-digit'}, {day: '2-digit'}
]

const options = [
    { value: 'todo', label: 'To Do' },
    { value: 'inprogress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
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

const NewTaskForm = ({ data, onSubmit = () => null }) => {
    const [name, setName] = useState(data && data.name ? data.name : "");
    const [description, setDescription] = useState(data && data.description ? data.description : "");
    const [deadline, setDeadline] = useState(data && data.deadline ? new Date(data.deadline) : new Date());
    const [state, setState] = useState(data && data.state ? data.state : 'todo');
       
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data: task } = await client({
                url: `/tasks`,
                method: 'POST',
                data: {
                    ...data,
                    name,
                    description,
                    deadline,
                    state
                }
            });
    
            onSubmit(task);
        } catch (e) {
            console.log(e.response ? e.response.data.message : e.message);
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="field">
                    <label className="label">Task Name</label>
                    <div className="control has-icons-right mb-2">
                        <input value={name} className="input" type="text" 
                            onChange={(e) => setName(e.target.value)} required/>
                    </div>
            </div>

            <div className="field">
                    <label className="label">Task Description</label>
                    <div className="control has-icons-right mb-2">
                        <input value={description} className="input" type="text" 
                            onChange={(e) => setDescription(e.target.value)} required/>
                    </div>
            </div>

            <div className="field">
                    <label className="label">Task Date</label>
                    <div className="control has-icons-right mb-2">
                        <input value={join(deadline, dateJoinOpts)} className="input" type="date" 
                            onChange={(e) => setDeadline(new Date(e.target.value))} required/>
                    </div>
            </div>

            <div className="field">
                    <label className="label">Task State</label>
                    <div className="control has-icons-right mb-2">
                        <Select 
                            styles={{display: 'inline-block'}}
                            options={options} 
                            defaultValue={options.find(v => v.value === state)}
                            onChange={({ value }) => setState(value)}
                        />
                    </div>
            </div>

            <button className="button is-info is-fullwidth mt-4">Create Task</button>
        </form>
    );
}

export default NewTaskForm;