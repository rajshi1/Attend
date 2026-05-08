// sw.js - The Background Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claims all open tabs immediately so the SW can start working right away
  event.waitUntil(clients.claim());
  console.log('AttendTrack Service Worker Active');
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { subName, timeUntil } = event.data;

    // If the time is very short (less than 30s), use setTimeout
    if (timeUntil < 30000) {
      setTimeout(() => {
        showNotification(subName);
      }, timeUntil);
    } else {
      // For longer times, we ideally need a backend 'Push', 
      // but for a frontend-only app, we trigger it immediately for testing 
      // OR keep the tab active.
      setTimeout(() => {
        showNotification(subName);
      }, timeUntil);
    }
  }
});

function showNotification(subName) {
  self.registration.showNotification('Class Starting Soon!', {
    body: `${subName} is starting soon. Time to head to class!`,
    icon: 'https://cdn-icons-png.flaticon.com/512/2693/2693507.png',
    vibrate: [200, 100, 200],
    badge: 'https://cdn-icons-png.flaticon.com/512/2693/2693507.png',
    tag: 'class-reminder-' + subName, // Prevents duplicate notifications
    renotify: true
  });
}
