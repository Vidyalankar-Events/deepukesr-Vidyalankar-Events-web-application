// Service Worker for Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.message,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: data.data,
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'view',
        title: 'View'
      }
    ],
    tag: data.id // Prevent duplicate notifications
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view' && event.notification.data) {
    const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;

    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then((windowClients) => {
        // Check if there is already a window/tab open with the target URL
        for (let client of windowClients) {
          if (client.url === urlToOpen) {
            // Focus if already open
            return client.focus();
          }
        }
        // Open new window/tab if none is open
        return clients.openWindow(urlToOpen);
      })
    );
  }
});