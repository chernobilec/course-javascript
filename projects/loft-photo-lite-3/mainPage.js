import { doc } from 'prettier';
import model from './model';

export default {
  async getNextPhoto() {
    const { friend, id, url } = await model.getNextPhoto();
    this.setFriendAndPhoto(friend, id, url);
  },

  setFriendAndPhoto(friend, id, url) {

    const compPhoto = document.querySelector('.component-photo');
    const compHeaderPhoto = document.querySelector('.component-header-photo');
    const compHeaderName = document.querySelector('.component-header-name');

    compHeaderPhoto.style.backgroundImage = `url(${friend.photo_50}')`;
    compHeaderName.innerText = `${friend.first_name ?? ''} ${friend.last_name ?? ''}`;
    compPhoto.style.backgroundImage = `url(${url})`;
  },

  handleEvents() {
    let startPoint;

    document.querySelector('.component-photo').addEventListener('touchstart', e => {
      e.preventDefault();
      startPoint = {y: e.changedTouches[0].pageY};
    });

    document.querySelector('.component-photo').addEventListener('touchstart', async e => {
      const direct = e.changedTouches[0].pageY - startPoint.y;
      if (direct < 0) {
        await this.getNextPhoto();
      }
      
    });
  },
};
