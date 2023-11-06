/* global chrome */

window.onload = () => {
  document.querySelector('button').addEventListener('click', () => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      console.log(token);
      const API_KEY = 'AIzaSyA9kz5DXfkmVJn7rZyHwCcn5Yso_zsZEqo';

      let init = {
        method: 'GET',
        async: true,
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        'contentType': 'json'
      };
      fetch(
        `https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=${API_KEY}`,
        init)
        .then((response) => response.json())
        .then(function (data) {
          console.log(data)
        });
    });
  });
};