export const formatDate = (date: Date): string => {
  const day = date.toLocaleString("fr-FR", { weekday: "short" });
  const datePart = date.toLocaleDateString("fr-FR");
  const timePart = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${day} ${datePart} ${timePart}`;
};

export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

export const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
  
    if (hours < 1) return "À l'instant";
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
  };
  

  export const formatDateForInput = (date: Date | string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };
  
  export const parseDateFromInput = (dateString: string) => {
    return dateString ? new Date(dateString) : new Date();
  };
