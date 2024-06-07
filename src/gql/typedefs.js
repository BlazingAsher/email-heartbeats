export const typeDefs = `#graphql
    type ConciseHeartbeat {
        email_name: String!
        last_heartbeat: Int
    }
    
    type Heartbeat {
        email_name: String!
        last_heartbeat: Int
        max_heartbeat_interval_seconds: Int!
        last_stale_notify: Int
        matching_criteria: String!
        endpoint: PushoverEndpoint,
        forwarding_token: String,
        description: String
    }
    
    type PushoverEndpoint {
        id: Int!
        user_key: String!
        timezone: String!
        description: String
    }
    
    type ApiToken {
        id: String!
        description: String
    }
    
    type Query {
        heartbeat(email_name: String!): Heartbeat
        heartbeats: [Heartbeat]
        staleHeartbeats: [Heartbeat]
        neverTriggeredHeartbeats: [Heartbeat]
        pushoverEndpoints: [PushoverEndpoint]
        pushoverEndpoint(id: Int!): PushoverEndpoint
        apiTokens: [ApiToken]
        apiToken(id: String!): ApiToken
    }
    
    type Mutation {
        createHeartbeat(email_name: String!, max_heartbeat_interval_seconds: Int!, matching_criteria: String!, endpoint_id: Int, forwarding_token: String, description: String): Heartbeat
        recordHeartbeat(email_name: String!): ConciseHeartbeat
        updateHeartbeat(email_name: String!, max_heartbeat_interval_seconds: Int, matching_criteria: String, endpoint_id: Int, forwarding_token: String, description: String): Heartbeat
        deleteHeartbeat(email_name: String!): Boolean
        createPushoverEndpoint(user_key: String!, timezone: String!, description: String): PushoverEndpoint
        updatePushoverEndpoint(id: Int!, user_key: String, timezone: String, description: String): PushoverEndpoint
        deleteEmailsOlderThan(timestamp: Int!): Int
        createApiToken(description: String): ApiToken
        updateApiToken(id: String!, description: String): ApiToken
        deleteApiToken(id: String!): Boolean
    }
`;
