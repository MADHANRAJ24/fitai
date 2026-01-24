import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';

export const PushService = {
    async init() {
        if (!Capacitor.isNativePlatform()) {
            console.log("Push Notifications only work on native devices.");
            return;
        }

        // 1. Request Permission
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
            console.log("User denied push permissions");
            return;
        }

        // 2. Register
        await PushNotifications.register();

        // 3. Listeners
        PushNotifications.addListener('registration', (token) => {
            console.log('Push Registration Token:', token.value);
            // TODO: Send to backend
        });

        PushNotifications.addListener('registrationError', (error) => {
            console.error('Push Registration Error:', error);
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Push Received:', notification);
            toast.info(notification.title || "New Message", {
                description: notification.body
            });
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
            console.log('Push Action Performed:', notification);
            // Navigate if needed
        });
    }
}
