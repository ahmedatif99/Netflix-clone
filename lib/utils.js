import jwt from "jsonwebtoken";
export async function verifyToken(token) {
    if(token) {
        const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_HASURA_GRAPHQL_JWT_SECRET);
        return await decodedToken.issuer; 
    }
    return null;        
}