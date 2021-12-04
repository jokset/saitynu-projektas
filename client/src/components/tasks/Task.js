import { useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import client from '../../networking';

const options = [
    { value: 'todo', label: 'To Do' },
    { value: 'inprogress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
]

const StyledTask = styled.div`
    opacity: ${({ state }) => state === 'done' ? '.5' : '1'};
    text-decoration: ${({ state }) => state === 'done' ? 'line-through' : 'unset'};
`

const Task = ({task, onClickAssign = () => null, onChangeTaskState = () => null}) => {
    const [taskState, setTaskState] = useState(task);

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

    return (
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
                <div className="column is-narrow">
                    <Select 
                        options={options} 
                        defaultValue={options.find(v => v.value === taskState.state)}
                        onChange={({ value }) => onChangeState(value)}
                    />
                </div>
            </div>
        </StyledTask>
    );
}

export default Task;