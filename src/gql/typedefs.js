export const typeDefs = `#graphql
    type ConciseHeartbeat {
        email_name: String!
        last_heartbeat: Int
    }
    
    type Heartbeat {
        email_name: String!
        last_heartbeat: Int
        max_heartbeat_interval_seconds: Int!
        matching_criteria: String!
        endpoint: PushoverEndpoint
    }
    
    type PushoverEndpoint {
        id: Int!
        user_key: String!
        description: String
    }
    
    type Query {
        heartbeat(email_name: String!): Heartbeat
        heartbeats: [Heartbeat]
        staleHeartbeats: [Heartbeat]
        neverTriggeredHeartbeats: [Heartbeat]
        pushoverEndpoints: [PushoverEndpoint]
        pushoverEndpoint(id: Int!): PushoverEndpoint
    }
    
    type Mutation {
        createHeartbeat(email_name: String!, maximum_interval_seconds: Int!, matching_criteria: String!, endpoint_id: Int): Heartbeat
        recordHeartbeat(email_name: String!): ConciseHeartbeat
        updateHeartbeat(email_name: String!, maximum_interval_seconds: Int, matching_criteria: String, endpoint_id: Int): Heartbeat
        deleteHeartbeat(email_name: String!): Boolean
        createPushoverEndpoint(user_key: String!, description: String): PushoverEndpoint
    }
`;