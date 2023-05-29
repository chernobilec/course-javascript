export default {

  login() {
    return new Promise((resolve, reject) => {
      VK.init({
        apiId: 7565225
      });
      
      VK.Auth.login(data => {
          if (data.session) {
              resolve();
          } else {
              reject(new Error('Не удалось авторизоваться'));
          }
      }, 2);
    });
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

    photos = await this.getFriendPhotos(id);
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
    const photo = this.getRandomElement(photos.items);
    const size = this.findSize(photo);
    return {
      friend,
      id: photo.id,
      url: photo.url
    };
  },

  getFriends() {
    const params = {
      fields: ['photo_100', 'photo_50'],
    };
    return this.callApi('friends.get', params);
  },

  getPhotos(user) {
    const params = {
      owner_id: user,
    };
    return this.callApi('photos.getAll', params);
  },

  async init() {
    this.photoCache = {};
    this.friends = await this.getFriends();
  },

};



