import styled from "styled-components";

const StyledItem = styled.div`
    & .time {
        min-width: 120px;
        display: block
    }
`;

const minutesToTime = (start, end) => {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setHours(Math.floor(start/60), start%60, 0, 0);
    endDate.setHours(Math.floor(end/60), end%60, 0, 0);

    return `${startDate.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute:'2-digit'
    })}-${endDate.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute:'2-digit'
    })}`
}

const ScheduleItem = ({ data, onUpdate, onDelete }) => {
    if (!data) return null;
    return data && (
        <StyledItem className="box is-fullwidth">
            <div className="columns">
                <div className="column is-narrow">
                    <span className="time">
                        {minutesToTime(data.start, data.end)}
                    </span>
                </div>
                <div className="column">
                    <span className="name is-size-5 has-text-weight-bold">
                        {data.name}
                    </span>
                    {data.location && <span className="is-flex is-align-items-center mb-2 mt-4">
                        <span class="icon is-small mr-2">
                            <span className="material-icons">place</span>
                        </span>
                        {data.location}
                    </span>}
                    {data.description && <span className="is-flex is-align-items-center mb-2">
                        <span class="icon is-small mr-2">
                            <span className="material-icons">notes</span>
                        </span>
                        {data.description}
                    </span>}
                </div>

                <div className="column is-narrow">
                    {onUpdate && <>
                        <button className="button is-secondary ml-2" 
                            onClick={() => null}>
                            <span class="icon is-small">
                                <span className="material-icons">edit</span>
                            </span>
                        </button>
                    </>}
                    {onDelete && <>
                        <button className="button is-secondary ml-2" 
                            onClick={() => null}>
                            <span class="icon is-small">
                                <span className="material-icons">delete_outline</span>
                            </span>
                        </button>
                    </>}
                </div>
            </div>
        </StyledItem>
    );
}

export default ScheduleItem;