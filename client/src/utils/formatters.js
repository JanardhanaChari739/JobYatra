/**
 * Format Indian Currency (LPA or monthly INR)
 */
export function formatSalary(min, max, salaryDisplay) {
  if (salaryDisplay && salaryDisplay !== 'Best in Industry') {
    return salaryDisplay;
  }

  if (!min && !max) return 'Best in Industry';

  // Monthly values
  if (min > 0 && min < 100000) {
    if (min && max && min !== max) {
      return `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')}/mo`;
    }
    return `₹${(min || max).toLocaleString('en-IN')}/mo`;
  }

  // Yearly LPA
  const minLPA = min ? (min / 100000).toFixed(1) : null;
  const maxLPA = max ? (max / 100000).toFixed(1) : null;

  if (minLPA && maxLPA) {
    return `INR ${minLPA}-${maxLPA} LPA`;
  } else if (minLPA) {
    return `From INR ${minLPA} LPA`;
  } else {
    return `Up to INR ${maxLPA} LPA`;
  }
}

/**
 * Human readable relative time format
 */
export function timeAgo(dateString) {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
