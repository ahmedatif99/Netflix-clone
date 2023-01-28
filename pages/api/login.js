import { mAdmin } from "../../lib/db/magic";
import jwt from "jsonwebtoken";
import { createNewUser, isNewUser } from "../../lib/db/hasura";
import { setTokenCookie } from "../../lib/cookies";

export default async function login(req, res) {
    if (req.method === 'POST') {
        try {
            const auth = req.headers.authorization;
            const didToken = auth ? auth.substr(7) : '';
            const metaData = await mAdmin.users.getMetadataByToken(didToken);
            const { issuer, publicAddress, email } = metaData;
            // create jwt token
            const token = jwt.sign({
                issuer,
                publicAddress,
                email,
                "iat": Math.floor(Date.now() / 1000),
                "exp": Math.floor(Date.now() / 1000 + (7 * 24 * 60 * 60)),
                "https://hasura.io/jwt/claims": {
                  "x-hasura-allowed-roles": ["user", "admin"],
                  "x-hasura-default-role": "user",
                  "x-hasura-user-id": `${issuer}`
                },
            },process.env.NEXT_PUBLIC_HASURA_GRAPHQL_JWT_SECRET,
            );
            // CHECK IF USER EXISTS
            const isNewUserQuery = await isNewUser(token, issuer);
            isNewUserQuery && (await createNewUser(token, issuer, publicAddress, email));
            setTokenCookie(token, res);
            res.send({ done: true });
        } catch (err) {
            console.error("Sth went wrong logging in", err);
            res.status(500).send({done: false});
        }
    } else {
        res.send({done: false});
    }
}
