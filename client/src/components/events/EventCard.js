const EventCard = ({ event, onClickView, onClickAssign, onClickDelete }) => {
    if (!event) return null;
    return (
        <div class="card">
            <header class="card-header">
                <p class="card-header-title">
                    {event.name}
                </p>
                <button class="card-header-icon" aria-label="more options"
                    onClick={() => onClickDelete(event._id)}>
                    <span class="icon">
                        <span className="material-icons">delete_outline</span>
                    </span>
                </button>
            </header>
            <div class="card-image">
                <figure class="image is-4by3">
                    <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder" />
                </figure>
            </div>
            <div class="card-content">
                <div class="content">
                    <span className="is-flex is-align-items-center mb-1">
                        <span class="icon is-small mr-2">
                            <span className="material-icons">event</span>
                        </span>
                        {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="is-flex is-align-items-center mb-1">
                        <span class="icon is-small mr-2">
                            <span className="material-icons">place</span>
                        </span>
                        {event.location}
                    </span>
                    <span className="is-flex is-align-items-center mb-1">
                        <span class="icon is-small mr-2">
                            <span className="material-icons">people</span>
                        </span>
                        {event.capacity}
                    </span>
                    <span className="is-flex is-align-items-center mb-1">
                        <span class="icon is-small mr-2">
                            <span className="material-icons">notes</span>
                        </span>
                        {event.description}
                    </span>
                </div>
            </div>
            <div class="card">
                <footer class="card-footer">
                    <a href="#" class="card-footer-item" onClick={() => onClickView(event._id)}>View</a>
                    <a href="#" class="card-footer-item" onClick={() => onClickAssign(event._id)}>Assign</a>
                </footer>
            </div>
        </div>
    );
}

export default EventCard;