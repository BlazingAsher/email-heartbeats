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
    }
    
    type Query {
        heartbeat(email_name: String!): Heartbeat
        heartbeats: [Heartbeat]
        staleHeartbeats: [Heartbeat]
        neverTriggeredHeartbeats: [Heartbeat]
    }
    
    type Mutation {
        createHeartbeat(email_name: String!, maximum_interval_seconds: Int!, matching_criteria: String!): Heartbeat
        recordHeartbeat(email_name: String!): ConciseHeartbeat
        updateHeartbeat(email_name: String!, maximum_interval_seconds: Int, matching_criteria: String): Heartbeat
    }
`;