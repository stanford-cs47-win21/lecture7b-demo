
import AppConfig from '../Config/AppConfig';
import { createApi } from 'unsplash-js';

const api_config = AppConfig.unsplash[0];

const unsplash = createApi({
  accessKey: api_config.access,
  //...other fetch options
});

const getPopularPhotos = async (callback) => {
  let response = await fetch(`https://api.unsplash.com/photos/?client_id=${api_config.access}`)
  let json = await response.json()
  callback(json)
}

const getPhotosForUser = async (callback, username = "vorosbenisop") => {
  let response = await fetch(`https://api.unsplash.com/users/${username}/photos?client_id=${api_config.access}`)
  let json = await response.json()
  callback(json)
}

export { getPopularPhotos, getPhotosForUser }