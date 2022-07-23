import { request } from 'http';

export enum StatusApiUrl {
    Server = 'http://localhost:8080/api/_status',
    GoogleStub = 'http://localhost:8080/google/_status',
}

const sendRequest = (url: URL) => {
    return new Promise<number | undefined>((resolve, reject) => {
        const req = request(url, (res) => {
            return resolve(res.statusCode);
        });

        req.on('error', reject);
        req.end();
    });
};

export const waitForServer = async (url: URL) => {
    let isOk = false;
    let retries = 10;

    const sleep = () => new Promise((r) => setTimeout(r, 1000));

    while (!isOk) {
        const statusCode = (await sendRequest(url)) || 500;

        isOk = statusCode >= 200 && statusCode < 300;

        retries--;
        if (retries === 0) {
            throw new Error(`The server '${url}' is not operational`);
        }

        await sleep();
    }
};
