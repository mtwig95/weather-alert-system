import { Alert } from '../models/Alert';
import { getWeatherForLocation } from '../services/weatherService';
import { AlertDoc } from '../types/alert';
import { sendEmail } from '../utils/sendEmail';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const evaluateAlerts = async () => {
  const alerts = (await Alert.find()) as AlertDoc[];
  for (const alert of alerts) {
    try {
      const weather = await getWeatherForLocation(alert.location);
      // todo add as param
      const currentValue =
        weather[alert.parameter as 'temperature' | 'windSpeed' | 'precipitation'];
      console.log(
        `weather ${JSON.stringify(weather)} => ${currentValue} for alert ${JSON.stringify(alert)}`,
      );

      let triggered = false;

      if (alert.operator === '>' && currentValue > alert.threshold) {
        triggered = true;
      } else if (alert.operator === '<' && currentValue < alert.threshold) {
        triggered = true;
      }

      if (triggered) {
        if (alert.status !== 'triggered') {
          alert.status = 'triggered';
          alert.lastNotified = new Date();

          try {
            await sendEmail(
              alert.email,
              `🚨 Weather Alert Triggered for ${alert.location}`,
              `The condition ${alert.parameter} ${alert.operator} ${alert.threshold} was met.\nCurrent value: ${currentValue}`,
            );
          } catch (err) {
            console.error('❌ Failed to send email:', err);
          }
        }
      } else {
        alert.status = 'not_triggered';
      }

      alert.lastChecked = new Date();
      await alert.save();
    } catch (err) {
      console.error(`❌ Failed to evaluate alert for ${alert.location}`, err);
    }

    await sleep(1500); // prevent rate limit
  }
};
