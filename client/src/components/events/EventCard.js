const EventCard = ({ event, onClickView, onClickDelete }) => {
    if (!event) return null;
    return (
        <div class="card">
            <header class="card-header">
                <p class="card-header-title">
                    {event.name}
                </p>
            </header>
            <div class="card-image">
                <figure class="image">
                    <img src="https://cdn.dribbble.com/users/483592/screenshots/9394838/media/db27140b922ff33387c511d00589216f.png" alt="Placeholder" />
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
                </footer>
            </div>
        </div>
    );
}

export default EventCard;