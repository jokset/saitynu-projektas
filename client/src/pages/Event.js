import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import client from "../networking";
import styled from "styled-components";
import Task from "../components/tasks/Task";
import Modal from "react-modal";
import DrawerPortal from "../components/ui/DrawerPortal";
import NewTaskForm from "../components/tasks/NewTaskForm";
import EventForm from "../components/events/EventForm";

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
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [drawerState, setDrawerState] = useState({ open: false, which: 0 });
    const navigate = useNavigate();

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

    const handleAssign = (task) => {
        setTasks(tasks.map(t => t._id === task._id ? task : t));
    }

    const handleDelete = (task) => {
        setTasks(tasks.filter(t => t._id === task._id ? undefined : t));
    }

    const handleTaskSubmit = (task) => {
        const newTasks = [...tasks];
        newTasks.push(task);
        setTasks(newTasks);
        setDrawerState(false);
    }

    const handleEventUpdate = (event) => {
        setEvent(event);
        setDrawerState(false);
    }

    const deleteEvent = async () => {
        try {
            await client({
                url: `/events/${params.id}`,
                method: 'DELETE'
            });

            navigate('/dashboard');
        } catch (e) {
        }
    }

    return (
        <div className="container pl-2 pr-2">
            {event && 
                <DrawerPortal title={drawerState.which === 0 ? "New Task" : "Edit Event"} isOpen={drawerState.open} 
                    onClose={() => setDrawerState({open: false, which: drawerState.which})}
                >
                    {
                        drawerState.which === 0 ? 
                            <NewTaskForm data={{event: event._id}} onSubmit={handleTaskSubmit} />
                        :
                            <EventForm data={event} onUpdate={handleEventUpdate} />
                    }
                </DrawerPortal>
            }

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
                {users && event && event.organizers && users.map(o => {
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
                <StyledSidebar className="column is-4 p-4 mb-2">
                    {event && <>
                        <h1 className="is-size-3 has-text-weight-bold mb-4">{event ? event.name : ""}</h1>
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

                        <button className="button is-secondary is-fullwidth mt-4 mb-2"
                            onClick={() => navigate('./schedule')}
                        >
                            View Timeline
                        </button>
                        <button className="button is-secondary mr-2 is-fullwidth mb-2"
                            onClick={() => setModalOpen(true)}>Manage Organizers</button>
                        <button className="button is-secondary is-fullwidth mb-2"
                            onClick={() => setDrawerState({ open: true, which: 1 })}>
                            Edit Details
                        </button>
                        <button className="button is-danger is-fullwidth"
                            onClick={deleteEvent}
                        >
                            Delete
                        </button>
                    </>}
                </StyledSidebar>
                <div className="column">
                    <div className="is-flex is-align-items-center is-justify-content-space-between mb-2">
                        <h1 className="is-size-3 has-text-weight-bold">Tasks</h1>
                        <button className="button is-info" 
                            onClick={() => setDrawerState({ open: true, which: 0 })}
                        >
                            Add a new task
                        </button>
                    </div>
                    {tasks && tasks.map(t => {
                        return <Task task={t} onAssign={handleAssign} onDelete={handleDelete} />
                    })}
                </div>
            </div>
        </div>
    );
}

export default Event;