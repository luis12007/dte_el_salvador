import hamburguerimg from '../assets/imgs/hamburguerimg.png';

export default function HamburguerComponent({ sidebar, open = false, hasUnreadMessages = false, unreadCount = 0 }) {
    return (
        <button
            type="button"
            aria-label="Abrir menú"
            onClick={sidebar}
            className="fixed left-4 top-4 z-50 p-2 rounded-lg bg-white/90 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
        >
            {open ? (
                // X icon
                <svg className="w-6 h-6 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            ) : (
                // Bars icon
                <svg className="w-6 h-6 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            )}

            {hasUnreadMessages && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </button>
    );
}
