import { findVideoIdByUser, updateStats, addNewStats } from "../../lib/db/hasura";
import { verifyToken } from "../../lib/utils";

export default async function stats(req, res) {
    try{
        const token = req.cookies.token;
            if(!token){
                res.status(403).send({})
            } else{
                const inputParams = req.method === 'POST'? req.body : req.query;
                const {videoId} = inputParams;
                if (videoId) {
                    const userId = await verifyToken(token);
                    const findVideoId = await findVideoIdByUser(token, userId, videoId);
                    const isStatsExist = findVideoId?.length > 0;

                    if(req.method === 'POST') {
                        const {favourited, watched = true} = req.body;
                        if(isStatsExist) {
                            // UPDATE
                            const response = await updateStats(token, {
                                favourited, userId, watched, videoId
                            });
                            res.send({ response })
                        } else {
                            // Add it
                            const respons = await addNewStats(token, {
                                favourited, userId, watched, videoId
                            })
                            res.send({ respons })
                        }
                    } else {
                        if(isStatsExist) {
                            res.send(findVideoId)
                        } else {
                            res.status(404);
                            res.send({ user: null, msg: "Video not found" });
                        }
                    }
                }
            }
    } catch (err) {
        console.error("Error accured /stats", err)
        res.status(500).send({done: false, error: err?.message})
    }
}
