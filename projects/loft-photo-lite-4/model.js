const PERM_FRIENDS = 2;
const PERM_PHOTOS = 4;
const APP_ID = 51600787;

export default {

  login() {
    return new Promise((resolve, reject) => {
      VK.init({
        apiId: APP_ID
      });
      
      VK.Auth.login(data => {
          if (data.session) {
              resolve(data);
          } else {
              reject(new Error('Не удалось авторизоваться'));
          }
      }, 
      PERM_FRIENDS | PERM_PHOTOS
      );
    });
  },

  logout() {
    return new Promise((resolve) => VK.Auth.revokeGrants(resolve));
  },

  callAPI(method, params) {
    params.v = '5.131';
  
    return new Promise((resolve, reject) => {
        VK.api(method, params, (data) => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.response);
            }
        });
    })
  },

  getRandomElement(array) {
    if(!Array.isArray(array) || array.length === 0) {
      throw new Error ('empty array');
    }
    const ix = parseInt(Math.random() * (array.length - 1));
    return array[ix];
  },

  async getFriendPhotos(id) {
    let photos = this.photoCache[id];
    if (photos) {
      return photos;
    }

    photos = await this.getPhotos(id);
    this.photoCache[id] = photos;
    return photos;
  },

  findPhotoSize(photo) {
    const size = photo.sizes.find((size) => size.width >= 360);
    if (!size) {
      return photo.sizes.reduce((biggest, current) =>{
        if (current.width > biggest.width) {
          return current;
        }

        return biggest;
      },
      photo.sizes[0]);
    }
    return size;
  },

  async getNextPhoto(array, ) {
    const friend = this.getRandomElement(this.friends.items);
    const photos = await this.getFriendPhotos(friend.id);
    console.log(photos)
    const photo = this.getRandomElement(photos.items);
    const size = this.findPhotoSize(photo);
    return {
      friend,
      id: photo.id,
      url: size.url
    };
  },

  getFriends() {
    const params = {
      fields: ['photo_100', 'photo_50'],
    };
    return this.callAPI('friends.get', params);
  },

  getPhotos(user) {
    const params = {
      owner_id: user,
    };
    return this.callAPI('photos.getAll', params);
  },

  async init() {
    this.photoCache = {};
    this.friends = await this.getFriends();
    [this.me] = await this.getUsers();
  },

  getUsers(ids) {
    const params = {
      fields: [`photo_50`, `photo_100`],
    };

    if (ids) {
      params.user_ids = ids;
    }

    return this.callAPI('users.get', params);
  },

};

