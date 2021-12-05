import { useState, useEffect } from "react";
import { useParams } from "react-router";
import client from "../networking";
import styled from "styled-components";
import Task from "../components/tasks/Task";
import Modal from "react-modal";

const StyledSidebar = styled.div`
    border: 1px solid #eeeeee;
    border-radius: 10px;
    background-color: #fff;

    .icon, .material-icons {
        font-size: 1.2em;
    }

    span {
        font-size: .9em;
    }

    h1 {
        display: inline-block;
    }
`

const StyledOrganizer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Event = () => {
    const [event, setEvent] = useState();
    const [tasks, setTasks] = useState();
    const [users, setUsers] = useState();
    const [modalOpen, setModalOpen] = useState(false);

    const params = useParams();

    useEffect(() => {
        (async () => {
            try {
                const { data: event } = await client({
                    url: `/events/${params.id}`,
                    method: 'GET'
                });

                const { data: task } = await client({
                    url: `/events/${params.id}/tasks`,
                    method: 'GET'
                });

                const { data: users } = await client({
                    url: `/users`,
                    method: 'GET'
                });

                setEvent(event);
                setTasks(task);
                setUsers(users);
            } catch (e) {
            }
        })();
    }, [params.id]);

    const handleOrganizer = async (add, id) => {
        try {
            if (add) {
                const { data: event } = await client({
                    url: `/events/${params.id}/organizers`,
                    method: 'POST',
                    data: { id }
                });

                setEvent(event);
            } else {
                const { data: event } = await client({
                    url: `/events/${params.id}/organizers/${id}`,
                    method: 'DELETE'
                });

                setEvent(event);
            }
        } catch (e) {}
    }

    if (!event) return null;
    return event && (
        <div className="container pl-2 pr-2">
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
                {users && event.organizers && users.map(o => {
                    const has = event.organizers.find((v) => v._id === o._id);

                    return (
                        <StyledOrganizer key={o._id} className="mb-2">
                            <span>{o.email}</span>
                            <button className={`button ${has ? 'is-danger' : 'is-info'}`}
                                onClick={() => handleOrganizer(!has, o._id)}>
                                { has ? 'Remove' : 'Assign' }
                            </button>
                        </StyledOrganizer>
                    )
                })}
            </Modal>
            <div className="columns mt-6 pt-4">
                <StyledSidebar className="column is-4 p-4">
                    <h1 className="is-size-3 has-text-weight-bold mb-4">{event.name}</h1>
                    <span className="is-flex is-align-items-center mb-2">
                        <span class="icon is-small mr-2">
                            <span className="material-icons">event</span>
                        </span>
                        {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="is-flex is-align-items-center mb-2">
                        <span class="icon is-small mr-2">
                            <span className="material-icons">place</span>
                        </span>
                        {event.location}
                    </span>
                    <span className="is-flex is-align-items-center mb-2">
                        <span class="icon is-small mr-2">
                            <span className="material-icons">people</span>
                        </span>
                        {event.capacity}
                    </span>
                    <span className="is-flex is-align-items-center mb-2">
                        <span class="icon is-small mr-2">
                            <span className="material-icons">notes</span>
                        </span>
                        {event.description}
                    </span>

                    <button className="button is-secondary is-fullwidth mt-4 mb-2">View Timeline</button>
                    <button className="button is-secondary mr-2 is-fullwidth mb-2"
                        onClick={() => setModalOpen(true)}>Manage Organizers</button>
                    <button className="button is-secondary is-fullwidth mb-2">Edit Details</button>
                    <button className="button is-danger is-fullwidth">Delete</button>
                </StyledSidebar>
                <div className="column">
                    <div className="is-flex is-align-items-center is-justify-content-space-between mb-2">
                        <h1 className="is-size-3 has-text-weight-bold">Tasks</h1>
                        <button className="button is-info">Add a new task</button>
                    </div>
                    {tasks && tasks.map(t => {
                        return <Task task={t} />
                    })}
                </div>
            </div>
        </div>
    );
}

export default Event;