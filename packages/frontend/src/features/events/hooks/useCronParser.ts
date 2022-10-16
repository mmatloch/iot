import CronParser from 'cron-parser';
import times from 'lodash/times';
import { useMemo } from 'react';

interface CronParserSuccess {
    cronDates: Date[];
    parsingCronError: undefined;
}

interface CronParserError {
    cronDates: undefined;
    parsingCronError: Error;
}

type UseCronParserResult = CronParserSuccess | CronParserError;

export const useCronParser = (cronExpression: string, numberOfIterations: number = 5): UseCronParserResult => {
    return useMemo(() => {
        try {
            const result = CronParser.parseExpression(cronExpression);
            const dates: Date[] = [];
            times(numberOfIterations, () => {
                dates.push(result.next().toDate());
            });

            return {
                cronDates: dates,
                parsingCronError: undefined,
            };
        } catch (e) {
            return {
                cronDates: undefined,
                parsingCronError: e as Error,
            };
        }
    }, [cronExpression]);
};
