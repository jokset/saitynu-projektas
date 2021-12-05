import { useState, useEffect } from "react";
import Task from "../components/tasks/Task";
import client from "../networking";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [hideCompleted, setHideCompleted] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await client({
                    url: '/tasks/mine',
                    method: 'GET'
                });

                setTasks(data);
            } catch (e) {
                setTasks([]);
            }
        })();
    }, []);

    useEffect(() => {
        if (hideCompleted)
            setTasks(tasks.map(t => {
                if (t.state === 'done') {
                    return {...t, hidden: true};
                }
                return t;
            }))
        else
            setTasks(tasks.map(t => {
                if (t.state === 'done') {
                    return {...t, hidden: false};
                }
                return t;
            }))
    }, [hideCompleted]);

    const handleTaskStateChange = (id, state) => {
        setTasks(tasks.map(t => {
            if (t._id === id)
                return {...t, state};
            else
                return t;
        }))
    }

    return (
        <>
            <div className="container mt-6 pt-4">
                <div className="columns is-vcentered">
                    <div className="column">
                        <h1 className="is-size-2 has-text-weight-bold">Your tasks</h1>
                        <p>These are the tasks that have been assigned to you.</p>
                    </div>
                    <div className="column is-narrow">
                        <button className="button is-info" onClick={() => setHideCompleted(!hideCompleted)}>
                            {hideCompleted ? 'Show' : 'Hide'} completed
                        </button>
                    </div>
                </div>

                <div className="columns mt-4">
                    {tasks && tasks.map(t => (
                        !t.hidden && <Task key={t._id} task={t} onChangeTaskState={handleTaskStateChange}/>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Tasks;