import axios from 'axios';

// Checks whether backend API is online.
it('isBackendAPIOnline', async done => {
    let url: string = 'http://localhost:8000/api/';
    const response = await axios.get(url);
    expect(response.status).toBe(200);
    done();
});

export {};

