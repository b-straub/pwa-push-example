const applicationServerKey = '<public-vapid-key>';
const apiPort = 8080;
const swInfoEl = document.getElementById('sw_info');
const subInfoEl = document.getElementById('sub_info');

if ('PushManager' in window) {
  swInfoEl.className = 'alert info';
  swInfoEl.textContent = 'Using declarative WebPush...';

  // Check if the notifications are denied by the user and update the UI
  if (window.Notification.permission === 'denied') {
    subInfoEl.textContent = '❌ Notifications have been disabled!';
  }
} else {
  swInfoEl.className = 'alert error';
  swInfoEl.textContent = 'Declarative WebPush is not supported by your browser 🙁';
}

async function requestPermission() {
  if (!('Notification' in window)) {
    throw new Error('Notifications not supported!');;
  }

  return window.Notification.permission === 'default'
    ? window.Notification.requestPermission()
    : window.Notification.permission;
}

async function subscribeToNotifications() {
  if ((await requestPermission()) === 'denied') {
    subInfoEl.textContent = '❌ Notifications have been disabled!';
    return;
  }

  const pushSubscription = await window.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });

  const response = await fetch(`http://localhost:${apiPort}/subscribe`, {
    method: 'POST',
    body: JSON.stringify(pushSubscription),
    headers: {
      'content-type': 'application/json',
    },
  });
  subInfoEl.textContent = (await response.json()).message;
}
