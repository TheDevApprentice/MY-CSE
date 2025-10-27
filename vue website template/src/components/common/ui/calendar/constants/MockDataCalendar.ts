import { mockDataEvents } from "../../../../events/constants/mockDataEvents";

export const mockCalendarEvents = mockDataEvents.map((event) => ({
  id: event.id,
  title: event.title,
  start: event.date,
  end: new Date(event.date.getTime() + 2 * 60 * 60 * 1000), // +2h par défaut
  extendedProps: {
    description: event.description,
    location: event.location,
    category: event.category,
    participants: event.participants,
    maxParticipants: event.maxParticipants,
    image: event.image,
    price: event.price,
  },
}));
