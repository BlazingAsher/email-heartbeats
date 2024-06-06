import { db } from '../services/database.js';

export async function getEndpoints() {
    return db('pushover_endpoints').select();
}

export async function getEndpoint(id) {
    return db('pushover_endpoints').where({ id }).first();
}

export async function createEndpoint(user_token, description) {
    await db('pushover_endpoints').insert({
        user_token,
        description,
    });

    return getEndpoint(user_token);
}