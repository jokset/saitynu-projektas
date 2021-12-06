import { useEffect, useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import client from '../../networking';
import Modal from "react-modal";

const options = [
    { value: 'todo', label: 'To Do' },
    { value: 'inprogress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
]

const StyledTask = styled.div`
    opacity: ${({ state }) => state === 'done' ? '.5' : '1'};
    text-decoration: ${({ state }) => state === 'done' ? 'line-through' : 'unset'};
`

const StyledOrganizer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Task = ({task, onAssign, onChangeTaskState = () => null, onDelete}) => {
    const [taskState, setTaskState] = useState(task);
    const [modalOpen, setModalOpen] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { data: users } = await client({
                    url: `/users`,
                    method: 'GET'
                });

                setUsers(users);
            } catch (e) {
            }
        })();
    }, []);

    const onChangeState = async (value) => {
        try {
            const { data } = await client({
                url: `/tasks/${task._id}`,
                method: 'PATCH',
                data: {
                    state: value
                }
            });

            setTaskState(data);
            onChangeTaskState(task._id, value)
        } catch (e) {
            console.log(e)
        }
    }

    const handleAssignee = async (add, id) => {
        try {
            if (add) {
                const { data } = await client({
                    url: `/tasks/${task._id}/assignees`,
                    method: 'PATCH',
                    data: { id }
                });

                setTaskState(data);
                onAssign(data);
            } else {
                const { data } = await client({
                    url: `/tasks/${task._id}/assignees/${id}`,
                    method: 'DELETE'
                });

                setTaskState(data);
                onAssign(data);
            }
        } catch (e) {}
    }

    const deleteTask = async () => {
        try {
            const { data } = await client({
                url: `/tasks/${task._id}`,
                method: 'DELETE'
            });

            onDelete(data);
        } catch (e) {}
    }

    return (
        <>
            <Modal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                className="react-modal"
                closeTimeoutMS={200}
                style={{
                    overlay: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 99
                    },
                }}
            >
                {task.assignees && users.map(o => {
                    const has = task.assignees.find((v) => v._id === o._id);

                    return (
                        <StyledOrganizer key={o._id} className="mb-2">
                            <span>{o.email}</span>
                            <button className={`button ${has ? 'is-danger' : 'is-info'}`}
                                onClick={() => handleAssignee(!has, o._id)}>
                                { has ? 'Remove' : 'Assign' }
                            </button>
                        </StyledOrganizer>
                    )
                })}
            </Modal>

            <StyledTask className="box is-fullwidth" state={taskState.state}>
                <div className="columns is-vcentered">
                    <div className="column">
                        <span className={`status ${taskState.state} is-rounded`}/>
                        <span className="ml-2 is-size-5">
                            <strong>{taskState.name}</strong>
                        </span>
                        <span className="is-flex is-align-items-center mb-1 mt-2">
                            <span class="icon is-small mr-2">
                                <span className="material-icons">notes</span>
                            </span>
                            {task.description}
                        </span>
                        <span className="is-flex is-align-items-center mb-1">
                            <span class="icon is-small mr-2">
                                <span className="material-icons">hourglass_bottom</span>
                            </span>
                            {new Date(taskState.deadline).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="column is-narrow is-flex is-align-items-center">
                        {onAssign && <button className="button is-secondary mr-2" 
                            onClick={() => setModalOpen(true)}>Assign</button>}
                        <Select 
                            styles={{display: 'inline-block'}}
                            options={options} 
                            defaultValue={options.find(v => v.value === taskState.state)}
                            onChange={({ value }) => onChangeState(value)}
                        />
                        {onDelete && 
                            <button className="button is-danger is-inverted ml-2" 
                                onClick={deleteTask}>
                                <span class="icon is-small">
                                    <span className="material-icons">delete_outline</span>
                                </span>
                            </button>
                        }
                    </div>
                </div>
            </StyledTask>
        </>
    );
}

export default Task;