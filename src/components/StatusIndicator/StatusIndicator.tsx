import './StatusIndicator.css';

function StatusIndicator({ isOffline }: { isOffline: boolean }) {
    return (
        <div className="status-indicator">
            <button className={`status-button ${isOffline ? "offline" : "online"}`}>
                {isOffline ? "Offline" : "Online"}
            </button>
        </div>
    );
}

export default StatusIndicator;
