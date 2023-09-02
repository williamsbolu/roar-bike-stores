// export const ROARBIKES_API = 'http://127.0.0.1:3000';
export const ROARBIKES_API = 'https://roar-bikes-store-api.onrender.com';

export function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

export async function getAllItems(queryParams) {
    // await sleep(10000);
    const response = await fetch(`${ROARBIKES_API}/api/v1/items/${queryParams}`);

    if (!response.ok) throw new Error('Could not get data, try again later!');

    const data = await response.json();

    return data.data;
}

export async function getRecentTours() {
    // await sleep(10000);
    const response = await fetch(`${ROARBIKES_API}/api/v1/items/recent-items`);

    if (!response.ok) throw new Error('Could not get data, try again later!');

    const data = await response.json();

    return data.data;
}

export async function getItem(id) {
    const res = await fetch(`${ROARBIKES_API}/api/v1/items/${id}`);

    if (!res.ok) {
        const err = await res.json();
        throw { message: err.message, statusCode: err.statusCode };
    }

    const data = await res.json();

    return data.data;
}

// export async function getUserData(token) {
//     const res = await fetch(`${ROARBIKES_API}/api/v1/users/me`, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//         },
//     });

//     if (!res.ok) {
//         throw new Error('Error loading user data!');
//     }

//     const userData = await res.json();
//     return userData.data.data;
// }

export async function getUserData() {
    const res = await fetch(`${ROARBIKES_API}/api/v1/users/me`, {
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error('Error loading user data!');
    }

    const userData = await res.json();
    return userData.data.data;
}
