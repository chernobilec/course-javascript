const http = require('node:http');
const https = require('node:https');
const url = require('node:url');

const DB = {
    tokens: new Map(),
    likes: new Map(),
    comments: new Map(),
};

const methods = {

    like(req, res, url, vkUser) {
        const photoID = url.searchParams.get('photo');
        let photoLikes = DB.likes.get(photoID);

        if (!photoLikes) {
            photoLikes = new Map();
            DB.likes.set(photoID, photoLikes);
        }

        if (photoLikes.get(vkUser.id)) {
            photoLikes.delete(vkUser.id);
            return {
                likes: photoLikes.size,
                liked: false
            };
        }

        photoLikes.set(vkUser.id, true);
        return {
            likes: photoLikes.size,
            liked: true
        };
    },

    photoStats(req, res, url, vkUser) {
        const photoID = url.searchParams.get('photo');
        const photoLikes = DB.likes.get(photoID);
        const photoComments = DB.comments.get(photoID);

        return {
            likes: photoLikes?.size ?? 0,
            liked: photoLikes?.has(vkUser.id) ?? false,
            comments: photoComments?.length ?? 0,
        };
    },

    postComment(req, res, url, vkUser, body) {
        const photoID = url.searchParams.get('photo');
        let photoComments = DB.comments.get(photoID);

        if (!photoComments) {
            photoComments = [];
            DB.comments.set(photoID, photoComments);
        }

        photoComments.unshift({
            user: vkUser,
            test: body.text
        });
    },

    getComments(req, res, url) {
        const photoID = url.searchParams.get('photo');
        return DB.comments.get(photoID) ?? [];
    },

};

http
    .createServer(async (req, res) => {
        const token = req.headers['vk_token'];
        const parsed = new url.URL(req.url, 'http://localhost');
        const vkUser = await getMe(token);
        const body = await readBody(req);
        const method = parsed.searchParams.get('method');
        const responseData = await methods[method]?.(
            req,
            res,
            parsed,
            vkUser,
            body
        );

        res.end(JSON.stringify(responseData ?? null));
    })
    .listen('8888');

async function readBody(req) {
    if (req.method === 'GET') {
        return null;
    }

    return new Promise((resolve) => {
        let body = '';
        req
            .on('data', (chunk) => {
                body += chunk;
            })
            .on('end', () => resolve(JSON.parse(body)));
    });
}

async function getVKUser(token) {
    const body = await new Promise((resolve, reject) =>
        https
            .get(
                `https://api.vk.com/method/users.get?access_token=${token}&fields=photo_50&v=5.120`
            )
            .on('response', (res) => {
                let body = '';

                res.setEncoding('utf8');
                res
                    .on('data', (chunk) => {
                        body += chunk;
                    })
                    .on('end', () => resolve(JSON.parse(body)));
            })
            .on('error', reject)
    );

    return body.response[0];
}

async function getMe(token) {
    const existing = DB.tokens.get(token);

    if (existing) {
        return existing;
    }

    const user = getVKUser(token);

    DB.tokens.set(token, user);

    return user;
}