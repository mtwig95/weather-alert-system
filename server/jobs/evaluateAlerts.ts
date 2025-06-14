import {Alert} from '../models/Alert';
import {getWeatherForLocation} from '../services/weatherService';
import {AlertDoc} from '../types/alert';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const evaluateAlerts = async () => {
    console.log('⏱️ Evaluating alerts...');

    const alerts = await Alert.find() as AlertDoc[];
    for (const alert of alerts) {
        try {
            const weather = await getWeatherForLocation(alert.location);
            // todo add as param
            const currentValue = weather[alert.parameter as 'temperature' | 'windSpeed' | 'precipitation'];
            console.log(`weather ${JSON.stringify(weather)} => ${currentValue} for alert ${JSON.stringify(alert)}`);

            let triggered = false;

            if (alert.operator === '>' && currentValue > alert.threshold) {
                triggered = true;
            } else if (alert.operator === '<' && currentValue < alert.threshold) {
                triggered = true;
            }

            alert.status = triggered ? 'triggered' : 'not_triggered';
            alert.lastChecked = new Date();
            await alert.save();

        } catch (err) {
            console.error(`❌ Failed to evaluate alert for ${alert.location}`, err);
        }
        //to prevent rate limit
        await sleep(1500);
    }

    console.log('✅ Alert evaluation done.');
};


