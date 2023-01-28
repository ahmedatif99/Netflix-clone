async function queryGraphQl(operationsDoc, operationName, variables, token) {
  const result = await fetch(
    process.env.NEXT_PUBLIC_HASURA_ADMIN_URL,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-type": 'applecation/json',
      },
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );
  return await result.json();
}

export async function isNewUser (token, issuer) {
  const operationsDoc = `
    query isNewUser($issuer: String!) {
      users(where: {issuer: {_eq: $issuer}}) {
        email
        id
        issuer
      }
    }
  `;
  const res = await queryGraphQl(
    operationsDoc,
    "isNewUser",
    {
      issuer
    },
    token
  );
  return res?.data?.users?.length === 0;
}

export async function createNewUser (token, issuer, publicAddress, email) {
  const operationsDoc = `
  mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
      }
    }
  }
  `;
  const res = await queryGraphQl(
    operationsDoc,
    "createNewUser",
    {
      issuer,
      email,
      publicAddress,
    },
    token
  );
  return res;
}

export async function findVideoIdByUser(token, userId, videoId) {
  const operationsDoc = `
    query findVideoIdByUserId($userId: String!, $videoId: String!) {
      stats(where: { userId: { _eq: $userId }, videoId: { _eq: $videoId } }) {
        id
        favourited
        userId
        videoId
        watched
      }
    }
  `;

  const res = await queryGraphQl(
    operationsDoc,
    "findVideoIdByUserId",
    {
      userId,
      videoId,
    },
    token
  );
  return res?.data?.stats;
}

export async function updateStats (token, { favourited, userId, watched, videoId }) {

  const operationsDoc = `
    mutation updateStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
      update_stats(
        _set: {watched: $watched, favourited: $favourited}, 
        where: {
          userId: {_eq: $userId}, 
          videoId: {_eq: $videoId}
        }) {
        returning {
          favourited
          userId
          watched
          videoId
        }
      }
    }
  `;

  const res = await queryGraphQl(
    operationsDoc,
    "updateStats",
    { favourited, userId, watched, videoId },
    token
  );
  return res;
}

export async function addNewStats (token, { favourited, userId, watched, videoId }) {

  const operationsDoc = `
    mutation insertStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
      insert_stats_one(
        object: {
          userId: $userId, 
          videoId: $videoId
          favourited: $favourited,
          watched: $watched, 
      }) {
        id
        userId
        videoId
        favourited
        watched
      }
    }
  `;

  const res = await queryGraphQl(
    operationsDoc,
    "insertStats",
    { favourited, userId, watched, videoId },
    token
  );
  return res;
}

export async function getWatchedVideos(userId, token) {
  const operationsDoc = `
  query watchedVideos($userId: String!) {
    stats(where: {
      watched: {_eq: true}, 
      userId: {_eq: $userId},
    }) {
      videoId
    }
  }
`;

  const res = await queryGraphQl(
    operationsDoc,
    "watchedVideos",
    {
      userId,
    },
    token
  );

  return res?.data?.stats;
}

export async function getMyListVideos(userId, token) {
  const operationsDoc = `
  query myListVideos($userId: String!) {
    stats(where: {
      favourited: {_eq: 1}, 
      userId: {_eq: $userId},
    }) {
      videoId
    }
  }
`;

  const res = await queryGraphQl(
    operationsDoc,
    "myListVideos",
    {
      userId,
    },
    token
  );

  return res?.data?.stats;
}
