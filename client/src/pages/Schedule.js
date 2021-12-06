import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ScheduleForm from "../components/schedules/ScheduleForm";
import ScheduleItem from "../components/schedules/ScheduleItem";
import DrawerPortal from "../components/ui/DrawerPortal";
import client from "../networking";

const Schedule = () => {
    const [schedule, setSchedule] = useState();
    const [drawerState, setDrawerState] = useState({ open: false, op: 0 })
    const params = useParams();

    useEffect(() => {
        (async () => {
            try {
                const { data: schedule } = await client({
                    url: `/schedules/${params.id}`,
                    method: 'GET'
                });

                setSchedule(schedule);
            } catch (e) {

            }
        })();
    }, [params.id])

    const onScheduleItemSubmit = (item) => {
        const scheduleCopy = {...schedule}
        scheduleCopy.scheduleEvents.push(item);
        setSchedule(scheduleCopy);
        setDrawerState({ open: false, op: undefined })
    }

    if (!schedule) return null;
    return (
        <div className="container mt-6 pt-4">
            <DrawerPortal title="New Event" isOpen={drawerState.open} 
                onClose={() => setDrawerState({ open: false, op: undefined})}
            >
                <ScheduleForm data={{ schedule: schedule._id }} onSubmit={onScheduleItemSubmit}/>
            </DrawerPortal>

            <div className="columns is-vcentered">
                <div className="column">
                    <h1 className="is-size-2 has-text-weight-bold">{schedule.name}</h1>
                    <p>This is your event timeline.</p>
                </div>
                <div className="column is-narrow">
                    <button className="button is-info" 
                        onClick={() => setDrawerState({ open: true, drawerState: 0 })}
                    >
                        Add a timeline event
                    </button>
                </div>
            </div>

            <p className="mb-5 mt-2 has-text-weight-bold">{new Date(schedule.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}</p>

            {schedule.scheduleEvents.sort((a, b) => a.start - b.start).map((e) => 
                <ScheduleItem data={e} onDelete={() => null} onUpdate={() => null} />
            )}
        </div>
    );
}

export default Schedule;