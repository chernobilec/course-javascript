import model from './model';
import profilePage from './profilePage';
import pages from './pages';

export default {
  async getNextPhoto() {
    const { friend, id, url } = await model.getNextPhoto();
    this.setFriendAndPhoto(friend, id, url);
  },

  setFriendAndPhoto(friend, id, url) {

    const compPhoto = document.querySelector('.component-photo');
    const compHeaderPhoto = document.querySelector('.component-header-photo');
    const compHeaderName = document.querySelector('.component-header-name');
    const compFooterPhoto = document.querySelector('.component-footer-photo');

    this.friend = friend;

    compHeaderPhoto.style.backgroundImage = `url('${friend.photo_50}')`;
    compHeaderName.innerText = `${friend.first_name ?? ''} ${friend.last_name ?? ''}`;
    compPhoto.style.backgroundImage = `url(${url})`;
    compFooterPhoto.style.backgroundImage = `url('${model.me.photo_50}')`;
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

    document
        .querySelector('.component-header-profile-link')
        .addEventListener('click', async () => {
          await profilePage.setUser(this.friend);
          pages.openPage('profile');
        });

    document
        .querySelector('.component-footer-container-profile-link')
        .addEventListener('click', async () => {
          await profilePage.setUser(model.me);
          pages.openPage('profile');
        });

  },
};
