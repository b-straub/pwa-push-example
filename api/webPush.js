import dotenv from 'dotenv';
import webPush from 'web-push';

dotenv.config();

if (!process.env['VAPID_PUBLIC_KEY'] || !process.env['VAPID_PRIVATE_KEY']) {
  throw new Error('VAPID keys are missing from the env variables. Please generate VAPID key pair with web-push and set the variables!');
}

const vapidKeys = {
  publicKey: process.env['VAPID_PUBLIC_KEY'],
  privateKey: process.env['VAPID_PRIVATE_KEY'],
};
webPush.setVapidDetails('mailto:example@yourdomain.org', vapidKeys.publicKey, vapidKeys.privateKey);

export function sendNotification(sub, title, body) {

  let pushMessage = {
    web_push: 8030,
    notification: {
      title: title,
      navigate: "https://webkit.org/blog",
      mutable: false,
      body: body,
      icon: `https://icon-library.com/images/doge-icon/doge-icon-21.jpg`,
      lang: "en-US",
      dir: "ltr"
    }
  }

  return webPush.sendNotification(sub, JSON.stringify(pushMessage));
}
